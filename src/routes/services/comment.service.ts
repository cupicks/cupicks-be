import {
    CreateCommentDto,
    NotFoundException,
    UpdateCommentDto,
    DeleteCommentDto,
    GetCommentDto,
    BadRequestException,
} from "../../models/_.loader";
import { CommentRepository, RecipeRepository, AuthRepository } from "../repositories/_.exporter";
import { MysqlProvider, MulterProvider, DayjsProvider } from "../../modules/_.loader";
import { ICommentPacket } from "../../models/_.loader";
import { BedgePublisher } from "../publishers/_.exporter";

export class CommentService {
    private commentRepository: CommentRepository;
    private recipeRepository: RecipeRepository;
    private authRepository: AuthRepository;

    private mysqlProvider: MysqlProvider;
    private dayjsProvider: DayjsProvider;

    private bedgePublisher: BedgePublisher;

    constructor() {
        this.commentRepository = new CommentRepository();
        this.mysqlProvider = new MysqlProvider();
        this.recipeRepository = new RecipeRepository();
        this.authRepository = new AuthRepository();
        this.dayjsProvider = new DayjsProvider();

        this.bedgePublisher = new BedgePublisher();
    }
    // Create
    public createComment = async (commentDto: CreateCommentDto): Promise<object[]> => {
        const conn = await this.mysqlProvider.getConnection();

        const { userId, recipeId } = commentDto;
        try {
            const createdAt = this.dayjsProvider.getDayjsInstance().format(this.dayjsProvider.getClientFormat());

            await conn.beginTransaction();

            const findRecipeById: boolean = await this.recipeRepository.findRecipeById(conn, recipeId);
            if (!findRecipeById) throw new NotFoundException("존재하지 않는 레시피입니다.", "RECIPE-001");

            const isExists: boolean = await this.authRepository.isExistsById(conn, userId);
            if (isExists === false)
                throw new NotFoundException(`이미 탈퇴한 사용자의 AccessToken 입니다.`, "AUTH-007-01");

            const findUserById = await this.authRepository.findUserById(conn, userId);

            const createComment = await this.commentRepository.createComment(conn, commentDto);
            const commentId = createComment;

            await this.commentRepository.createRecipeComment(conn, commentDto, commentId);

            await conn.commit();

            // Bedge System
            const targetRecipe = await this.recipeRepository.getRecipe(conn, recipeId);
            this.bedgePublisher.handleActCommentCount(userId);
            this.bedgePublisher.handleGetCommentCount(targetRecipe.userId);

            return [
                {
                    userId: commentDto.userId,
                    nickname: commentDto.nickname,
                    userImageUrl: findUserById.imageUrl,
                    userResizedUrl: findUserById.resizedUrl,
                    recipeId: commentDto.recipeId,
                    commentId: commentId,
                    comment: commentDto.comment,
                    imageUrl: commentDto.imageUrl ?? null,
                    resizedUrl: commentDto.resizedUrl ?? null,
                    createdAt: createdAt,
                    updatedAt: createdAt,
                },
            ];
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };

    // Get

    public getComments = async (getCommentDto: GetCommentDto): Promise<ICommentPacket[]> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const findRecipeById: boolean = await this.recipeRepository.findRecipeById(conn, getCommentDto.recipeId);
            if (!findRecipeById) throw new NotFoundException("존재하지 않는 레시피입니다.", "RECIPE-001");

            const getComments: ICommentPacket[] = await this.commentRepository.getComments(conn, getCommentDto);

            return getComments;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };

    // Update

    public updateComment = async (updateCommentDto: UpdateCommentDto): Promise<object> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const isExistsByUserId: boolean = await this.authRepository.isExistsById(conn, updateCommentDto.userId);
            if (isExistsByUserId === false)
                throw new NotFoundException(`이미 탈퇴한 사용자의 AccessToken 입니다.`, "AUTH-007-01");

            const findUserById = await this.authRepository.findUserById(conn, updateCommentDto.userId);

            const isExistsByCommentId: ICommentPacket[] = await this.commentRepository.findCommentByCommentId(
                conn,
                updateCommentDto.commentId,
            );
            if (!isExistsByCommentId) throw new NotFoundException("존재하지 않는 코멘트입니다.", "COMMENT-001");

            const isAuthenticated = await this.commentRepository.isAuthenticated(conn, updateCommentDto);
            if (!isAuthenticated) throw new BadRequestException("내가 작성한 코멘트가 아닙니다.", "COMMENT-002");

            const findCommentById: ICommentPacket[] = await this.commentRepository.findCommentByCommentId(
                conn,
                updateCommentDto.commentId,
            );
            const findCommentResult = findCommentById;
            const imageValue = findCommentResult !== null ? findCommentResult[0].image_url?.split("/")[4] : null;

            if (imageValue !== null && imageValue !== "undefined" && typeof imageValue === "string") {
                MulterProvider.deleteImage(imageValue, "comment");
                MulterProvider.deleteImage(imageValue, "comment-resized");
            }

            await this.commentRepository.updateCommentById(conn, updateCommentDto);

            await conn.commit();

            return {
                userId: updateCommentDto.userId,
                nickname: updateCommentDto.nickname,
                userImageUrl: findUserById.imageUrl,
                userResizedUrl: findUserById.resizedUrl,
                commentId: updateCommentDto.commentId,
                comment: updateCommentDto.comment,
                imageUrl: updateCommentDto.imageUrl ?? null,
                resizedUrl: updateCommentDto.resizedUrl ?? null,
                createdAt: findCommentById[0].createdAt,
                updatedAt: findCommentById[0].updatedAt,
            };
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };

    // Delete

    public deleteComment = async (deleteCommentDto: DeleteCommentDto): Promise<void> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            await conn.beginTransaction();

            const isExists: boolean = await this.authRepository.isExistsById(conn, deleteCommentDto.userId);
            if (isExists === false)
                throw new NotFoundException(`이미 탈퇴한 사용자의 AccessToken 입니다.`, "AUTH-007-01");

            const isExistsByCommentId = await this.commentRepository.findCommentByCommentId(
                conn,
                deleteCommentDto.commentId,
            );
            if (!isExistsByCommentId) throw new NotFoundException("존재하지 않는 코멘트입니다.", "COMMENT-001");

            const isAuthenticated = await this.commentRepository.isAuthenticated(conn, deleteCommentDto);
            if (!isAuthenticated) throw new BadRequestException("내가 작성한 코멘트가 아닙니다.", "COMMENT-002");

            const findCommentById = await this.commentRepository.findCommentByCommentId(
                conn,
                deleteCommentDto.commentId,
            );
            const findCommentResult = findCommentById[0].image_url;

            const imageValue = findCommentResult !== null ? findCommentResult?.split("/")[4] : null;

            if (imageValue !== null && imageValue !== "undefined" && typeof imageValue === "string") {
                MulterProvider.deleteImage(imageValue, "comment");
                MulterProvider.deleteImage(imageValue, "comment-resized");
            }

            await this.commentRepository.deleteCommentById(conn, deleteCommentDto.commentId);

            await conn.commit();
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    };
}

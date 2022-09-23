import {
    CreateCommentDto,
    NotFoundException,
    UpdateCommentDto,
    DeleteCommentDto,
    GetCommentDto,
    BadRequestException,
} from "../../models/_.loader";
import { CommentRepository, RecipeRepository, AuthRepository } from "../repositories/_.exporter";
import { MysqlProvider } from "../../modules/_.loader";
import { MulterProvider } from "../../modules/_.loader";
import { ICommentPacket } from "../../models/_.loader";
import { ICommentResponse } from "../../constants/_.loader";

export class CommentService {
    private commentRepository: CommentRepository;
    private mysqlProvider: MysqlProvider;
    private recipeRepository: RecipeRepository;
    private authRepository: AuthRepository;

    constructor() {
        this.commentRepository = new CommentRepository();
        this.mysqlProvider = new MysqlProvider();
        this.recipeRepository = new RecipeRepository();
        this.authRepository = new AuthRepository();
    }
    // Create
    public createComment = async (commentDto: CreateCommentDto): Promise<ICommentResponse> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            const date = new Date().toISOString().slice(0, 19).replace("T", " ");

            await conn.beginTransaction();

            const findRecipeById = await this.recipeRepository.findRecipeById(conn, commentDto.recipeId);
            if (!findRecipeById) throw new NotFoundException("존재하지 않는 레시피입니다.", "RECIPE-001");

            const isExists = await this.authRepository.isExistsById(conn, commentDto.userId);
            if (isExists === false)
                throw new NotFoundException(`이미 탈퇴한 사용자의 AccessToken 입니다.`, "AUTH-007-01");

            const createComment = await this.commentRepository.createComment(conn, commentDto);
            const commentId = createComment;

            await this.commentRepository.createRecipeComment(conn, commentDto, commentId);

            await conn.commit();

            return {
                commentId,
                createdAt: date,
                updatedAt: date,
            };
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

    public updateComment = async (updateCommentDto: UpdateCommentDto): Promise<ICommentPacket[]> => {
        const conn = await this.mysqlProvider.getConnection();
        try {
            const date = new Date().toISOString().slice(0, 19).replace("T", " ");

            await conn.beginTransaction();

            const isExistsByUserId = await this.authRepository.isExistsById(conn, updateCommentDto.userId);
            if (isExistsByUserId === false)
                throw new NotFoundException(`이미 탈퇴한 사용자의 AccessToken 입니다.`, "AUTH-007-01");

            const isExistsByCommentId = await this.commentRepository.findCommentByCommentId(
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

            return findCommentById;
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

            const isExists = await this.authRepository.isExistsById(conn, deleteCommentDto.userId);
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

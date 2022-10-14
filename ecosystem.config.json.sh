# file name : ecosystem.config.json.sh

# echo LAST UPDATED DATE
date -r $0

NEEDS_NUMBER_OF_PARAMS=30;
# validate NUMBER of PARAMS
if [ $# -eq ${NEEDS_NUMBER_OF_PARAMS} ]
then
        echo "Parameter Validation Pass : $# of PARAMS"
else
        echo "Parameter Validation Fail : $# of PARAMS (NEED : ${NEEDS_NUMBER_OF_PARAMS})"
        echo "====================================="
        echo "Create-Ecosystem.config.json is failed"
        echo "The parameters required to create the file were not passed."
        echo "Please check the files included in .env.dev and .env.test."
        echo "process.exit(1)"
        echo "====================================="
        exit
fi

MAIN_PORT=${2}
READ_PORT=$((${2} + 1))

MAIN_MYSQL_HOST=${16}
SUB_MYSQL_HOST=${30}

ECOSYSTEM_CONFIG_JSON=$(cat <<EOF
{
        "apps": [
                {
                        "name": "app",
                        "script": "./dist/server.js",
                        "instances": 2,
                        "instance_var": "APP_INSTANCE_SEQ",
                        "exec_mode": "cluster",
                        "listen_timeout": 10000,
                        "restart_delay": 10000,
                        "wait_ready": true,
                        "Cwd": ".",
                        "env_production": {
                                "NODE_ENV": "${1}",

                                "PORT": "${MAIN_PORT}",
                                "SALT": "${3}",

                                "CORS_URL_ONE_WITHOUT_PORT": "${4}",
                                "CORS_URL_TWO_WITHOUT_PORT": "${5}",
                                "CORS_URL_THREE_WITHOUT_PORT": "${6}",
                                "CORS_URL_FOUR_WITHOUT_PORT": "${7}",
                                
                                "FROTN_REDIRECT_URL_WITHOUT_PORT": "${8}",
                                "SERVER_URL_WITH_PORT": "${9}",

                                "JWT_ACCESS_EXPIRED_IN": "${10}",
                                "JWT_REFRESH_EXPIRED_IN": "${11}",
                                "JWT_VERIFY_EXPIRED_IN": "${12}",
                                "JWT_RESET_EXPIRED_IN": "${13}",
                                "JWT_HASH_ALGOIRHTM": "${14}",

                                "HASH_PASSPHRASE": "${15}",

                                "MYSQL_HOST": "${MAIN_MYSQL_HOST}",
                                "MYSQL_USER": "${17}",
                                "MYSQL_DATABASE": "${18}",
                                "MYSQL_PASSWORD": "${19}",
                                "MYSQL_CONNECTION_LIMIT": "${20}",

                                "S3_ACCESS_KEY": "${21}",
                                "S3_SECRET_KEY": "${22}",

                                "BUCKET": "${23}",
                                "REGION": "${24}",

                                "SES_API_VERSION": "${25}",
                                "SES_API_REGION": "${26}",
                                "SES_ACCESS_KEY": "${27}",
                                "SES_SECRET_KEY": "${28}",
                                "SES_SENDER_EMAIL": "${29}"
                        }
                },
                {
                        "name": "app-for-read-replica",
                        "script": "./dist/server.js",
                        "instances": 2,
                        "instance_var": "APP_INSTANCE_SEQ",
                        "exec_mode": "cluster",
                        "listen_timeout": 10000,
                        "restart_delay": 10000,
                        "wait_ready": true,
                        "Cwd": ".",
                        "env_production": {
                            "NODE_ENV": "${1}",

                            "PORT": "${READ_PORT}",
                            "SALT": "${3}",

                            "CORS_URL_ONE_WITHOUT_PORT": "${4}",
                            "CORS_URL_TWO_WITHOUT_PORT": "${5}",
                            "CORS_URL_THREE_WITHOUT_PORT": "${6}",
                            "CORS_URL_FOUR_WITHOUT_PORT": "${7}",
                            
                            "FROTN_REDIRECT_URL_WITHOUT_PORT": "${8}",
                            "SERVER_URL_WITH_PORT": "${9}",

                            "JWT_ACCESS_EXPIRED_IN": "${10}",
                            "JWT_REFRESH_EXPIRED_IN": "${11}",
                            "JWT_VERIFY_EXPIRED_IN": "${12}",
                            "JWT_RESET_EXPIRED_IN": "${13}",
                            "JWT_HASH_ALGOIRHTM": "${14}",

                            "HASH_PASSPHRASE": "${15}",

                            "MYSQL_HOST": "${SUB_MYSQL_HOST}",
                            "MYSQL_USER": "${17}",
                            "MYSQL_DATABASE": "${18}",
                            "MYSQL_PASSWORD": "${19}",
                            "MYSQL_CONNECTION_LIMIT": "${20}",

                            "S3_ACCESS_KEY": "${21}",
                            "S3_SECRET_KEY": "${22}",

                            "BUCKET": "${23}",
                            "REGION": "${24}",

                            "SES_API_VERSION": "${25}",
                            "SES_API_REGION": "${26}",
                            "SES_ACCESS_KEY": "${27}",
                            "SES_SECRET_KEY": "${28}",
                            "SES_SENDER_EMAIL": "${29}"
                        }
                }
        ]
}
EOF
);

echo "$ECOSYSTEM_CONFIG_JSON" > ecosystem.config.json

## References - https://gist.github.com/zymr-keshav/0a3682edf360d241addae67d687c13e4#file-kep-sh-L87
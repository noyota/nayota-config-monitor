

FROM node:10-alpine
WORKDIR /app
# COPY package*.json ./
COPY . .
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories

RUN apk update \
        && apk upgrade \
        && apk add --no-cache openssh-server \
        openssh-sftp-server \
        tzdata \
        alpine-sdk \
        python &&\
        yarn config set registry https://registry.npm.taobao.org &&\
        yarn add global node-gyp && \
        yarn && \
        yarn build && \
        rm -rf /var/cache/apk/* &&\
        apk del alpine-sdk python &&\
        yarn remove global node-gyp&&\
        cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && \
        sed -i "s/#PermitRootLogin.*/PermitRootLogin yes/g" /etc/ssh/sshd_config && \
        ssh-keygen -t rsa -P "" -f /etc/ssh/ssh_host_rsa_key && \
        ssh-keygen -t ecdsa -P "" -f /etc/ssh/ssh_host_ecdsa_key && \
        ssh-keygen -t ed25519 -P "" -f /etc/ssh/ssh_host_ed25519_key && \
        echo "root:admin" | chpasswd &&\
        chmod 755 run.sh

EXPOSE 22 4040

CMD ["sh","run.sh"]



# 生产环境，无ssh
# FROM node:10-alpine
# WORKDIR /app
# COPY . .
# RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories &&\
#     apk add --no-cache alpine-sdk python && \
#     yarn config set registry https://registry.npm.taobao.org && \
#     yarn add global node-gyp && \
#     yarn && \
#     yarn build && \
#     yarn remove global node-gyp && \
#     apk del alpine-sdk python
# EXPOSE 4040
# CMD ["node", "server"]

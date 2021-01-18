FROM arm32v7/node:10.15.3
#基础镜像使用官方提供的nodejs 10版本根据alpine系统镜像构建而来的镜像
WORKDIR /app/nayota-config-monitor
#创建一个工作目录，作为之后代码运行的目录
#COPY . .
##把当前目录下的所有内容（源代码）复制到容器内的目录中
#
##接下来开始配置系统环境，由于alpine是最精简原则，所有可能要用到的东西都要手动安装
RUN apt-get update && \
    apt-get -y install ffmpeg
#EXPOSE 4043
#暴露4043端口
CMD ["node", "server"]
#容器启动时，运行node server指令
#CMD方式一次只能运行一条指令，但是容器技术本就鼓励孤立服务，因此这足以满足大部分要求，
#在需要单容器多服务的场合，可以用脚本的形式，将多指令写进脚本，CMD运行脚本，不过不建议

#指定基础镜像
FROM nginx
MAINTAINER resume
WORKDIR /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
#删除nginx默认的配置文件，替换成自己写的配置文件
ADD default.conf /etc/nginx/conf.d/ 
#把dist文件夹拷贝到nginx的启动根目录下
COPY dist/ /usr/share/nginx/html/  
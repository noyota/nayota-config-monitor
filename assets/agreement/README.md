# 协议编写说明文档
## 协议规则
1. 协议本身是一个构造函数
2. 协议通过传入设备数据和校验,new出一个设备协议对象,拥有对此类设备的find,changeAddr(config),read,write,encode,decode方法函数
3. 协议本身不直接操作收发,所有的方法函数,只是根据自己的功能形成对应的命令字符串和结果
4. 收发的命令16进制字符串建议都为小写字母,并且单条指令长度建议不超过50个字节,如超过50个字节建议根据实际情况分离命令为多条(nayota1.0和2.0项目协议建议大写)
5. nayota3.0系统的协议与原结构有较大改动,请根据以下说明来升级协议
6. 所有的地址包括LORA地址,设备地址,参数地址全部使用16进制字符串传入和输出,传入长度不定,不需要高位补零,由协议中自行补充(原来并无此规定,所以协议中出现各种不同标准的地址内容)
7. 新增导航函数navi

## 老的设备协议修改为新协议需要调整内容
### 1. 传入的options和validate与原来不同
传入的options中的字段名改变
- devicename => name
- defaulttest => defaultCheck  类型从字符串变为json对象
- defaultbutton => defaultOperate 类型从字符串变为json对象
- defaultparameterdata => attribute 类型从字符串变为 数组
- validate 原来是crc16校验函数,现在为一个校验函数的集合,共有函数he(和校验),crc16
- address => shortAddress
### 2. find([startAddr], [endAddr])
可传入startAddr和endAddr 来缩小搜索范围
注意修改的参数有:
 - this.validate =>this.validate.crc16
 - this.options.devicename => this.options.name
 - defaulttest => defaultCheck 并且不需要 JSON.parse转换
 - defaultbutton => defaultOperate 并且不需要 JSON.parse转换
 - defaultparameterdata => attribute 并且不需要 JSON.parse转换
 - address => shortAddress 
 - 所有的命令,发送和返回原推荐是大写,现在推荐为小写
### 3. changeAddr
传入参数options对象,详细键值
 - shortAddress 必需,改写的地址
 - oldAddr 原地址  
 - address => shortAddress 
注意修改的参数有:
 - address => shortAddress
 - devicename => name
 - defaulttest => defaultCheck  类型从字符串变为json对象
 - defaultbutton => defaultOperate 类型从字符串变为json对象
 - defaultparameterdata => attribute 类型从字符串变为 数组
 - validate原来是crc16校验函数,现在为一个校验函数的集合,共有函数he(和校验),crc16
### 4. readOne 和 readAll 全部取消,变成单一的read
读操作合并了读单个,读多个和读全部,根据传入的code(原来是地址,现在变地址数组)确定如何读
### 5. writeOne 和 writeAll 全部取消,变成单一的write
写操作原来有写单个和写全部操作,考虑到写全部基本无用(几乎没有一次将设备所有值全写的情况)
写操作只保留写单个
  -timeout:设备超时控制时长
### 6. navi 
导航函数 用于监听设备 引导上级找到自己
### 7. configure
高级设备,用于设定一个特别参数下发，例如空调控制指令
### 8. encode
主动上报参数的设定
### 9. decode
主动上报参数的解析

# lora双站模式协议

# 设备在离线机制
设备的通信以包做单位
轮询设备 下发一包 反馈一包
监听设备 自助上报包
下发包如没收到反馈,视为丢包

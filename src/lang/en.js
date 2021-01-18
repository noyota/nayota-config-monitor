export default {
  route: {
    dashboard: 'Dashboard',
    loraSet: 'Lora Permission',
    LoraMaster: 'LORA Master',
    LoraSlave: 'LORA Equipment',
    PushRecord: '推送记录',
    rolePermission: 'Role Permission',
    complexTable: 'Complex Table',
    treeTable: 'Tree Table',
    customTreeTable: 'Custom TreeTable',
    autoform: '自生成表单',
    tab: 'Tab',
    form: 'Form',
    createArticle: 'Create Article',
    editArticle: 'Edit Article',
    articleList: 'Article List',
    errorPages: 'Error Pages',
    page401: '401',
    page404: '404',
    errorLog: 'Error Log',
    excel: 'Excel',
    exportExcel: 'Export Excel',
    selectExcel: 'Export Selected',
    mergeHeader: 'Merge Header',
    uploadExcel: 'upload Excel',
    zip: 'Zip',
    pdf: 'PDF',
    exportZip: 'Export Zip',
    theme: 'Theme',
    clipboardDemo: 'Clipboard',
    i18n: 'I18n',
    user: '用户',
    role: '角色',
    Example: '示例',
    settings: '系统设置',
    router: '菜单路由',
    uploadFile: '文件列表',
    updategit: '系统更新',
    upload: '上传',
    controlnewPi: '待激活网关',
    configLora: 'lora配置',
    cameraRecord: '视频录制记录',
    recall: '追溯记录',
    displayAreaClass: '区域类别',
    UiManagement: 'UI模板',
    Word: '字典数据',
    WordType: '字典类别',
    User: '用户信息',
    Roles: '角色信息',
    Oauths: '接口认证',
    OauthRecords: '接口调用记录',
    modelsets: '模型管理',
    Agreement: '设备驱动',
    Hardwareword: '设备配置',
    ThingModel: '物模型',
    Thing: '物配置',
    ThingDrive: '物模型驱动表',
    Aimodel: 'AI模型',
    component: '配置管理',
    DisplayArea: '区域信息',
    Scene: '场景信息',
    Smart: '智能信息',

    Equ: '设备管理',
    Hardware: '设备信息',
    Check: '采集实时数据',
    Operate: '控制实时数据',

    bug: '调试',
    mqttBug: 'mqtt调试',
    serialport: '串口调试',

    chart: '数据记录',
    CheckRecord: '检测数据记录',
    OperateRecord: '控制数据记录',
    SceneRecord: '场景触发记录',
    SmartRecord: '智能触发记录',
    Board: '区域看板',
    HistoryChart: '区域看板（设备历史记录）',

    international: '工作中心',
    SimpleIndex: '添加设备',
    Boardindex: '区域看板',
    HardwareQk: '设备看板',

    star: '边缘网关',
    Control: '网关信息',
    Controlword: '网关类型',

    eyeOpen: '视频管理',
    EzvizAccount: '萤石账号',
    Camera: '摄像头信息',
    PictureRecord: '截屏记录',
    orderData: '套餐订单',
    package: '套餐管理'

  },
  Agreement: {
    creator: '创建人'
  },
  rules: {
    username: '手机号不能为空',
    username_isPhone: '请输入正确的手机号码',
    password: '密码不能为空',
    reset_password: '两次输入的密码不一致，请重新输入',
    required: '必填',
    name: '请输入名称',
    type: '请选择协议',
    agreement: '请选择协议',
    control: '请选择网关',
    hardtype: '请输入类型',
    code: '请输入型号',
    comName: '请选择串口',
    loraMaster: '请选择所属主站',
    baud: '请选择波特率',
    verification: '请选择校验',
    stopBit: '请选择停止位',
    dataBit: '请选择数据位',
    weeks: '请选择星期',
    date: '请选择日期',
    account: '请选择账户',
    sort: '排序必须是数字',
    filepath: '请输入文件名',
    downTime: '请选择日期',
    creator: '请选择所属用户',
    control_Model: '请选择网关类型',
    filter_text: '输入关键字进行过滤',
    select: '请选择',
    status: '请输入状态',
    types: '请选择类型',
    label: '请选择标签',
    sdk: '请输入SDK密钥',
    control_title: '请选择对应网关',
    email: '邮箱不能为空',
    email_isEmail: '请输入正确的邮箱'
  },
  navbar: {
    logOut: 'Log Out',
    dashboard: 'Dashboard',
    github: 'Github',
    theme: 'Theme',
    size: 'Global Size',
    watch_more: '查看更多'
  },
  login: {
    title: 'NAYOTA SYSTEM',
    logIn: 'Log in',
    username: 'Username',
    password: 'Password',
    any: 'any',
    thirdparty: 'Or connect with',
    thirdpartyTips: 'Can not be simulated on local, so please combine you own business simulation! ! !',
    activation: '在线激活'
  },
  documentation: {
    documentation: 'Documentation',
    github: 'Github Repository'
  },
  permission: {
    addRole: 'New Role',
    editPermission: 'Edit Permission',
    roles: 'Your roles',
    switchRoles: 'Switch roles',
    tips: 'In some cases it is not suitable to use v-permission, such as element Tab component or el-table-column and other asynchronous rendering dom cases which can only be achieved by manually setting the v-if.',
    delete: 'Delete',
    confirm: 'Confirm',
    cancel: 'Cancel'
  },
  guide: {
    description: 'The guide page is useful for some people who entered the project for the first time. You can briefly introduce the features of the project. Demo is based on ',
    button: 'Show Guide',
    welcomeText1: 'NAYOTA愿景:',
    welcomeText2: 'Nayota让非编程人员，像安装电灯泡一样方便的安装物联网设备，像搭积木一样的构建个性化需求。',
    startButton: '添加新设备'
  },
  components: {
    documentation: '文档'
  },
  table: {
    dynamicTips1: 'Fixed header, sorted by header order',
    dynamicTips2: 'Not fixed header, sorted by click order',
    dragTips1: 'The default order',
    dragTips2: 'The after dragging order',
    title: 'Title',
    importance: 'Imp',
    type: 'Type',
    remark: 'Remark',
    search_label: '类型',
    search_message: '搜索内容',
    search: 'Search',
    query_delete: '批量删除',
    add: 'Add',
    export: 'Export',
    reviewer: 'reviewer',
    id: 'ID',
    date: 'Date',
    author: 'Author',
    readings: 'Readings',
    status: 'Status',
    actions: 'Actions',
    edit: 'Edit',
    publish: 'Publish',
    draft: 'Draft',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    creator: '所属用户',
    downAgree: '下载',
    loading_text: '拼命加载中',
    state: '在线状态',
    name: '名称',
    sort: '排序',
    yun_type: '适用',
    show: '追溯',
    updatedAt: '修改时间',
    createdAt: '创建时间',
    create: '新增',
    all: '全部',
    term_type_value: '设备参数',
    perform_time: '执行间隔',
    perform_type: '执行值',
    perform_content: '执行内容',
    actions_title: '动作',
    ph_perform_content: '执行类型无法描述时,请填入内容',
    week_only: '单',
    week_title: '星期',
    date_title: '日期',
    ph_date_title: '选择日期',
    time_title: '时间',
    ph_time_title: '选择时间',
    remarks: '备注',
    created: '创建时间',
    inputName: '请输入名称',
    inputSort: '请输入排序',
    inputRemarks: '请输入备注',
    allName: '用户列表',
    states: '状态',
    line: '在线',
    addC: '新增',
    wordType: '字典类型',
    saveEd: '保存编辑'
  },
  vxe_table: {
    add: '和',
    or: '或'
  },
  control: {
    new_Pi_List: '新树莓派设备',
    name: '网关名称',
    number: '网关编号',
    line_type: '状态',
    line_time: '在线时间',
    ip_address: 'ip地址',
    mqtt_clientId: 'MQTT客户端ID',
    ph_mqtt_clientId: '请输入MQTT客户端ID',
    init_config: '初始化配置',
    lora_config: 'Lora配置',
    simple_config: '简易配置',
    control_Model: '网关类型',
    ph_control_Model: '请选择网关类型',
    ph_name: '请输入网关名称',
    ph_number: '将自动生成',
    phone: 'SIM卡号',
    ph_phone: '请输入SIM卡号',
    iccid: 'icCid',
    ph_iccid: '请输入icCid',
    version: '系统版本号',
    ph_version: '请输入系统版本号',
    simType: '运营商',
    ph_simType: '请选择运营商',
    login_time: '登录时间',
    lastSend: '设备离线时间戳',
    env: '当前模式',
    driveDownAt: '驱动最后更新时间'
  },
  abnormal: {
    address: '地址',
    errortime: '异常时间',
    errordata: '数据',
    deviceType: '设备',
    abnormalType: '异常状态'
  },
  agreement: {
    name: '协议名字',
    type: '协议类型',
    jsonEditor: '文件显示',
    edition: '协议版本',
    notes: '协议备注',
    hanShu: '单文件上传',
    doc: '协议文档上传',
    dimension: '请选择AI维度',
    ph_notes: '请输入协议备注',
    ph_name: '请输入协议名字',
    ph_type: '请选择协议类型',
    ph_edition: '请输入协议版本',
    type_device: '硬件',
    type_dimen: '维度',
    version: '版本'
  },
  aimodel: {
    name: 'AI模型名称',
    ph_name: '请输入AI模型名称',
    address: '地址',
    ph_address: '请输入地址',
    control: '网关',
    ph_control: '请选择网关',
    localUrl: '单图上传',
    AI_title: 'AI配置',
    create: '新增',
    hardwareAdd: '设备地址',
    startDate: '开始时间',
    endDate: '结束时间'
  },
  pushrecords: {
    title: '内容',
    pushTime: '时间',
    status: '状态',
    type: '类型',
    pushStatus: '推送状态',
    success: '成功',
    error: '失败',
    app: 'APP推送',
    wechat: '微信推送',
    sms: '短信推送',
    startTime: '开始时间',
    to: '至',
    endTime: '结束时间'
  },
  com: {
    title: '主机串口配置',
    name: '串口',
    baud: '波特率',
    verification: '校验',
    stopBit: '停止位',
    dataBit: '数据位'
  },
  errorLog: {
    tips: 'Please click the bug icon in the upper right corner',
    description: 'Now the management system are basically the form of the spa, it enhances the user experience, but it also increases the possibility of page problems, a small negligence may lead to the entire page deadlock. Fortunately Vue provides a way to catch handling exceptions, where you can handle errors or report exceptions.',
    documentation: 'Document introduction'
  },
  excel: {
    export: 'Export',
    selectedExport: 'Export Selected Items',
    placeholder: 'Please enter the file name(default excel-list)'
  },
  zip: {
    export: 'Export',
    placeholder: 'Please enter the file name(default file)'
  },
  pdf: {
    tips: 'Here we use window.print() to implement the feature of downloading pdf.'
  },
  theme: {
    change: 'Change Theme',
    documentation: 'Theme documentation',
    tips: 'Tips: It is different from the theme-pick on the navbar is two different skinning methods, each with different application scenarios. Refer to the documentation for details.'
  },
  tagsView: {
    refresh: 'Refresh',
    close: 'Close',
    closeOthers: 'Close Others',
    closeAll: 'Close All'
  },
  settings: {
    title: 'Page style setting',
    theme: 'Theme Color',
    tagsView: 'Open Tags-View',
    fixedHeader: 'Fixed Header',
    sidebarLogo: 'Sidebar Logo'
  },
  checks: {
    slaveTitle: 'LORA设备',
    hardTitle: '设备',
    checkTitle: '采集参数',
    valueTitle: '参数值',
    recordTime: '采集时间',
    startTime: '开始时间',
    to: '至',
    endTime: '结束时间',
    export_name: '采集记录数据列表'
  },
  operates: {
    slaveTitle: 'LORA设备',
    hardTitle: '设备',
    operateTitle: '控制按钮',
    valueTitle: '状态',
    recordTime: '操作时间',
    startTime: '开始时间',
    to: '至',
    endTime: '结束时间'
  },
  scenes: {
    name: '名称',
    ph_name: '请输入名称',
    title: '场景',
    emitAt: '触发时间',
    completeAt: '完成时间',
    state_title: '是否成功',
    is_recall: '是否回滚',
    log_title: '错误日志',
    startTime: '开始时间',
    to: '至',
    endTime: '结束时间',
    loopV: '循环状态',
    loop_time: '循环间隔',
    scene_dis: '场景类型',
    ph_scene_dis: '选择场景类型',
    scene_local_type: '本地场景',
    scene_cloud_type: '云场景',
    scene_isrun: '运行状态',
    scene_isrun_false: '当前未运行',
    scene_isrun_true: '正在执行',
    scene_start: '启动定时',
    scene_stop: '停止定时',
    start_cycle: '启动循环',
    immediate_exec: '立即执行',
    control_number: '网关编号',
    ph_control_number: '请选择网关信息',
    action_time_title: '执行时间(新增或调整时间后需重启定时)'
  },
  unit: {
    millisecond: '毫秒'
  },
  smarts: {
    title: '智能',
    emitAt: '触发时间',
    completeAt: '完成时间',
    state_title: '是否成功',
    is_recall: '是否回滚',
    log_title: '错误日志',
    startTime: '开始时间',
    to: '至',
    endTime: '结束时间',
    smart_type: '智能类型',
    ph_smart_type: '选择智能类型',
    control_number: '关联的设备编号',
    ph_control_number: '请选择网关设备',
    name: '名称',
    namePlaceholder: '请输入名称',
    smart_Dis: '智能类型',
    ph_smart_Dis: '选择智能类型',
    status: '启用状态',
    keep_Run: '执行类型',
    ph_keep_Run: '请选择执行类型',
    term_title: '条件(或条件只要其中之一满足,和条件需要都满足)',
    actions_title: '动作',
    ph_value: '请输入数字',
    min: '最小',
    max: '最大',
    time_range: '选择时间范围',
    valueTitle: '参数值',
    term_type: '条件类型',
    term_action: '条件',
    term_assist: '辅助选择',
    keep_run_0: '只触发一次直到条件不符',
    keep_run_1: '一直触发直到条件不符',
    term_length_title: '条件数',
    action_length_title: '动作数'
  },
  // 确认
  messages: {
    title: 'Prompt',
    delete: 'This action will permanently delete the data, whether to continue?',
    deleteAll: '此操作将永久删除该数据以及其子数据, 是否继续?',
    confirm: 'Ok',
    cancel: 'Cancel',
    success_title: 'Success',
    modify_success: '操作成功',
    create_success: '创建成功',
    update_success: '更新成功',
    del_success: 'Successfully deleted',
    del_check_success: 'Batch delete succeeded',
    error: 'Error',
    del_error: 'Failed to delete',
    del_check_error: 'Bulk delete failed',
    del_message: 'Please select the data you want to delete',
    yes: 'Yes',
    no: 'No',
    onLine: 'Online',
    offLine: 'Offline',
    validate_error: '保存失败,验证未通过',
    click_success: '执行成功',
    time_job_success: '定时启停切换成功',
    register_login_err: '当前账号用户名或密码错误',
    register_err: '当前账号已被注册,请重新输入账号',
    sdk_10009: '无效的sdk密钥',
    sdk_10010: '该sdk密钥已被使用,无法重复使用',
    register_success: '注册成功',
    control_10007: '当前选择网关不存在',
    buy_success: '购买成功'
  },
  dialog: {
    upated: 'Update',
    create: 'Create',
    delete: 'Delete'
  },
  displayAreaClass: {
    name: 'Name',
    namePlaceholder: 'Please enter a name',
    sort: 'Sort',
    sortPlaceholder: 'Please enter a sort',
    remark: 'Description',
    remarkPlaceholder: 'Please enter a description',
    isHomepage: 'Is the homepage',
    displayArea: 'Inclusion area',
    displayAreaPlaceholder: 'Please select a label'
  },
  users: {
    username: '账户',
    trueName: '真实姓名',
    email: '邮箱',
    password: '密码',
    repeatPassword: '确认密码',
    roles: '角色',
    mqtt_role: 'MQTT角色',
    mqtt_user: 'MQTT用户名',
    mqtt_password: 'MQTT密码',
    ph_username: '请输入账户',
    ph_trueName: '请输入真实姓名',
    ph_user_err: '请输入账号',
    ph_true_err: '请输入真实姓名',
    ph_email_true: '请输入正确邮箱',
    ph_role: '请选择角色',
    ph_pwd: '请输入密码',
    ph_repwd: '请再次输入密码',
    ph_errpwd: '两次输入密码不一致',
    ph_mqtt_role: '请选择Mqtt角色',
    ph_mqtt_user: '输入用于MQTT连接的用户名',
    ph_mqttuser_null: '输入用于MQTT连接的用户名',
    ph_mqtt_pwd: '新的MQTT账户请设定一个密码!',
    ph_email_err: '此邮箱已被注册!',
    ph_mqttuser_err: '此用户名已被其他账户使用!',
    user_tree_title: '用户列表'
  },
  editJS: {
    edit_title: '编辑JavaScript解析函数',
    edit: '编辑'
  },
  lora: {
    create_master: '新增主站',
    address: '地址',
    shortAddress: '短地址',
    child: '配置子',
    line: '在离线'
  },
  wordType: {
    addFirst: '添加首级',
    allName: '字典类型',
    message: '字典类型最多添加3级！',
    addT: '添加同级',
    addC: '添加子级',
    state: '状态'
  },
  word: {
    treeName: '所有',
    wordType: '字典类型',
    state: '状态',
    key: '键',
    value: '值',
    inputKey: '请输入key',
    inputValue: '请输入value'
  },
  uiManagement: {
    edition: '版本',
    allName: '用户列表',
    template: '模板文件上传',
    templateComponentName: '模板名称',
    inputEdition: '请输入版本号',
    inputTemplateComponentName: '请输入模板名称'
  },
  router: {
    name: '文件名',
    message1: '添加顶级路由',
    message2: '后端路由生成',
    path: '路径',
    roles: '拥有权限的角色',
    level: '等级',
    method: '方法',
    children: '子级',
    qUi: '前端路由',
    hUi: '后端路由'

  },
  uploadFile: {
    fileName: '文件名',
    size: '大小',
    type: '文件类型',
    path: '文件路径',
    lastUseAt: '最后使用时间',
    fatherName: '父级菜单',
    sName: '名称（s）',
    filepath: '后端路由',
    inputFatherName: '请选择页面菜单',
    inputSName: '输入带s结尾的路由名称',
    inputFilepath: '输入*.route.js完整文件名'
  },
  updateGit: {
    name: '仓库名称',
    ref: '版本号',
    pushed_at: '提交时间',
    used: '使用情况',
    lastUseAt: '最后使用时间',
    change: '切换到此版本',
    title1: '注意，使用版本更新功能需要保证部署使用git部署，并且已经可以无需输入用户名密码git pull项目',
    title2: '切换到项目下终端输入：git config --global credential.helper store',
    title3: '然后git pull 输入一遍账户密码，之后就不需要再输入了',
    title4: 'ps:单仓库账户设置使用git config --local credential.helper store',
    title5: '当前系统版本:',
    confirm: '确认切换系统版本？成功切换后将会重启系统,跨越大版本的切换可能会造成无法预计的错误。',
    message: '当前系统实际版本和记录版本可能不同，实际'
  },
  role: {
    name: '角色名',
    inputName: '请输入角色名',
    sortMessage: '排序必须是数字'
  },
  mqttTest: {
    clientId: '客户端ID',
    url: '服务器地址',
    username: '账号',
    password: '密码',
    keepalive: '心跳包:默认60秒',
    active: '连接',
    inactive: '未连接',
    sub: '订阅主题',
    reconnect: '自动重连',
    zip: '导出zip',
    receive: '接受消息',
    sendNew: '发出消息',
    theme: '主题',
    content: '内容',
    send: '发送'
  },
  cameraRecord: {
    recordTime: '录制时间',
    duration: '视频时长',
    image: '截图地址',
    path: '视频地址'
  },
  recall: {
    recordTime: '记录时间',
    code: '编号',
    type: '记录类型',
    name: '执行名称'
  },
  ezvizAccount: {
    creator: '所属用户',
    strName: '名称备注',
    account: '账号',
    password: '密码',
    inputStrName: '请输入名称备注',
    inputAccount: '请输入账号',
    inputPassword: '请输入密码',
    status: '状态',
    inputAppKey: '请输入appKey',
    inputSecret: '请输入secret',
    inputAccessToken: '请输入access_token',
    expireTime: '获取时间',
    refreshToken: ' 刷新token',
    getCamera: '获取摄像头',
    status_true: '使用',
    status_false: '停用'
  },
  camera: {
    picture: '截图',
    creators: '所属用户',
    alias: '别名',
    account: '萤石账号',
    dis: '所属区域',
    number: '序号',
    line: '在线',
    creator: '创建人',
    onLine: '在线视频',
    delPicture: '截屏清理',
    getPicture: '手动截屏',
    history: '历史',
    null: '无',
    all: '全部',
    inputName: '请输入名称',
    inputAccount: '请选择账号',
    singleImage: '单图上传',
    inputNumber: '请输入序号',
    inputAlias: '请输入别名',
    localCamera: '本地摄像头信息',

    control: '所属网关',
    inputControl: '本地摄像头必选网关',
    localIp: '本地rtsp地址',
    inputLocalIp: '请输入rtsp://xxx.xxx.xxx.xxx',
    localUsername: '本地账户名',
    inputLocalUsername: '输入本地账户',
    localPassword: '本地密码',
    inputLocalPassword: '输入本地密码'
  },
  pictureRecord: {
    cameraId: '摄像头',
    ezViz: '萤石账号',
    picturePath: '截图',
    inputLocalIp: '请输入rtsp://xxx.xxx.xxx.xxx',
    localUsername: '本地账户名',
    inputLocalUsername: '输入本地账户',
    localPassword: '本地密码',
    inputLocalPassword: '输入本地密码'
  },
  HardWareWord: {
    type: '类型',
    code: '型号',
    agreement: '调用协议',
    equ: '设备',
    LX: '轮询',
    JT: '监听',
    QT: '其他',
    uiTemplate: 'ui模板',
    SingleFile: '安装文档',
    image: '图例',
    comInfo: '串口信息',
    parameter: '参数',
    monitor: '监测',
    note: '说明',
    options: '操作',
    company: '单位',
    icon: '图标',
    analysis: '解析函数',
    edit: '编辑',
    interval: '区间',
    address: '地址',
    precision: '精度',
    sort: '排序',
    numericalValue: '数值类型',
    exAnalysis: '异常函数',
    canRead: '可读',
    control: '控制'
  },
  thingModel: {
    hardWares: '设备字典组',
    loras: 'lora字典组',
    parameter: '参数',
    action: '动作',
    drives: '驱动组',
    key: '参数名',
    val: '值',
    type: '类型',
    choose: '选择'

  },
  thing: {
    thingModel: '使用物模型',
    lastDate: '最新数据',
    driveDate: '驱动参数',
    hardwares: '设备字典组',
    loras: 'lora字典组',
    aiModels: 'AImodel模型',
    inputDriveDate: '请输入驱动参数',
    allName: '网关列表',
    control: '所属网关',
    parameter: '参数',
    action: '动作',
    drives: '驱动组',
    key: '参数名',
    val: '值',
    type: '类型',
    choose: '选择'
  },
  displayArea: {
    name: '区域名称',
    areaImg: '单图上传',
    checks: '检测数据',
    operates: '控制按钮',
    camera: '摄像头',
    scenes: '场景',
    inputDriveDate: '请输入驱动参数',
    allName: '网关列表',
    inputCheck: '请选择检测数据',
    inputName: '请输入区域名称',
    inputOperates: '请选择控制按钮',
    inputCamera: '请选择摄像头',
    inputScenes: '请选择场景',
    showStatus: '云配置',
    status: '显示状态',
    off: '停用',
    on: '启用',
    all: '全部'
  },
  hardware: {
    // shortAddress: '设备地址',
    // control: '所属网关',
    loraSlave: '所属从站',
    YX: '有线',
    message: '设备配置需硬件配合(lora)',
    off: '断开',
    on: '连接',
    message1: '次主站断开',
    message2: '次主站连接(强制)',
    message3: '搜索设备',
    message4: '配置设备',
    message5: '配置设备为lora485主动上报',
    message6: '读设备',
    message7: '写设备',
    message8: '当前模式（部分设备没有模式切换）',
    message9: '设备参数',
    message10: '串口信息',
    message11: '检测器',
    message12: '控制器',
    message13: '控制',
    okStatus: '正常模式',
    pzStatus: '配置模式',
    startAddr: '起始地址',
    inputStartAddr: '有些设备是按地址搜索',
    endAddr: '结束地址',
    inputEndAddr: '输入地址可缩小搜索范围',
    oldAddr: '原地址',
    inputOldAddr: '快捷改地址',

    //  :label="$t('hardware.oldAddr')"
    //  :placeholder="$t('hardware.select')"
    hardwareWord: '设备类型',
    address: '设备地址',
    inputAddress: '此地址自动生成,请勿更改',
    shortAddress: '短地址',
    inputShortAddress: '此地址自动生成,请勿更改',
    control: '所属网关',
    thingModel: '默认物模型',
    isShow: '展示状态',

    key: '键',
    value: '值',
    note: '配置设备',

    edit: '编辑',

    interval: '区间',

    icon: '图标',
    value1: '元数据',
    valueStr: '区间值',
    precision: '精度',
    canRead: '可读',
    line: '在线',

    saveEd: '保存编辑',

    remind1: '开启成功',
    remind2: '串口被占用,是否强制接管连接?',
    remind3: '关闭串口连接成功',
    remind4: '配置设备成功,根据配置保存数据',
    remind5: '写入配置失败:',
    remind6: '--建议点击配置设备按钮再次尝试',
    remind7: '配置lora监听设备成功,根据配置保存数据',
    remind8: '读到数据:',
    remind9: '读取数据失败',
    remind10: '请先选择一个设备类型',
    remind11: '使用有线方式连接设备必须输入串口名称',
    remind12: '请选择所属从站'

  },
  check: {
    hardware: '所属设备',
    loraSlave: '所属lora',
    line: '在线',
    address: '地址',
    company: '单位',
    icon: '图标',
    value: '最后值',
    valueAt: '最后值时间',
    inputAddress: '请输入地址',
    inputCompany: '请输入单位',
    message4: '切换为控制数据'
  },
  meal: {
    title: '套餐',
    name: '套餐选择'
  },
  operate: {
    hardware: '所属设备',
    loraSlave: '所属lora',
    address: '地址',
    line: '在线',
    icon: '图标',
    value: '最后状态',
    valueAt: '最后控制时间',
    templateComponentName: 'ui模板',
    message: ' 切换为检测数据'
  },
  loraMaster: {
    offConnected: '关闭连接',
    onConnected: '开启连接',
    exitModel: '退出配置',
    message1: '配置主站',
    message2: '发送进入命令',
    message3: '串口被占用,是否强制接管连接?',
    message4: '开启成功',
    message5: '关闭串口连接成功',
    message6: '主站模式',
    message7: '写入成功',
    comName: '串口',
    inputComName: '请选择地址',
    joinModel: '进入配置',
    loraMaster: '附属主站',
    message: '监听主站需要选一个主站作为附属',
    code: '型号',
    line: '在线',
    offLine: '离线',
    onLine: '在线',
    off: '断开',
    on: '连接',
    address: '地址',
    inputAddress: '除特殊情况请保持此项为空',
    control: '所属网关',
    dispose: 'Lora配置',
    comInfo: '串口信息',
    frequency: '频段',
    bandwidth: '带宽',
    codingrate: '编码率',
    factor: '扩频因子',
    LX: '轮询主站',
    JT: '监听主站',
    WG: '网关主站',
    SM: '双模主站',
    type: '类型',
    allName: '网关列表'
  },
  loraSlave: {
    type: '类型',
    status: '状态',
    line: '在线',
    onLine: '在线',
    offLine: '离线',
    message: '在离线',
    eType: '设备类型',
    message1: '从站的新增和部分修改需硬件配合',
    message2: '写入配置',
    message3: '退出配置模式',
    message4: '广播搜从站',
    message5: '当前模式（不一定准确）',
    message6: '配置参数',
    message7: '添加Lora配置',
    message8: '检测器',
    interval: '区间',
    message10: '控制器',
    edit: '编辑',
    off: '断开',
    on: '连接',
    cOff: '次主站断开',
    cOn: '次主站连接',
    ZC: '正常模式',
    PZ: '配置模式',
    key: '字段名',
    value: '参数值',
    note: '说明',
    address: '从站地址',
    Address: '地址',
    SAddress: '短地址',
    shortAddress: '地址',
    loraMaster: '所属主站',
    secondMaster: '次主站',
    thingModel: '物模型',
    agreement: '协议类型',
    hardwareWord: '设备类型',
    scanCode: '二维码',
    inputAddress: '从站地址将自动生成',
    inputShortAddress: '请输入从站短地址',
    inputLoraMaster: '请选择LORA主站',
    inputSecondMaster: '请选择LORA主站',
    inputThingModel: '请选择物模型',
    inputScanCode: '请输入二维码',

    frequency: '频段',
    bandwidth: '带宽',
    codingrate: '编码率',
    factor: '扩频因子',
    saveEd: '保存编辑',

    value1: '元数据',
    valueStr: '区间值',
    precision: '精度',
    canRead: '可读',
    line1: '在线'
  },
  controlWord: {
    systemType: '系统型号',
    inputSystemType: '请输入系统型号',
    state: '在线状态',
    options: '操作',
    creator: '创建人',
    message: '主机串口配置'

  },
  oauths: {
    dataSource: '数据源',
    user: '关联用户',
    inputUser: '请选择此设备所属用户',
    status: '状态',
    options: '操作',
    message: '主机串口配置',
    loading: '加载中',
    ZC: '正常权限',
    YJ: '永久权限',
    DJ: '冻结'

  },
  oauthRecords: {
    dataSource: '数据源',
    user: '关联用户',
    inputUser: '请选择此设备所属用户',
    status: '状态',
    options: '操作',
    message: '主机串口配置',
    loading: '加载中',
    ZC: '正常权限',
    YJ: '永久权限',
    DJ: '冻结'
  },
  upload: {
    fatherName: '父级菜单',
    sName: '名称（s）',
    filepath: '后端路由',
    inputFatherName: '请选择父级菜单',
    inputSName: '请输入名称（s）',
    inputFilepath: '请输入后端路由'
  },
  register: {
    title: '欢迎激活NAYOTA边缘网关',
    step1: '步骤1-账号登录',
    step2: '步骤2-激活网关',
    step3: '步骤3-激活成功',
    ph_username: '请输入手机号',
    ph_username_title: '填写手机号码',
    ph_reg_password: '请输入你的登录密码',
    ph_reg_username: '设置手机号',
    ph_password: '请输入你的登录密码',
    ph_email: '设置邮箱',
    ph_resetpassword: '请再次输入你的密码',
    ph_personname: '请输入姓名',
    ph_businessname: '请输入企业名称',
    ph_control: '请选择对应网关',
    ph_control_type: '请选择设定网关类型',
    ph_sdkkey: '请输入sdk-key',
    person: '个人',
    business: '企业',
    step_next: '下一步',
    step_prev: '上一步',
    reg_title: '注册',
    control_new: '新的网关',
    control_old: '备用网关',
    control: '网关名称',
    packageName: '套餐名称',
    deviceNumber: '节点数',
    effectiveTime: '有效时长',
    click_me: '点击我，进入物联网平台！',
    success: '激活成功，你的网关信息如下：',
    register_title: '欢迎注册NAYOTA云',
    have_account: '已有Nayota云用户账号?',
    go_register: '激活网关',
    ph_email_title: '填写邮箱',
    ph_reset_title: '请再次输入你的密码',
    ph_business_title: '请输入企业名称',
    ph_person_title: '请输入用户名称',
    website: '《Nayota网站服务条款》',
    law: '《法律声明及隐私权政策》',
    check: '确认'
  },
  package: {
    buy: '购买套餐',
    year: '套餐时长',
    number: '套餐节点数',
    hardwareWord: '套餐设备',
    name: '套餐名称',
    ph_name: '输入套餐名称',
    ph_year: '请选择套餐时长',
    ph_number: '请输入套餐节点数',
    ph_hardwareWord: '请选择套餐设备',
    status: '套餐状态'
  },
  orderData: {
    sdk: 'SDK地址',
    status: '状态',
    status_0: '可用',
    status_1: '已使用',
    package: '套餐名称',
    ph_name: '输入套餐名称',
    ph_year: '请选择套餐时长',
    ph_number: '请输入套餐节点数',
    ph_hardwareWord: '请选择套餐设备'
  }
}

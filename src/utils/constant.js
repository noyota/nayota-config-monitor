/**
 * @author lifeng
 * @date 19-7-10
 * @Description: 各种常量
*/
export const DEFAUT_PORT = {
  comName: null,
  baud: 9600,
  verification: 'none',
  stopBit: 1,
  dataBit: 8,
  state: false,
  address: null
}

export const DEFAUT_LORA = {
  factor: '07',
  bandwidth: '07',
  codingrate: '01',
  frequency: '1c03a180'
}
/**
 * 波特率列表
 * @type {*[]}
 */
export const BAUD_RATES = [
  {
    value: 1200,
    label: '1200'
  },
  {
    value: 2400,
    label: '2400'
  },
  {
    value: 4800,
    label: '4800'
  },
  {
    value: 9600,
    label: '9600'
  },
  {
    value: 19200,
    label: '19200'
  },
  {
    value: 38400,
    label: '38400'
  },
  {
    value: 115200,
    label: '115200'
  }
]

/**
 * 校验列表
 * @type {*[]}
 */
export const CHECKS = [
  {
    value: 'even',
    label: '偶校验'
  },
  {
    value: 'odd',
    label: '奇校验'
  },
  {
    value: 'none',
    label: '无'
  }
]

/**
 * 停止位
 * @type {{value: number, label: string}[]}
 */
export const STOP_BITS = [
  {
    value: 1,
    label: '1'
  },
  {
    value: 2,
    label: '2'
  }
]

/**
 * 数据位
 * @type {{value: number, label: string}[]}
 */
export const DATA_BITS = [
  {
    value: 8,
    label: '8'
  }
]

/**
 * 编码率
 * @type {*[]}
 */
export const CODERATE = [
  {
    value: '01',
    label: '4/5'
  },
  {
    value: '02',
    label: '4/6'
  },
  {
    value: '03',
    label: '4/7'
  },
  {
    value: '04',
    label: '4/8'
  }
]

/**
 * 带宽
 * @type {*[]}
 */
export const BANDWIDTHS = [
  {
    value: '06',
    label: '62.5kHz'
  },
  {
    value: '07',
    label: '125kHz'
  },
  {
    value: '08',
    label: '250kHz'
  },
  {
    value: '09',
    label: '500kHz'
  }
]

/**
 * 扩频因子
 * @type {*[]}
 */
export const SFS = [
  {
    value: '06',
    label: '6'
  },
  {
    value: '07',
    label: '7'
  },
  {
    value: '08',
    label: '8'
  },
  {
    value: '09',
    label: '9'
  },
  {
    value: '0a',
    label: '10'
  },
  {
    value: '0b',
    label: '11'
  },
  {
    value: '0c',
    label: '12'
  }
]

/**
 * 频段
 * @type {{value: string, label: string}[]}
 */
export const FREQUENCY = [
  {
    value: '1a0c1740',
    label: '437频段'
  },
  {
    value: '1c03a180',
    label: '470频段'
  }, {
    value: '1c12e3c0',
    label: '471频段'
  }, {
    value: '1c20ed80',
    label: '471.920频段'
  }, {
    value: '1c210108',
    label: '471.925频段'
  }, {
    value: '1c222600',
    label: '472频段'
  }, {
    value: '1c316840',
    label: '473频段'
  }, {
    value: '1c40aa80',
    label: '474频段'
  }, {
    value: '1c4fecc0',
    label: '475频段'
  }, {
    value: '1c5f2f00',
    label: '476频段'
  }, {
    value: '1c6e7140',
    label: '477频段'
  }, {
    value: '1c7db380',
    label: '478频段'
  }, {
    value: '1c8cf5c0',
    label: '479频段'
  }, {
    value: '1c9c3800',
    label: '480频段'
  }, {
    value: '1cab7a40',
    label: '481频段'
  }, {
    value: '1cbabc80',
    label: '482频段'
  }, {
    value: '1cc9fec0',
    label: '483频段'
  }, {
    value: '1cd94100',
    label: '484频段'
  }, {
    value: '1ce88340',
    label: '485频段'
  }, {
    value: '1cf7c580',
    label: '486频段'
  }, {
    value: '1d0707c0',
    label: '487频段'
  }, {
    value: '1d164a00',
    label: '488频段'
  }, {
    value: '1d258c40',
    label: '489频段'
  }, {
    value: '1d34ce80',
    label: '490频段'
  }, {
    value: '1d4410c0',
    label: '491频段'
  }, {
    value: '1d535300',
    label: '492频段'
  }, {
    value: '1d629540',
    label: '493频段'
  }, {
    value: '1d71d780',
    label: '494频段'
  }, {
    value: '1d8119c0',
    label: '495频段'
  }, {
    value: '1d905c00',
    label: '496频段'
  }, {
    value: '1d9f9e40',
    label: '497频段'
  }, {
    value: '1daee080',
    label: '498频段'
  }, {
    value: '1dbe22c0',
    label: '499频段'
  }, {
    value: '1dcd6500',
    label: '500频段'
  }, {
    value: '1ddca740',
    label: '501频段'
  }, {
    value: '1debe980',
    label: '502频段'
  }, {
    value: '1dfb2bc0',
    label: '503频段'
  }, {
    value: '1e0a6e00',
    label: '504频段'
  }, {
    value: '1e19b040',
    label: '505频段'
  }, {
    value: '1e28f280',
    label: '506频段'
  }, {
    value: '1e3834c0',
    label: '507频段'
  }, {
    value: '1e477700',
    label: '508频段'
  }, {
    value: '1e56b940',
    label: '509频段'
  }, {
    value: '1e65fb80',
    label: '510频段'
  }, {
    value: '1C25A870',
    label: '472.23频段'
  }, {
    value: '1C482490',
    label: '474.49频段'
  }, {
    value: '1c6aa0b0',
    label: '476.75频段'
  }, {
    value: '1D102F80',
    label: '487.60频段'
  }, {
    value: '1D10F2D0',
    label: '487.65频段'
  }, {
    value: '1D11B620',
    label: '487.70频段'
  }, {
    value: '1D127970',
    label: '487.75频段'
  }, {
    value: '1D133CC0',
    label: '487.80频段'
  }, {
    value: '1D140010',
    label: '487.85频段'
  }, {
    value: '1D14C360',
    label: '487.90频段'
  }, {
    value: '1D1586B0',
    label: '487.95频段'
  }, {
    value: '1D170D50',
    label: '488.05频段'
  }, {
    value: '1D17D0A0',
    label: '488.10频段'
  }, {
    value: '1D1893F0',
    label: '488.15频段'
  }, {
    value: '1D195740',
    label: '488.20频段'
  }, {
    value: '1D1A1A90',
    label: '488.25频段'
  }, {
    value: '1D1ADDE0',
    label: '488.30频段'
  }, {
    value: '1D1BA130',
    label: '488.35频段'
  }, {
    value: '1D1C6480',
    label: '488.40频段'
  }, {
    value: '1D1D27D0',
    label: '488.45频段'
  }, {
    value: '1D1DEB20',
    label: '488.50频段'
  }, {
    value: '1D1EAE70',
    label: '488.55频段'
  }, {
    value: '1D1F71C0',
    label: '488.60频段'
  }, {
    value: '1D203510',
    label: '488.65频段'
  }, {
    value: '1D20F860',
    label: '488.70频段'
  }, {
    value: '1D21BBB0',
    label: '488.75频段'
  }, {
    value: '1D227F00',
    label: '488.80频段'
  }, {
    value: '1D234250',
    label: '488.85频段'
  }, {
    value: '1D2405A0',
    label: '488.90频段'
  }, {
    value: '1D24C8F0',
    label: '488.95频段'
  }]

/**
 * 时间选择
 * @type {*[]}
 */
export const TIMEOUT_SELECT = [
  {
    value: 0,
    label: '立即'
  },
  {
    value: 1000,
    label: '1秒'
  },
  {
    value: 2000,
    label: '2秒'
  },
  {
    value: 3000,
    label: '3秒'
  }, {
    value: 4000,
    label: '4秒'
  }, {
    value: 5000,
    label: '5秒'
  }, {
    value: 10000,
    label: '10秒'
  }, {
    value: 60000,
    label: '1分钟'
  }, {
    value: 300000,
    label: '5分钟'
  }, {
    value: 600000,
    label: '10分钟'
  }, {
    value: 1800000,
    label: '30分钟'
  }, {
    value: 3600000,
    label: '1小时'
  }]
/**
 * 条件类型
 * @type {*[]}
 */
export const TERM_TYPE = [{
  value: 'c',
  label: '检测数据',
  children: []
}, {
  value: 'o',
  label: '控制设备',
  children: []
}, {
  value: 'w',
  label: '物',
  children: []
}, {
  value: 't',
  label: '时间'
}]

/**
 * 动作类型
 * @type {*[]}
 */
export const ACTION_TYPE = [
  {
    value: 'o',
    label: '控制器',
    children: []
  }, {
    value: 's',
    label: '场景',
    children: []
  }, {
    value: 'j',
    label: '联动',
    children: []
  }, {
    value: 'p',
    label: '报警'
  }, {
    value: 'w',
    label: '物',
    children: []
  }, {
    value: 'r',
    label: '本地摄像头',
    children: []
  }
]

/**
 * 场景类型
 * @type {*[]}
 */
export const SCENE_TYPE = [
  {
    value: 0,
    label: '本地场景'
  },
  {
    value: 1,
    label: '云场景'
  }
]

/**
 * 智能类型
 * @type {*[]}
 */
export const SMART_TYPE = [
  {
    value: 0,
    label: '本地智能'
  },
  {
    value: 1,
    label: '云智能'
  }
]
/**
 * 场景分类
 * @type {*[]}
 */
export const SCENE_CLASS = [
  {
    value: 'jn',
    label: '节能'
  },
  {
    value: 'aq',
    label: '安全'
  },
  {
    value: 'ss',
    label: '舒适'
  },
  {
    value: 'rl',
    label: '人力节省'
  }
]

/**
 * 智能分类
 * @type {*[]}
 */
export const SMART_CLASS = [
  {
    value: 'jn',
    label: '节能'
  },
  {
    value: 'aq',
    label: '安全'
  },
  {
    value: 'ss',
    label: '舒适'
  },
  {
    value: 'rl',
    label: '人力节省'
  }
]

/**
 *  场景动作
 * @type {{}[]}
 */
export const ACTION_SCENE = [
  {
    value: 1,
    label: '执行'
  }
]

/**
 * 智能动作
 */
export const ACTION_SMART = [
  {
    value: 0,
    label: '停用'
  },
  {
    value: 1,
    label: '启用'
  }
]

/**
 * 报警动作
 * @type {*[]}
 */
export const ACTION_REPORT = [
  {
    value: 0,
    label: '窗口提示'
  },
  {
    value: 1,
    label: '微信'
  },
  {
    value: 2,
    label: '短信'
  },
  {
    value: 3,
    label: 'APP推送'
  },
  {
    value: 4,
    label: '邮件推送'
  }
]

/**
 * 摄像头录制动作
 * @type {{}[]}
 */
export const ACTION_CAMERA = [
  {
    value: 3,
    label: '录制3秒视频'
  },
  {
    value: 10,
    label: '录制10秒视频'
  },
  {
    value: 20,
    label: '录制20秒视频'
  },
  {
    value: 30,
    label: '录制30秒视频'
  }
]
/**
   * 时间类型
   * @type {{}[]}
   */
export const WEEK_CLASS = [
  { label: '单', value: 0 },
  { label: '周日', value: 7 },
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 },
  { label: '周六', value: 6 }
]

export const YEAR_CLASS = [
  { label: '半年', value: 0.5 },
  { label: '一年', value: 1 },
  { label: '两年', value: 2 }
]
/**
 * 智能动作
 */
export const STATUS_CLASS = [
  {
    value: 0,
    label: '可用'
  },
  {
    value: 1,
    label: '已使用'
  }
]
/**
 * 短信类型
 */
export const PHONE_SELECT = [
  {
    value: 0,
    label: '筑望'
  },
  {
    value: 1,
    label: '其他'
  }
]
/**
 * 短信类型
 */
export const SERIAL_PORTS = [
  {
    value: '/dev/uart1',
    label: '/dev/uart1'
  },
  // {
  //   value: '/dev/uart2',
  //   label: '/dev/uart2'
  // },
  {
    value: '/dev/ttyAMA0',
    label: '/dev/ttyAMA0'
  }
]

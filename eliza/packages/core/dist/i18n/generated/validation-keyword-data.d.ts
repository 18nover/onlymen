export declare const VALIDATION_KEYWORD_LOCALES: readonly ["es", "ko", "pt", "tl", "vi", "zh-CN"];
export type ValidationKeywordLocale = (typeof VALIDATION_KEYWORD_LOCALES)[number];
export declare const VALIDATION_KEYWORD_DOCS: {
    readonly action: {
        readonly agentInbox: {
            readonly request: {
                readonly base: "account\nagent\nagent email\nagent gmail\nagent inbox\nagent internal agent inbox\nagent mailbox\nagent messages\nagent_email\nagent_gmail\nagent_inbox\nagent_internal agent inbox\nagent_mailbox\nagent_messages\napply\nbelong\nbrief\nchannel\nconnectors agent inbox\ndaily\ndigest\ndraft\nemail\nemail agent inbox\ngmail\ninbox\nitself\nmailbox\nmessage\nmessaging agent inbox\nmy agent inbox\nmy_agent_inbox\nneed\nowner\nread\nreply\nrequest\nrespond\nscoped\nsearch\nsend\nsubaction\nsubject\ntriage";
                readonly locales: {
                    readonly es: "accion\nagente\nagente agente bandeja de entrada\nagente bandeja de entrada\nagente correo\nagente gmail\nagente mensaje\nbandeja\nbandeja de entrada\nborrador\nbuscar\nconector\nconector agente bandeja de entrada\ncorreo\ncorreo agente bandeja de entrada\ncuenta\ncuenta conectada\nemail\nenviar\nenviar correo\nestado interno\ngestion interna\nherramienta\nintegracion\ninterno del agente\nleer\nmcp\nmensaje\noauth\npedir\nredactar correo\nresponder\nsolicitud";
                    readonly ko: "검색\n계정\n계정 연결\n내부 상태\n답장\n도구\n메시지\n메일 보내기\n메일함\n받은편지함\n보내기\n에이전트\n에이전트 gmail\n에이전트 내부\n에이전트 메시지\n에이전트 받은편지함\n에이전트 에이전트 받은편지함\n에이전트 이메일\n오어스\n요청\n이메일\n이메일 에이전트 받은편지함\n읽기\n자체 관리\n작업\n초안\n커넥터\n커넥터 에이전트 받은편지함\n통합";
                    readonly pt: "acao\nagente\nagente agente caixa de entrada\nagente caixa de entrada\nagente email\nagente gmail\nagente mensagem\nbuscar\ncaixa de entrada\nconector\nconector agente caixa de entrada\nconta\nconta conectada\ncorreio\nemail\nemail agente caixa de entrada\nenviar\nenviar email\nestado interno\nferramenta\ngestao interna\nintegracao\ninterno do agente\nler\nmcp\nmensagem\noauth\npedir\nrascunho\nresponder\nsolicitacao";
                    readonly tl: "account\naccount connection\nagent\nagent agent inbox\nagent email\nagent gmail\nagent inbox\nagent mensahe\naksyon\nbasahin\nconnector\nconnector agent inbox\ndraft\nemail\nemail agent inbox\ngumawa ng email\nhiling\ninbox\nintegration\ninternal ng agent\ninternal state\nipadala\nkahilingan\nkasangkapan\nkoreo\nkuwenta\nmaghanap\nmagpadala ng email\nmensahe\noauth\nsagot\nsariling pamamahala\nsumagot";
                    readonly vi: "ban nhap\nbản nháp\ncong cu\ncông cụ\ndoc\nđọc\nemail\nemail tác tử hộp thư\ngui\ngửi\ngửi email\nhanh dong\nhành động\nhop thu\nhộp thư\nket noi\nkết nối\nkết nối tác tử hộp thư\nnoi bo tac tu\nnội bộ tác tử\noauth\ntac tu\ntác tử\ntác tử email\ntác tử gmail\ntác tử hộp thư\ntác tử tác tử hộp thư\ntác tử tin nhắn\ntai khoan\ntài khoản\nthu\nthư\ntich hop\ntích hợp\ntim kiem\ntìm kiếm\ntin nhan\ntin nhắn\ntra loi\ntrả lời\ntu quan ly\ntự quản lý\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "代理\n代理 gmail\n代理 代理 收件箱\n代理 收件箱\n代理 消息\n代理 邮件\n代理内部\n内部状态\n发送\n发送邮件\n回复\n工具\n授权\n搜索\n操作\n收件箱\n智能体\n消息\n自我管理\n草稿\n请求\n读取\n账号\n账号连接\n账户\n连接器\n连接器 代理 收件箱\n邮件\n邮件 代理 收件箱\n邮箱\n集成";
                };
            };
        };
        readonly analyzeImage: {
            readonly request: {
                readonly base: "analyze\nanalyze image\nanalyze_image\nanswer\nanswer question\ncontent\ncontent identify\ndescribe\ndescribe content\ndescribe image\ndescribe_image\nfiles analyze image\ngeneral analyze image\nidentify\nidentify image\nidentify object\nidentify_image\nimage\nimage to text\nimage vision\nimage_to_text\nmedia analyze image\nobject\nobject read\nocr\nquestion\nquestion image\nread\nread image\nread text\nread_image\ntext\ntext answer\nunderstand image\nunderstand_image\nvision\nvision describe\nwhat is in image\nwhat_is_in_image";
                readonly locales: {
                    readonly es: "accion\nanalizar\nanalizar imagen\narchivo\narchivo analizar imagen\narchivos\naudio\ncaptura\ncarpeta\nchat general\ncontenido\ncontenido identificar\nconversacion\ndescribir\ndescribir contenido\ndescribir imagen\ndirectorio\nfoto\ngeneral\ngeneral analizar imagen\nhablar\nherramienta\nidentificar\nidentificar imagen\nidentificar objeto\nimagen\nimagen vision\nleer\nleer archivo\nleer imagen\nmultimedia\nmultimedia analizar imagen\nobjeto\nobjeto leer\nresponder\nrespuesta\nsolicitud\ntranscripcion\nvideo\nvision\nvision describir";
                    readonly ko: "객체\n객체 읽기\n내용\n답변\n도구\n디렉터리\n말하기\n물체\n미디어\n미디어 분석 이미지\n분석\n분석 이미지\n비디오\n비전\n비전 설명\n사진\n설명\n설명 이미지\n설명 콘텐츠\n스크린샷\n식별\n식별 객체\n식별 이미지\n오디오\n요청\n이미지\n이미지 비전\n일반\n일반 대화\n일반 분석 이미지\n읽기\n읽기 이미지\n작업\n전사\n채팅\n콘텐츠\n콘텐츠 식별\n파일\n파일 분석 이미지\n파일 쓰기\n파일 읽기\n폴더";
                    readonly pt: "acao\nanalisar\nanalisar imagem\narquivo\narquivo analisar imagem\narquivos\naudio\ncaptura\nchat geral\nconteudo\nconteudo identificar\nconversa\ndescrever\ndescrever conteudo\ndescrever imagem\ndiretorio\nfalar\nferramenta\nfoto\ngeral\ngeral analisar imagem\nidentificar\nidentificar imagem\nidentificar objeto\nimagem\nimagem visao\nler\nler arquivo\nler imagem\nmidia\nmidia analisar imagem\nobjeto\nobjeto ler\npasta\nresponder\nresposta\nsolicitacao\ntranscricao\nvideo\nvisao\nvisao descrever";
                    readonly tl: "aksyon\naudio\nbagay\nbagay basahin\nbasahin\nbasahin file\nbasahin larawan\ndirectory\nfile\nfile suriin larawan\nfiles\nfolder\ngeneral chat\nilarawan\nilarawan larawan\nilarawan nilalaman\nkahilingan\nkasangkapan\nlarawan\nlarawan vision\nmakipag-usap\nmedia\nmedia suriin larawan\nnilalaman\nnilalaman tukuyin\npangkalahatan\npangkalahatan suriin larawan\nsagot\nscreenshot\nsuriin\nsuriin larawan\ntranscript\ntukuyin\ntukuyin bagay\ntukuyin larawan\nusap\nvideo\nvision\nvision ilarawan";
                    readonly vi: "âm thanh\nchung phân tích hình ảnh\ncong cu\ncông cụ\nda phuong tien\nđa phương tiện\nđa phương tiện phân tích hình ảnh\nđọc hình ảnh\ndoc tep\nđọc tệp\ndoi tuong\nđối tượng\nđối tượng đọc\nhanh dong\nhành động\nhinh anh\nhình ảnh\nhình ảnh thị giác\nmo ta\nmô tả\nmô tả hình ảnh\nmô tả nội dung\nnhan dang\nnhận dạng\nnhận dạng đối tượng\nnhận dạng hình ảnh\nnói chuyện\nnoi dung\nnội dung\nnội dung nhận dạng\nphan tich\nphân tích\nphân tích hình ảnh\ntep\ntệp\ntệp phân tích hình ảnh\nthi giac\nthị giác\nthị giác mô tả\nthu muc\nthư mục\ntra loi\ntrả lời\ntro chuyen\ntrò chuyện\nvideo\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "内容\n内容 识别\n写文件\n分析\n分析 图片\n回复\n回答\n图像\n图片\n图片 视觉\n媒体\n媒体 分析 图片\n对话\n对象\n对象 读取\n工具\n截图\n描述\n描述 内容\n描述 图片\n操作\n文件\n文件 分析 图片\n文件夹\n普通聊天\n物体\n目录\n视觉\n视觉 描述\n视频\n识别\n识别 图片\n识别 对象\n请求\n读取\n读取 图片\n读取文件\n转录\n通用\n通用 分析 图片\n音频";
                };
            };
        };
        readonly app: {
            readonly request: {
                readonly base: "absolute\nagent\nagent verifies\napp\napp control\napp runs\napp_control\napps\napps launch\nasks\nautomation app\ncancel\ncode app\ncoding\ncoding agent\ncontrol\ncreate\ncreate create\ncreate scaffolds\ndirectory\ndispatches\nedit\nexisting\nflow\nfolder\nfolder create\ninstalled\nlaunch\nlaunches\nlist\nlist load\nload\nmanage\nmanage apps\nmanage_apps\nmode\nmulti\noptionally\nregistered\nregisters\nrelaunch\nrelaunch list\nresult\nrunning\nruns\nruns coding\nscaffolds\nscaffolds app\nsearches\nsettings app\nshows\nstarts\nstops\ntemplate\nthat\nthen\nturn\nunified\nverifies\nverify";
                readonly locales: {
                    readonly es: "accion\nactivar\nadministrar\nagente\najustes\naplicacion\naplicacion controlar\naplicacion ejecutar\napp\nautomatizacion\nautomatizacion aplicacion\ncodigo\ncodigo aplicacion\nconfiguracion\nconfiguracion aplicacion\ncontrolar\ncrear\ncrear crear\ncron\ndepurar\ndetener\ndisparador\neditar\nejecutar\nflujo de trabajo\ngestionar\ngestionar aplicacion\nherramienta\nimplementar\nlistar\nmodelo\nmonitor\nmostrar\nparar\npreferencias\npreguntar\nprogramacion\nprueba\nrepositorio\nsolicitud";
                    readonly ko: "관리\n관리 앱\n구성\n구현\n도구\n디버그\n모니터\n모델 설정\n목록\n생성\n생성 생성\n설정\n설정 앱\n실행\n앱\n앱 실행\n앱 제어\n에이전트\n요청\n워크플로\n자동화\n자동화 앱\n작업\n저장소\n제어\n중지\n질문\n코드\n코드 앱\n크론\n테스트\n토글\n트리거\n편집\n프로그래밍\n환경설정";
                    readonly pt: "acao\nagente\nalternar\naplicativo\naplicativo controlar\naplicativo executar\napp\nautomacao\nautomacao aplicativo\ncodigo\ncodigo aplicativo\nconfiguracao\nconfiguracoes\nconfiguracoes aplicativo\ncontrolar\ncriar\ncriar criar\ncron\ndepurar\neditar\nexecutar\nferramenta\nfluxo de trabalho\ngatilho\ngerenciar\ngerenciar aplicativo\nimplementar\nlistar\nmodelo\nmonitor\nmostrar\nparar\nperguntar\npreferencias\nprogramacao\nrepositorio\nsolicitacao\nteste";
                    readonly tl: "agent\naksyon\napp\napp kontrol\napp patakbuhin\nautomation\nautomation app\ncode\ncode app\nconfiguration\ncron\ndebug\ngumawa\ngumawa gumawa\ni-edit\nilista\nipatupad\nitigil\nkahilingan\nkasangkapan\nkontrol\nmagtanong\nmodel settings\nmonitor\npamahalaan\npamahalaan app\npatakbuhin\npreferences\nprogramming\nrepo\nsettings\nsettings app\ntest\ntoggle\ntrigger\nworkflow";
                    readonly vi: "cai dat\ncài đặt\ncài đặt ứng dụng\ncấu hình\nchay\nchạy\nchinh sua\nchỉnh sửa\ncong cu\ncông cụ\ndieu khien\nđiều khiển\nhanh dong\nhành động\nhoi\nhỏi\nkho ma\nkho mã\nkich hoat\nkiểm thử\nlap trinh\nlập trình\nliet ke\nliệt kê\nma\nmã\nmã ứng dụng\nquan ly\nquản lý\nquản lý ứng dụng\nquy trinh\nquy trình\ntac tu\ntác tử\ntao\ntạo\ntạo tạo\ntu dong hoa\ntự động hóa\ntự động hóa ứng dụng\ntuy chon\ntùy chọn\nung dung\nứng dụng\nứng dụng chạy\nứng dụng điều khiển\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "仓库\n代理\n代码\n代码 应用\n偏好\n停止\n列出\n创建\n创建 创建\n定时\n实现\n工作流\n工具\n应用\n应用 控制\n应用 运行\n开关\n控制\n操作\n智能体\n模型设置\n测试\n监控\n管理\n管理 应用\n编程\n编辑\n自动化\n自动化 应用\n触发器\n设置\n设置 应用\n询问\n请求\n调试\n运行\n配置";
                };
            };
        };
        readonly askUserQuestion: {
            readonly request: {
                readonly base: "action\naction does\naction returns\nanswer\nask\nask user question\nask_user_question\nautomation ask user question\nback\nback user\nblock\nblocking\nbroadcast\nchoice\nclarify\ncode ask user question\ndata\ndescriptions\ndoes\neach\nfull\nheader\nintegration\ninteractive\nlayer\nmulti\noptional\noptions\npayload\npending\npreviews\nprompt\npublished\nquestion\nquestions\nquestions user\nrender\nrender action\nresponse\nreturns\nshort\nstring\nstructured\nsurface\nsurface action\nterminal ask user question\ntreat\nuser\nuser each\nuser integration\nwaiting";
                readonly locales: {
                    readonly es: "accion\nautomatizacion\nautomatizacion preguntar usuario\nbash\nbloquear\ncodigo\ncodigo preguntar usuario\ncron\ndepurar\ndisparador\nflujo de trabajo\nherramienta\nimplementar\nlinea de comandos\nmonitor\npreguntar\npreguntar usuario\nproceso\nprogramacion\nprueba\nrepositorio\nresponder\nrespuesta\nshell\nsolicitud\nterminal\nterminal preguntar usuario\nusuario";
                    readonly ko: "구현\n답변\n도구\n디버그\n명령줄\n모니터\n배시\n사용자\n셸\n요청\n워크플로\n자동화\n자동화 질문 사용자\n작업\n저장소\n질문\n질문 사용자\n차단\n코드\n코드 질문 사용자\n크론\n터미널\n터미널 질문 사용자\n테스트\n트리거\n프로그래밍\n프로세스";
                    readonly pt: "acao\nautomacao\nautomacao perguntar usuario\nbash\nbloquear\ncodigo\ncodigo perguntar usuario\ncron\ndepurar\nferramenta\nfluxo de trabalho\ngatilho\nimplementar\nlinha de comando\nmonitor\nperguntar\nperguntar usuario\nprocesso\nprogramacao\nrepositorio\nresponder\nresposta\nshell\nsolicitacao\nterminal\nterminal perguntar usuario\nteste\nusuario";
                    readonly tl: "aksyon\nautomation\nautomation magtanong user\nbash\ncode\ncode magtanong user\ncommand line\ncron\ndebug\ngumagamit\ni-block\nipatupad\nkahilingan\nkasangkapan\nmagtanong\nmagtanong user\nmonitor\nprocess\nprogramming\nrepo\nsagot\nshell\nterminal\nterminal magtanong user\ntest\ntrigger\nuser\nworkflow";
                    readonly vi: "bash\nchan\nchặn\ncong cu\ncông cụ\ndong lenh\ndòng lệnh\nhanh dong\nhành động\nhoi\nhỏi\nhỏi người dùng\nkho ma\nkho mã\nkich hoat\nkiểm thử\nlap trinh\nlập trình\nma\nmã\nmã hỏi người dùng\nnguoi dung\nngười dùng\nquy trinh\nquy trình\nshell\nterminal\nterminal hỏi người dùng\ntiến trình\ntra loi\ntrả lời\ntu dong hoa\ntự động hóa\ntự động hóa hỏi người dùng\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "Bash\n仓库\n代码\n代码 询问 用户\n命令行\n回答\n定时\n实现\n工作流\n工具\n操作\n标准输出\n测试\n用户\n监控\n终端\n终端 询问 用户\n编程\n自动化\n自动化 询问 用户\n触发器\n询问\n询问 用户\n请求\n调试\n进程\n阻止";
                };
            };
        };
        readonly bash: {
            readonly request: {
                readonly base: "automation bash\nbash\nbash command\nblocklist\ncode\ncode bash\ncode hard\ncommand\ncommand bash\ncommand paths\ncommand runs\ncommand synchronously\nconfigured\ndefault\nexec\nexecute\nexecute shell\nexit\nexit code\nhard\nkills\nkills command\nlimits\npaths\nreturns\nrun\nrun command\nrun shell\nrun_command\nruns\nruns synchronously\nsession\nshell\nshell command\nstderr\nstdout\nsynchronously\nterminal bash\ntimeout\nunder";
                readonly locales: {
                    readonly es: "accion\nautomatizacion\nautomatizacion bash\nbash\nbash comando\ncodigo\ncodigo bash\ncomando\ncomando bash\ncomando ejecutar\ncron\ndepurar\ndisparador\nejecutar\nejecutar comando\nflujo de trabajo\nherramienta\nimplementar\nlinea de comandos\nmonitor\nproceso\nprogramacion\nprueba\nrepositorio\nshell\nsolicitud\nterminal\nterminal bash";
                    readonly ko: "구현\n도구\n디버그\n명령\n명령 배시\n명령 실행\n명령줄\n모니터\n배시\n배시 명령\n셸\n실행\n실행 명령\n요청\n워크플로\n자동화\n자동화 배시\n작업\n저장소\n코드\n코드 배시\n크론\n터미널\n터미널 배시\n테스트\n트리거\n프로그래밍\n프로세스";
                    readonly pt: "acao\nautomacao\nautomacao bash\nbash\nbash comando\ncodigo\ncodigo bash\ncomando\ncomando bash\ncomando executar\ncron\ndepurar\nexecutar\nexecutar comando\nferramenta\nfluxo de trabalho\ngatilho\nimplementar\nlinha de comando\nmonitor\nprocesso\nprogramacao\nrepositorio\nshell\nsolicitacao\nterminal\nterminal bash\nteste";
                    readonly tl: "aksyon\nautomation\nautomation bash\nbash\nbash command\ncode\ncode bash\ncommand\ncommand bash\ncommand line\ncommand patakbuhin\ncron\ndebug\nipatupad\nkahilingan\nkasangkapan\nmonitor\npatakbuhin\npatakbuhin command\nprocess\nprogramming\nrepo\nshell\nterminal\nterminal bash\ntest\ntrigger\nworkflow";
                    readonly vi: "bash\nbash lệnh\nchay\nchạy\nchạy lệnh\ncong cu\ncông cụ\ndong lenh\ndòng lệnh\nhanh dong\nhành động\nkho ma\nkho mã\nkich hoat\nkiểm thử\nlap trinh\nlập trình\nlenh\nlệnh\nlệnh bash\nlệnh chạy\nma\nmã\nmã bash\nquy trinh\nquy trình\nshell\nterminal\nterminal bash\nthuc thi\nthực thi\ntiến trình\ntu dong hoa\ntự động hóa\ntự động hóa bash\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "Bash\nbash 命令\n仓库\n代码\n代码 bash\n命令\n命令 bash\n命令 运行\n命令行\n定时\n实现\n工作流\n工具\n执行\n操作\n标准输出\n测试\n监控\n终端\n终端 bash\n编程\n自动化\n自动化 bash\n触发器\n请求\n调试\n运行\n运行 命令\n进程";
                };
            };
        };
        readonly bookTravel: {
            readonly request: {
                readonly base: "approval\napproval calendar\nbecome\nbook flight\nbook hotel\nbook travel\nbook trip\nbook_flight\nbook_hotel\nbook_travel\nbook_trip\nbooking\nbooking requests\nbrowser book travel\ncalendar\ncalendar book travel\ncalendar sync\ncollection\ncollection draft\ncompleted\nconfirm\nconfirm calendar\ncontacts book travel\ndetail\ndraft\ndraft confirm\nexplicit\nfinance book travel\nflight\nflights\ngate\ngated\nhotel\nhotels\nmissing\nonce\npayments book travel\nprepare\nreal\nreal travel\nrequests\nrequests that\nreserve flight\nreserve_flight\nsearch\nsearch prepare\nshould\nsync\ntasks book travel\nthat\ntravel\ntravel booking\ntravel_booking";
                readonly locales: {
                    readonly es: "abrir pagina\naccion\namigo\nborrador\nbuscar\ncalendario\ncalendario reservar viaje\ncheckout\ncobro\ncolega\ncontacto\ncontacto reservar viaje\ncontactos\ncuenta\ndinero\nfactura\nfecha limite\nfinanzas\ngente\nhacer clic\nherramienta\nnavegador\nnavegador reservar viaje\npagar\npago\npago reservar viaje\npedir\npendiente\npersona\nportafolio\nrecordatorio\nrelacion\nreservar\nreservar viaje\nsaldo\nseguimiento\nsitio web\nsolicitud\ntarea\ntarea reservar viaje\ntareas\nviaje";
                    readonly ko: "검색\n결제\n결제 예약 여행\n계정\n관계\n금융\n도구\n돈\n동료\n리마인더\n마감일\n브라우저\n브라우저 예약 여행\n사람\n여행\n연락처\n연락처 예약 여행\n예약\n예약 여행\n요금\n요청\n웹사이트 입력\n일정\n작업\n작업 예약 여행\n잔액\n지불\n청구서\n체크아웃\n초안\n친구\n캘린더\n캘린더 예약 여행\n클릭\n페이지 열기\n포트폴리오\n할 일\n후속 조치";
                    readonly pt: "abrir pagina\nacao\nacompanhamento\nafazer\namigo\nbuscar\ncalendario\ncalendario reservar viagem\ncheckout\nclicar\ncobranca\ncolega\nconta\ncontato\ncontato reservar viagem\ncontatos\ndinheiro\nfatura\nferramenta\nfinancas\nlembrete\nnavegador\nnavegador reservar viagem\npagamento\npagamento reservar viagem\npagar\npedir\npessoa\npessoas\nportfolio\nprazo\nrascunho\nrelacao\nreservar\nreservar viagem\nsaldo\nsite\nsolicitacao\ntarefa\ntarefa reservar viagem\ntarefas\nviagem";
                    readonly tl: "account\naksyon\nbalance\nbayad\nbayad mag-book biyahe\nbilling\nbiyahe\nbrowser\nbrowser mag-book biyahe\nbuksan ang pahina\ncheckout\nclick\ncontact\ncontact mag-book biyahe\ncontacts\ndeadline\ndraft\nfinance\nfollow up\ngawain\ngawain mag-book biyahe\nhiling\ninvoice\nireserba\nkahilingan\nkaibigan\nkalendaryo\nkalendaryo mag-book biyahe\nkasamahan\nkasangkapan\nmag-book\nmag-book biyahe\nmagbayad\nmaghanap\npaalala\npera\nportfolio\nrelasyon\ntao\ntask\ntodo\nwebsite";
                    readonly vi: "ban nhap\nbản nháp\ncong cu\ncông cụ\nđặt\nđặt du lịch\ndu lich\ndu lịch\nhanh dong\nhành động\nhoa don\nhóa đơn\nlịch đặt du lịch\nlien he\nliên hệ\nliên hệ đặt du lịch\nmo trang\nmở trang\nnguoi\nngười\nnhắc nhở\nnhấp\nnhiem vu\nnhiệm vụ\nnhiệm vụ đặt du lịch\nquan he\nquan hệ\nso du\nsố dư\ntac vu\ntác vụ\ntai chinh\ntài chính\nthanh toan\nthanh toán\nthanh toán đặt du lịch\ntien\ntiền\ntim kiem\ntìm kiếm\ntính tiền\ntrinh duyet\ntrình duyệt\ntrình duyệt đặt du lịch\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "人物\n付款\n付款 预订 旅行\n任务\n任务 预订 旅行\n余额\n关系\n发票\n同事\n工具\n待办\n截止日期\n打开页面\n投资组合\n提醒\n搜索\n操作\n支付\n旅行\n日历\n日历 预订 旅行\n朋友\n浏览器\n浏览器 预订 旅行\n点击\n结账\n网站输入\n联系人\n联系人 预订 旅行\n草稿\n请求\n财务\n账单\n账户\n跟进\n钱\n预订\n预订 旅行";
                };
            };
        };
        readonly browser: {
            readonly request: {
                readonly base: "action\nagent\nagent autofill\nauthorized\nauthorized settings\nautofill\nautofill browser login\nautofill login\nautomation browser\navailable\nback\nbridge\nbridge settings\nbrowse site\nbrowser\nbrowser action\nbrowser autofill login\nbrowser bridge\nbrowser browser\nbrowser page\nbrowser session\nchrome\nchromium\nclick\nclick type\ncompanion\ncomputeruse\nconfigured\ncontrol\ncontrol browser\ncontrol browser session\ncontrol open\ncredential\ncredential workspace\ndefault\ndesktop\ndomain\ndriven\nelectrobun\nembedded\nextension\nfalls\nfill browser credentials\ngated\njsdom\nlocal\nlog into site\nlogin\nlogin domain\nlogins\nlogins bridge\nmanage browser\nmanage eliza browser workspace\nmanage lifeops browser\nmode\nnavigate\nnavigate click\nnavigate site\nopen\nopen navigate\nopen site\npage\npage control\npicks\npluggable\nplugin\npuppeteer\nreal\nregistered\nsafari\nscreenshot\nscreenshot state\nsecrets browser\nservice\nsettings\nsettings status\nsettings vault\nsign in to site\nsingle\nstate\nstatus manage\nsubaction\ntarget\ntargets\ntype\ntype screenshot\nuse browser\nuser\nuses\nvault\nvault logins\nview\nweb\nweb browser\nwhat\nworkspace authorized";
                readonly locales: {
                    readonly es: "abrir\nabrir pagina\nabrir url\naccion\nadministrar\nagente\nautomatizacion\nautomatizacion navegador\nbuscar web\ncaptura de pantalla\nclave api\nclic\nconfiguracion\nconfiguracion estado\ncontraseña\ncontrolar\ncontrolar abrir\ncontrolar navegador\ncredencial\ncron\ndisparador\nescritorio\nespacio de trabajo\nestado gestionar\nflujo de trabajo\ngestionar\ngestionar navegador\ngestionar navegador espacio de trabajo\nhacer clic\ninformacion actual\niniciar sesion\ninternet\nmonitor\nnavegador\nnavegador accion\nnavegador iniciar sesion\nnavegador navegador\nnavegador pagina\npagina\npagina controlar\nplugin\nsecreto\nsecretos\nsitio web\ntoken\nultimo\nusuario\nweb";
                    readonly ko: "api 키\nurl 열기\n관리\n관리 브라우저\n관리 브라우저 작업공간\n데스크톱\n도구\n로그인\n모니터\n브라우저\n브라우저 로그인\n브라우저 브라우저\n브라우저 작업\n브라우저 페이지\n비밀\n비밀번호\n사용자\n상태\n상태 관리\n설정\n설정 상태\n스크린샷\n시크릿\n에이전트\n열기\n워크플로\n웹\n웹 검색\n웹사이트 입력\n인터넷\n자격 증명\n자동화\n자동화 브라우저\n작업\n작업공간\n제어\n제어 브라우저\n제어 열기\n최신\n최신 정보\n크론\n클릭\n토큰\n트리거\n페이지\n페이지 열기\n페이지 제어\n플러그인";
                    readonly pt: "abrir\nabrir pagina\nabrir url\nacao\nagente\narea de trabalho\nautomacao\nautomacao navegador\nbuscar na web\ncaptura de tela\nchave api\nclicar\nconfiguracoes\nconfiguracoes status\ncontrolar\ncontrolar abrir\ncontrolar navegador\ncredencial\ncron\nentrar\nespaco de trabalho\nfluxo de trabalho\ngatilho\ngerenciar\ngerenciar navegador\ngerenciar navegador workspace\ninformacao atual\ninternet\nlogin\nmonitor\nnavegador\nnavegador acao\nnavegador entrar\nnavegador navegador\nnavegador pagina\npagina\npagina controlar\nplugin\nsegredo\nsegredos\nsenha\nsite\nstatus\nstatus gerenciar\ntoken\nusuario\nweb\nworkspace";
                    readonly tl: "agent\naksyon\napi key\nautomation\nautomation browser\nbrowser\nbrowser aksyon\nbrowser browser\nbrowser mag-login\nbrowser pahina\nbuksan\nbuksan ang pahina\nclick\ncredential\ncron\ndesktop\ngumagamit\ninternet\nkahilingan\nkasalukuyang impormasyon\nkasangkapan\nkontrol\nkontrol browser\nkontrol buksan\nmag-login\nmonitor\nopen url\npahina\npahina kontrol\npamahalaan\npamahalaan browser\npamahalaan browser workspace\npassword\nplugin\nscreenshot\nsearch web\nsecret\nsettings\nsettings status\nstatus\nstatus pamahalaan\ntoken\ntrigger\nuser\nweb\nwebsite\nworkflow\nworkspace";
                    readonly vi: "anh chup man hinh\nảnh chụp màn hình\nbi mat\nbí mật\ncai dat\ncài đặt\ndang nhap\nđăng nhập\ndieu khien\nđiều khiển\nđiều khiển mở\nđiều khiển trình duyệt\nhanh dong\nhành động\nkhoa api\nkhóa api\nkhong gian lam viec\nkhông gian làm việc\nkich hoat\nmật khẩu\nmay tinh de ban\nmáy tính để bàn\nmo trang\nmở trang\nnguoi dung\nngười dùng\nquan ly\nquản lý\nquản lý trình duyệt\nquản lý trình duyệt không gian làm việc\nquy trinh\nquy trình\ntac tu\ntác tử\nthong tin hien tai\nthông tin hiện tại\ntìm web\ntrang điều khiển\ntrạng thái\ntrinh duyet\ntrình duyệt\ntrình duyệt đăng nhập\ntrình duyệt hành động\ntrình duyệt trang\ntrình duyệt trình duyệt\ntu dong hoa\ntự động hóa\ntự động hóa trình duyệt";
                    readonly "zh-CN": "API 密钥\n互联网\n代理\n令牌\n最新信息\n凭据\n定时\n密码\n密钥\n工作区\n工作流\n截图\n打开\n打开网址\n打开页面\n控制\n控制 打开\n控制 浏览器\n插件\n操作\n智能体\n桌面\n浏览器\n浏览器 操作\n浏览器 浏览器\n浏览器 登录\n浏览器 页面\n点击\n状态\n状态 管理\n用户\n登录\n监控\n秘密\n管理\n管理 浏览器\n管理 浏览器 工作区\n网站输入\n网络\n网页\n网页搜索\n自动化\n自动化 浏览器\n触发器\n设置\n设置 状态\n页面\n页面 控制";
                };
            };
        };
        readonly character: {
            readonly request: {
                readonly base: "admin character\nagent\nagent character\nagent internal character\nagent replace\nagent_internal character\ncharacter\ncharacter modify\ncharacter persistence\ndriven\nflush\nflush memory\nformat\nidentity\nmedia character\nmemory\nmemory runtime\nmodify\nmodify character\nmodify_character\nname\npersist\npersist character\npersist update\npersist_character\npersistence\npersonality\nprompt\nrename\nrename agent\nrename_agent\nreplace\nresponse\nruntime\nruntime character\nservice\nservice update\nset agent name\nset identity\nset system prompt\nset_agent_name\nset_identity\nset_system_prompt\nsettings character\nstyle\nsystem\ntone\ntopics\nupdate\nupdate agent\nupdate agent name\nupdate identity\nupdate owner name\nupdate system prompt\nupdate_agent_name\nupdate_identity\nupdate_owner_name\nupdate_system_prompt\nvoice";
                readonly locales: {
                    readonly es: "accion\nactivar\nactualizar\nactualizar agente\nadministrador\nadministrador personaje\nagente\nagente personaje\najustes\naudio\ncaptura\nconfiguracion\nconfiguracion personaje\ndueño\nestado interno\ngestion interna\nherramienta\nimagen\ninterno del agente\nmemoria\nmodelo\nmultimedia\nmultimedia personaje\npermisos\npersonaje\npolitica\npreferencias\nroles\nsolicitud\ntranscripcion\nvideo";
                    readonly ko: "관리자\n관리자 캐릭터\n구성\n권한\n기억\n내부 상태\n도구\n모델 설정\n미디어\n미디어 캐릭터\n비디오\n설정\n설정 캐릭터\n소유자\n스크린샷\n업데이트\n업데이트 에이전트\n에이전트\n에이전트 내부\n에이전트 캐릭터\n역할\n오디오\n요청\n이미지\n자체 관리\n작업\n전사\n정책\n캐릭터\n토글\n환경설정";
                    readonly pt: "acao\nadministrador\nadministrador personagem\nagente\nagente personagem\nalternar\natualizar\natualizar agente\naudio\ncaptura\nconfiguracao\nconfiguracoes\nconfiguracoes personagem\ndono\nestado interno\nferramenta\nfuncoes\ngestao interna\nimagem\ninterno do agente\nmemoria\nmidia\nmidia personagem\nmodelo\npermissoes\npersonagem\npolitica\npreferencias\nsolicitacao\ntranscricao\nvideo";
                    readonly tl: "admin\nadmin karakter\nagent\nagent karakter\naksyon\nalaala\naudio\nconfiguration\ni-update\ni-update agent\ninternal ng agent\ninternal state\nkahilingan\nkarakter\nkasangkapan\nlarawan\nmay ari\nmedia\nmedia karakter\nmemory\nmodel settings\npahintulot\npatakaran\npreferences\nrole\nsariling pamamahala\nscreenshot\nsettings\nsettings karakter\ntoggle\ntranscript\nvideo";
                    readonly vi: "âm thanh\ncai dat\ncài đặt\ncài đặt nhân vật\ncap nhat\ncập nhật\ncập nhật tác tử\ncấu hình\nchu so huu\nchủ sở hữu\ncong cu\ncông cụ\nda phuong tien\nđa phương tiện\nđa phương tiện nhân vật\nhanh dong\nhành động\nhinh anh\nhình ảnh\nky uc\nký ức\nnhan vat\nnhân vật\nnoi bo tac tu\nnội bộ tác tử\nquan tri\nquản trị\nquản trị nhân vật\nquyen\nquyền\ntac tu\ntác tử\ntác tử nhân vật\ntu quan ly\ntự quản lý\ntuy chon\ntùy chọn\nvideo\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "代理\n代理 角色\n代理内部\n偏好\n内部状态\n图片\n媒体\n媒体 角色\n工具\n开关\n截图\n所有者\n操作\n智能体\n更新\n更新 代理\n权限\n模型设置\n视频\n策略\n管理员\n管理员 角色\n自我管理\n角色\n记忆\n设置\n设置 角色\n请求\n转录\n配置\n音频";
                };
            };
        };
        readonly checkAvailability: {
            readonly request: {
                readonly base: "8601\nam i free\nam_i_free\navailability check\navailability_check\nbusy\ncalendar check availability\ncheck\ncheck availability\ncheck owner\ncheck_availability\ncontacts check availability\nevents\nfree\nfree busy\nfree_busy\nlist\nlist overlapping\noverlapping\nowner\ntasks check availability\ntime\nwindow\nwindow list";
                readonly locales: {
                    readonly es: "accion\namigo\ncalendario\ncalendario revisar disponibilidad\ncolega\ncomprobar\ncontacto\ncontacto revisar disponibilidad\ncontactos\ndisponibilidad\ndisponibilidad revisar\nfecha limite\ngente\nherramienta\nlistar\nmostrar\npendiente\npersona\nrecordatorio\nrelacion\nrevisar\nrevisar disponibilidad\nseguimiento\nsolicitud\ntarea\ntarea revisar disponibilidad\ntareas";
                    readonly ko: "가능 시간\n가능 시간 확인\n관계\n도구\n동료\n리마인더\n마감일\n목록\n사람\n연락처\n연락처 확인 가능 시간\n요청\n일정\n작업\n작업 확인 가능 시간\n친구\n캘린더\n캘린더 확인 가능 시간\n할 일\n확인\n확인 가능 시간\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\namigo\ncalendario\ncalendario verificar disponibilidade\ncolega\ncontato\ncontato verificar disponibilidade\ncontatos\ndisponibilidade\ndisponibilidade verificar\nferramenta\nlembrete\nlistar\nmostrar\npessoa\npessoas\nprazo\nrelacao\nsolicitacao\ntarefa\ntarefa verificar disponibilidade\ntarefas\nverificar\nverificar disponibilidade";
                    readonly tl: "aksyon\navailability\navailability suriin\ncontact\ncontact suriin availability\ncontacts\ndeadline\nfollow up\ngawain\ngawain suriin availability\nilista\nkahilingan\nkaibigan\nkalendaryo\nkalendaryo suriin availability\nkasamahan\nkasangkapan\npaalala\nrelasyon\nsuriin\nsuriin availability\ntao\ntask\ntodo";
                    readonly vi: "cong cu\ncông cụ\nhanh dong\nhành động\nkiem tra\nkiểm tra\nkiểm tra lịch rảnh\nlich\nlịch\nlịch kiểm tra lịch rảnh\nlich ranh\nlịch rảnh\nlịch rảnh kiểm tra\nlien he\nliên hệ\nliên hệ kiểm tra lịch rảnh\nliet ke\nliệt kê\nnguoi\nngười\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnhiệm vụ kiểm tra lịch rảnh\nquan he\nquan hệ\ntac vu\ntác vụ\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "人物\n任务\n任务 检查 可用时间\n关系\n列出\n可用时间\n可用时间 检查\n同事\n工具\n待办\n截止日期\n提醒\n操作\n日历\n日历 检查 可用时间\n朋友\n检查\n检查 可用时间\n联系人\n联系人 检查 可用时间\n请求\n跟进";
                };
            };
        };
        readonly checkin: {
            readonly request: {
                readonly base: "assembling\nautomation checkin\nbriefing\ncalendar\ncalendar checkin\ncalendar recent\ncheck\ncheck assembling\ncheck in\ncheck kind\ncheck_in\ncheckin\ndaily brief\ndaily_brief\nemail checkin\ngoals\ngoals inbox\nhabits\nhabits goals\nhealth checkin\ninbox\ninbox calendar\nkind\nlife\nlife check\nlife check in\nlife_check_in\nmorning\nmorning check in\nmorning checkin\nmorning_check_in\nmorning_checkin\nnight\nnight check\nnight check in\nnight checkin\nnight_check_in\nnight_checkin\nonly\nonly run\nowner\nowner todos\nrecent\nreturns\nrun\nrun checkin\nrun life\nrun morning checkin\nrun night checkin\nrun owner\nrun_checkin\nrun_morning_checkin\nrun_night_checkin\nsignals\nsummary\ntasks checkin\ntodos\ntodos habits";
                readonly locales: {
                    readonly es: "accion\nautomatizacion\nbandeja\nbandeja de entrada\nbandeja de entrada calendario\nbienestar\ncalendario\ncomprobar\ncorreo\ncron\ndisparador\nejecutar\nejercicio\nemail\nenviar correo\nfecha limite\nflujo de trabajo\nherramienta\nmedicina\nmeta\nmeta bandeja de entrada\nmonitor\nobjetivo\npendiente\nrecordatorio\nredactar correo\nrevisar\nsalud\nseguimiento\nsintoma\nsolicitud\nsueño\ntarea\ntareas\ntodo";
                    readonly ko: "건강\n도구\n리마인더\n마감일\n메일 보내기\n메일함\n모니터\n목표\n목표 받은편지함\n받은편지함\n받은편지함 캘린더\n수면\n실행\n약\n요청\n운동\n워크플로\n웰니스\n이메일\n일정\n자동화\n작업\n증상\n캘린더\n크론\n트리거\n할 일\n할일\n확인\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\nautomacao\nbem-estar\ncaixa de entrada\ncaixa de entrada calendario\ncalendario\ncorreio\ncron\nemail\nenviar email\nexecutar\nexercicio\nferramenta\nfluxo de trabalho\ngatilho\nlembrete\nmeta\nmeta caixa de entrada\nmonitor\nobjetivo\nprazo\nremedio\nsaude\nsintoma\nsolicitacao\nsono\ntarefa\ntarefas\ntodo\nverificar";
                    readonly tl: "aksyon\nautomation\ncron\ndeadline\nehersisyo\nemail\nfollow up\ngamot\ngawain\ngumawa ng email\ninbox\ninbox kalendaryo\nkahilingan\nkalendaryo\nkalusugan\nkasangkapan\nkoreo\nlayunin\nlayunin inbox\nmagpadala ng email\nmonitor\npaalala\npatakbuhin\nsintomas\nsuriin\ntask\ntodo\ntrigger\ntulog\nwellness\nworkflow";
                    readonly vi: "chay\nchạy\ncong cu\ncông cụ\nemail\ngửi email\nhanh dong\nhành động\nhop thu\nhộp thư\nhộp thư lịch\nkich hoat\nkiem tra\nkiểm tra\nlich\nlịch\nmuc tieu\nmục tiêu\nmục tiêu hộp thư\nngu\nngủ\nnhắc nhở\nnhiem vu\nnhiệm vụ\nquy trinh\nquy trình\nsuc khoe\nsức khỏe\ntac vu\ntác vụ\ntập luyện\nthu\nthư\ntrieu chung\ntu dong hoa\ntự động hóa\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "任务\n健康\n发送邮件\n定时\n工作流\n工具\n待办\n截止日期\n提醒\n操作\n收件箱\n收件箱 日历\n日历\n检查\n症状\n监控\n目标\n目标 收件箱\n睡眠\n自动化\n药物\n触发器\n请求\n跟进\n运动\n运行\n邮件\n邮箱";
                };
            };
        };
        readonly clearLinearActivity: {
            readonly request: {
                readonly base: "activity\nautomation clear linear activity\nclear\nclear linear\nclear linear activity\nclear_linear_activity\nclear-linear-activity\nconnectors clear linear activity\ndelete linear activity\ndelete_linear_activity\ndelete-linear-activity\nlinear\nlinear activity\nreset linear activity\nreset_linear_activity\nreset-linear-activity\ntasks clear linear activity";
                readonly locales: {
                    readonly es: "accion\nactividad\nautomatizacion\nautomatizacion limpiar linear actividad\nborrar\nconector\nconector limpiar linear actividad\ncron\ncuenta conectada\ndisparador\neliminar\neliminar linear actividad\nfecha limite\nflujo de trabajo\nherramienta\nintegracion\nlimpiar\nlimpiar linear\nlimpiar linear actividad\nlinear\nlinear actividad\nmcp\nmonitor\noauth\npendiente\nrecordatorio\nseguimiento\nsolicitud\ntarea\ntarea limpiar linear actividad\ntareas";
                    readonly ko: "계정 연결\n도구\n리니어\n리니어 활동\n리마인더\n마감일\n모니터\n삭제\n삭제 리니어 활동\n오어스\n요청\n워크플로\n자동화\n자동화 지우기 리니어 활동\n작업\n작업 지우기 리니어 활동\n지우기\n지우기 리니어\n지우기 리니어 활동\n커넥터\n커넥터 지우기 리니어 활동\n크론\n통합\n트리거\n할 일\n활동\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\napagar\natividade\nautomacao\nautomacao limpar linear atividade\nconector\nconector limpar linear atividade\nconta conectada\ncron\nexcluir\nexcluir linear atividade\nferramenta\nfluxo de trabalho\ngatilho\nintegracao\nlembrete\nlimpar\nlimpar linear\nlimpar linear atividade\nlinear\nlinear atividade\nmcp\nmonitor\noauth\nprazo\nsolicitacao\ntarefa\ntarefa limpar linear atividade\ntarefas";
                    readonly tl: "account connection\naksyon\naktibidad\nautomation\nautomation linisin linear aktibidad\nburahin\nburahin linear aktibidad\nconnector\nconnector linisin linear aktibidad\ncron\ndeadline\nfollow up\ngawain\ngawain linisin linear aktibidad\nintegration\nkahilingan\nkasangkapan\nlinear\nlinear aktibidad\nlinisin\nlinisin linear\nlinisin linear aktibidad\nmonitor\noauth\npaalala\ntask\ntodo\ntrigger\nworkflow";
                    readonly vi: "cong cu\ncông cụ\nhanh dong\nhành động\nhoat dong\nhoạt động\nket noi\nkết nối\nkết nối xóa linear hoạt động\nkich hoat\nlinear\nlinear hoạt động\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnhiệm vụ xóa linear hoạt động\noauth\nquy trinh\nquy trình\ntac vu\ntác vụ\ntài khoản\ntich hop\ntích hợp\ntu dong hoa\ntự động hóa\ntự động hóa xóa linear hoạt động\nviec can lam\nviệc cần làm\nxoa\nxóa\nxóa linear\nxóa linear hoạt động\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "linear\nlinear 活动\n任务\n任务 清除 linear 活动\n删除\n删除 linear 活动\n定时\n工作流\n工具\n待办\n截止日期\n授权\n提醒\n操作\n活动\n清除\n清除 linear\n清除 linear 活动\n监控\n自动化\n自动化 清除 linear 活动\n触发器\n请求\n账号连接\n跟进\n连接器\n连接器 清除 linear 活动\n集成";
                };
            };
        };
        readonly code: {
            readonly request: {
                readonly base: "agent internal code\nagent_internal code\narchive\narchive reopen\nautomation code\ncode\ncode code\ncode task\ncode umbrella\ncode_task\ncoding\ncoding task\ncreate\ncreate submit\nfiles code\nreopen\nsubmit\ntask\ntask archive\ntasks code\numbrella\numbrella workspace\nworkspace\nworkspace create";
                readonly locales: {
                    readonly es: "accion\nagente\nagente codigo\narchivar\narchivo\narchivo codigo\narchivos\nautomatizacion\nautomatizacion codigo\ncarpeta\ncodigo\ncodigo codigo\ncodigo tarea\ncrear\ncron\ndepurar\ndirectorio\ndisparador\nespacio de trabajo\nespacio de trabajo crear\nestado interno\nfecha limite\nflujo de trabajo\ngestion interna\nherramienta\nimplementar\ninterno del agente\nleer archivo\nmonitor\npendiente\nprogramacion\nprueba\nrecordatorio\nrepositorio\nseguimiento\nsolicitud\ntarea\ntarea archivar\ntarea codigo\ntareas";
                    readonly ko: "구현\n내부 상태\n도구\n디렉터리\n디버그\n리마인더\n마감일\n모니터\n보관\n생성\n에이전트\n에이전트 내부\n에이전트 코드\n요청\n워크플로\n자동화\n자동화 코드\n자체 관리\n작업\n작업 보관\n작업 코드\n작업공간\n작업공간 생성\n저장소\n코드\n코드 작업\n코드 코드\n크론\n테스트\n트리거\n파일\n파일 쓰기\n파일 읽기\n파일 코드\n폴더\n프로그래밍\n할 일\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\nagente\nagente codigo\narquivar\narquivo\narquivo codigo\narquivos\nautomacao\nautomacao codigo\ncodigo\ncodigo codigo\ncodigo tarefa\ncriar\ncron\ndepurar\ndiretorio\nespaco de trabalho\nestado interno\nferramenta\nfluxo de trabalho\ngatilho\ngestao interna\nimplementar\ninterno do agente\nlembrete\nler arquivo\nmonitor\npasta\nprazo\nprogramacao\nrepositorio\nsolicitacao\ntarefa\ntarefa arquivar\ntarefa codigo\ntarefas\nteste\nworkspace\nworkspace criar";
                    readonly tl: "agent\nagent code\naksyon\nautomation\nautomation code\nbasahin file\ncode\ncode code\ncode gawain\ncron\ndeadline\ndebug\ndirectory\nfile\nfile code\nfiles\nfolder\nfollow up\ngawain\ngawain code\ngawain i-archive\ngumawa\ni-archive\ninternal ng agent\ninternal state\nipatupad\nkahilingan\nkasangkapan\nmonitor\npaalala\nprogramming\nrepo\nsariling pamamahala\ntask\ntest\ntodo\ntrigger\nworkflow\nworkspace\nworkspace gumawa";
                    readonly vi: "cong cu\ncông cụ\ndoc tep\nđọc tệp\nhanh dong\nhành động\nkho ma\nkho mã\nkhong gian lam viec\nkhông gian làm việc\nkhông gian làm việc tạo\nkich hoat\nkiểm thử\nlap trinh\nlập trình\nluu tru\nlưu trữ\nma\nmã\nmã mã\nmã nhiệm vụ\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnhiệm vụ lưu trữ\nnhiệm vụ mã\nnoi bo tac tu\nnội bộ tác tử\nquy trinh\nquy trình\ntac tu\ntác tử\ntác tử mã\ntac vu\ntác vụ\ntệp\ntệp mã\nthu muc\nthư mục\ntu dong hoa\ntự động hóa\ntự động hóa mã\ntu quan ly\ntự quản lý\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "仓库\n代理\n代理 代码\n代理内部\n代码\n代码 代码\n代码 任务\n任务\n任务 代码\n任务 归档\n内部状态\n写文件\n创建\n定时\n实现\n工作区\n工作区 创建\n工作流\n工具\n归档\n待办\n截止日期\n提醒\n操作\n文件\n文件 代码\n文件夹\n智能体\n测试\n监控\n目录\n编程\n自动化\n自动化 代码\n自我管理\n触发器\n请求\n读取文件\n调试\n跟进";
                };
            };
        };
        readonly completeTodo: {
            readonly request: {
                readonly base: "agent internal complete todo\nagent_internal complete todo\ncomplete todo\ncomplete_todo\ncompleted\ndone todo\ndone_todo\nexisting\nexisting todo\nfinish todo\nfinish_todo\nitem\nmark\nmark complete\nmark_complete\ntodo\ntodo item\ntodos complete todo";
                readonly locales: {
                    readonly es: "accion\nagente\nagente completar todo\nborrar tarea\ncompletar\ncompletar tarea\ncompletar todo\nestado interno\nfinalizar\nfinalizar todo\ngestion interna\nherramienta\ninterno del agente\nlista de tareas\npendiente\npendientes\nsolicitud\ntarea\nterminar\ntodo\ntodo completar todo";
                    readonly ko: "내부 상태\n도구\n에이전트\n에이전트 내부\n에이전트 완료 할일\n완료\n완료 할일\n요청\n자체 관리\n작업\n작업 목록\n작업 삭제\n작업 완료\n할 일\n할일\n할일 완료 할일\n활성 작업";
                    readonly pt: "acao\nafazer\nafazeres\nagente\nagente concluir todo\napagar tarefa\ncompletar\nconcluir\nconcluir tarefa\nconcluir todo\nestado interno\nferramenta\nfinalizar\nfinalizar todo\ngestao interna\ninterno do agente\nlista de tarefas\nsolicitacao\ntodo\ntodo concluir todo";
                    readonly tl: "agent\nagent tapusin todo\naksyon\nburahin task\ngawain\ninternal ng agent\ninternal state\nkahilingan\nkasangkapan\nkumpletuhin task\nsariling pamamahala\ntapusin\ntapusin todo\ntask list\ntodo\ntodo tapusin todo";
                    readonly vi: "cong cu\ncông cụ\ndanh sách tác vụ\nhanh dong\nhành động\nhoan thanh\nhoàn thành\nhoàn thành tác vụ\nhoàn thành việc cần làm\nket thuc\nkết thúc\nkết thúc việc cần làm\nnoi bo tac tu\nnội bộ tác tử\ntac tu\ntác tử\ntác tử hoàn thành việc cần làm\ntu quan ly\ntự quản lý\nviec can lam\nviệc cần làm\nviệc cần làm hoàn thành việc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "代理\n代理 完成 待办\n代理内部\n任务列表\n内部状态\n删除任务\n完成\n完成 待办\n完成任务\n工具\n待办\n待办 完成 待办\n操作\n智能体\n活动任务\n结束\n结束 待办\n自我管理\n请求";
                };
            };
        };
        readonly computerUse: {
            readonly request: {
                readonly base: "acting\naction\nactions\nadmin computer use\napp\nautomation computer use\navailable\nbefore\nbrowser\nbrowser computer use\ncanonical\ncapture screen\nclick\nclick double\nclick modified\nclick screen\nclick with modifiers\nclick_screen\nclick_with_modifiers\ncombo\ncomputer\ncomputer action\ncomputer use\ncomputer_action\ncomputer_use\ncontrol\ncontrol computer\ncontrol screenshot\ncontrol_computer\ncross\ndesktop\ndesktop action\ndesktop control\ndesktop_action\ndetect\ndirect\ndouble\ndrag\neach\nelements\nfile\nfiles computer use\nfinder\nguidance\nincludes\ninteraction\nkey\nkey combo\nkey key\nkey_combo\nlife\nlinux\nmachine\nmodified\nmodified click\nmodifiers\nmouse click\nmouse_click\nmove\nmove mouse\nmove_mouse\nnative\noperation\nowner\nplatform\nplatform desktop\nplugin\npress key\npress_key\npurpose\nreal\nrequired\nresult\nright\nscreen time computer use\nscreen_time computer use\nscreenshot\nscreenshot click\nscroll\nscroll screen\nscroll_screen\nsee screen\nstandard\ntake\ntake screenshot\nterminal\nterminal computer use\ntype\ntype key\ntype text\ntype_text\nuse computer\nuse_computer\nwindows\nworkflows\nwrapper";
                readonly locales: {
                    readonly es: "abrir pagina\naccion\nadministrador\nadministrador computadora\narchivo\narchivo computadora\narchivos\nautomatizacion\nautomatizacion computadora\nbash\ncaptura de pantalla\ncaptura de pantalla clic\ncapturar pantalla\ncarpeta\nclave clave\nclic\nclic pantalla\ncomputadora\ncomputadora accion\ncontrolar\ncontrolar captura de pantalla\ncontrolar computadora\ncron\ndirectorio\ndisparador\ndueño\nenfoque\nescritorio\nescritorio accion\nescritorio controlar\nflujo de trabajo\nhacer clic\nleer archivo\nlimites de apps\nlinea de comandos\nmonitor\nnavegador\nnavegador computadora\nordenador\npermisos\npolitica\nproceso\nroles\nshell\nsitio web\nterminal\ntiempo de pantalla\nuso del dispositivo";
                    readonly ko: "관리자\n관리자 컴퓨터\n권한\n기기 사용\n데스크톱\n데스크톱 작업\n데스크톱 제어\n디렉터리\n명령줄\n모니터\n배시\n브라우저\n브라우저 컴퓨터\n사용 보고서\n셸\n소유자\n스크린 타임\n스크린샷 클릭\n앱 제한\n역할\n워크플로\n웹사이트 입력\n자동화\n자동화 컴퓨터\n작업\n정책\n제어\n제어 스크린샷\n제어 컴퓨터\n집중\n캡처 화면\n컴퓨터\n컴퓨터 작업\n크론\n클릭\n클릭 화면\n키\n키 키\n터미널\n트리거\n파일\n파일 쓰기\n파일 읽기\n파일 컴퓨터\n페이지 열기\n폴더\n프로세스\n화면";
                    readonly pt: "abrir pagina\nacao\nadministrador\nadministrador computador\narea de trabalho\narea de trabalho acao\narea de trabalho controlar\narquivo\narquivo computador\narquivos\nautomacao\nautomacao computador\nbash\ncaptura de tela\ncaptura de tela clicar\ncapturar tela\nchave\nchave chave\nclicar\nclicar tela\ncomputador\ncomputador acao\ncontrolar\ncontrolar captura de tela\ncontrolar computador\ncron\ndiretorio\ndono\nfluxo de trabalho\nfoco\nfuncoes\ngatilho\nler arquivo\nlimites de app\nlinha de comando\nmonitor\nnavegador\nnavegador computador\npasta\npermissoes\npolitica\nprocesso\nshell\nsite\ntela\ntempo de tela\nterminal\nuso do dispositivo";
                    readonly tl: "admin\nadmin computer\naksyon\napp limits\nautomation\nautomation computer\nbasahin file\nbash\nbrowser\nbrowser computer\nbuksan ang pahina\nclick\nclick screen\ncommand line\ncomputer\ncomputer aksyon\ncron\ndesktop\ndesktop aksyon\ndesktop kontrol\ndirectory\nfile\nfile computer\nfiles\nfocus\nfolder\ngamit ng device\nkey\nkey key\nkontrol\nkontrol computer\nkontrol screenshot\nkuha screen\nmay ari\nmonitor\npahintulot\npatakaran\nprocess\nrole\nscreen\nscreen time\nscreenshot\nscreenshot click\nshell\nterminal\ntrigger\nwebsite\nworkflow";
                    readonly vi: "anh chup man hinh\nảnh chụp màn hình\nchu so huu\nchủ sở hữu\nchụp màn hình\ndieu khien\nđiều khiển\nđiều khiển ảnh chụp màn hình\nđiều khiển máy tính\ndoc tep\nđọc tệp\ndong lenh\ndòng lệnh\ngiới hạn ứng dụng\nhanh dong\nhành động\nkich hoat\nman hinh\nmàn hình\nmay tinh\nmáy tính\nmay tinh de ban\nmáy tính để bàn\nmáy tính để bàn điều khiển\nmáy tính để bàn hành động\nmáy tính hành động\nmo trang\nmở trang\nnhấp màn hình\nquan tri\nquản trị\nquản trị máy tính\nquy trinh\nquy trình\ntệp máy tính\nthoi gian man hinh\nthời gian màn hình\nthu muc\nthư mục\ntiến trình\ntrinh duyet\ntrình duyệt\ntrình duyệt máy tính\ntu dong hoa\ntự động hóa\ntự động hóa máy tính\nung dung\nứng dụng";
                    readonly "zh-CN": "Bash\n专注\n使用报告\n写文件\n命令行\n定时\n屏幕\n屏幕时间\n工作流\n应用限制\n截图 点击\n所有者\n打开页面\n捕获 屏幕\n控制\n控制 截图\n控制 电脑\n操作\n文件\n文件 电脑\n文件夹\n权限\n标准输出\n桌面\n桌面 控制\n桌面 操作\n浏览器\n浏览器 电脑\n点击\n点击 屏幕\n电脑\n电脑 操作\n监控\n目录\n策略\n管理员\n管理员 电脑\n终端\n网站输入\n自动化\n自动化 电脑\n角色\n触发器\n设备使用\n读取文件\n进程\n键\n键 键";
                };
            };
        };
        readonly createLinearComment: {
            readonly request: {
                readonly base: "add\nadd comment\nadd linear comment\nadd_linear_comment\nadd-linear-comment\nautomation create linear comment\ncomment\ncomment linear\ncomment on linear issue\ncomment_on_linear_issue\ncomment-on-linear-issue\nconnectors create linear comment\ncreate linear comment\ncreate_linear_comment\ncreate-linear-comment\nissue\nlinear\nlinear issue\nreply to linear issue\nreply_to_linear_issue\nreply-to-linear-issue\ntasks create linear comment";
                readonly locales: {
                    readonly es: "accion\nagregar\nagregar comentario\nagregar linear comentario\nanadir\nautomatizacion\nautomatizacion crear linear comentario\ncomentario\ncomentario linear\ncomentario linear incidencia\nconector\nconector crear linear comentario\ncrear\ncrear linear comentario\ncron\ncuenta conectada\ndisparador\nfecha limite\nflujo de trabajo\nherramienta\nincidencia\nintegracion\nlinear\nlinear incidencia\nmcp\nmonitor\noauth\npendiente\nrecordatorio\nresponder\nresponder linear incidencia\nseguimiento\nsolicitud\ntarea\ntarea crear linear comentario\ntareas";
                    readonly ko: "계정 연결\n답장\n답장 리니어 이슈\n댓글\n댓글 리니어\n댓글 리니어 이슈\n도구\n리니어\n리니어 이슈\n리마인더\n마감일\n모니터\n생성\n생성 리니어 댓글\n오어스\n요청\n워크플로\n이슈\n자동화\n자동화 생성 리니어 댓글\n작업\n작업 생성 리니어 댓글\n추가\n추가 댓글\n추가 리니어 댓글\n커넥터\n커넥터 생성 리니어 댓글\n크론\n통합\n트리거\n할 일\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nadicionar\nadicionar comentario\nadicionar linear comentario\nafazer\nautomacao\nautomacao criar linear comentario\ncomentario\ncomentario linear\ncomentario linear problema\nconector\nconector criar linear comentario\nconta conectada\ncriar\ncriar linear comentario\ncron\nferramenta\nfluxo de trabalho\ngatilho\nintegracao\nissue\nlembrete\nlinear\nlinear problema\nmcp\nmonitor\noauth\nprazo\nproblema\nresponder\nresponder linear problema\nsolicitacao\ntarefa\ntarefa criar linear comentario\ntarefas";
                    readonly tl: "account connection\naksyon\nautomation\nautomation gumawa linear komento\nconnector\nconnector gumawa linear komento\ncron\ndeadline\nfollow up\ngawain\ngawain gumawa linear komento\ngumawa\ngumawa linear komento\nidagdag\nidagdag komento\nidagdag linear komento\nintegration\nisyu\nkahilingan\nkasangkapan\nkomento\nkomento linear\nkomento linear isyu\nlinear\nlinear isyu\nmonitor\noauth\npaalala\nsagot\nsagot linear isyu\nsumagot\ntask\ntodo\ntrigger\nworkflow";
                    readonly vi: "binh luan\nbình luận\nbình luận linear\nbình luận linear vấn đề\ncong cu\ncông cụ\nhanh dong\nhành động\nket noi\nkết nối\nkết nối tạo linear bình luận\nkich hoat\nlinear\nlinear vấn đề\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnhiệm vụ tạo linear bình luận\noauth\nquy trinh\nquy trình\ntac vu\ntác vụ\ntài khoản\ntao\ntạo\ntạo linear bình luận\nthem\nthêm\nthêm bình luận\nthêm linear bình luận\ntich hop\ntích hợp\ntra loi\ntrả lời\ntrả lời linear vấn đề\ntu dong hoa\ntự động hóa\ntự động hóa tạo linear bình luận\nvan de\nvấn đề\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "linear\nlinear 问题\n任务\n任务 创建 linear 评论\n创建\n创建 linear 评论\n回复\n回复 linear 问题\n定时\n工作流\n工具\n待办\n截止日期\n授权\n提醒\n操作\n添加\n添加 linear 评论\n添加 评论\n监控\n自动化\n自动化 创建 linear 评论\n触发器\n评论\n评论 linear\n评论 linear 问题\n请求\n账号连接\n跟进\n连接器\n连接器 创建 linear 评论\n问题\n集成";
                };
            };
        };
        readonly createLinearIssue: {
            readonly request: {
                readonly base: "add linear issue\nadd_linear_issue\nadd-linear-issue\nautomation create linear issue\nconnectors create linear issue\ncreate\ncreate issue\ncreate linear issue\ncreate_linear_issue\ncreate-linear-issue\nissue\nissue linear\nlinear\nnew linear issue\nnew_linear_issue\nnew-linear-issue\ntasks create linear issue";
                readonly locales: {
                    readonly es: "accion\nagregar\nagregar linear incidencia\nanadir\nautomatizacion\nautomatizacion crear linear incidencia\nconector\nconector crear linear incidencia\ncrear\ncrear incidencia\ncrear linear incidencia\ncron\ncuenta conectada\ndisparador\nfecha limite\nflujo de trabajo\nherramienta\nincidencia\nincidencia linear\nintegracion\nlinear\nlinear incidencia\nmcp\nmonitor\noauth\npendiente\nrecordatorio\nseguimiento\nsolicitud\ntarea\ntarea crear linear incidencia\ntareas";
                    readonly ko: "계정 연결\n도구\n리니어\n리니어 이슈\n리마인더\n마감일\n모니터\n생성\n생성 리니어 이슈\n생성 이슈\n오어스\n요청\n워크플로\n이슈\n이슈 리니어\n자동화\n자동화 생성 리니어 이슈\n작업\n작업 생성 리니어 이슈\n추가\n추가 리니어 이슈\n커넥터\n커넥터 생성 리니어 이슈\n크론\n통합\n트리거\n할 일\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nadicionar\nadicionar linear problema\nafazer\nautomacao\nautomacao criar linear problema\nconector\nconector criar linear problema\nconta conectada\ncriar\ncriar linear problema\ncriar problema\ncron\nferramenta\nfluxo de trabalho\ngatilho\nintegracao\nissue\nlembrete\nlinear\nlinear problema\nmcp\nmonitor\noauth\nprazo\nproblema\nproblema linear\nsolicitacao\ntarefa\ntarefa criar linear problema\ntarefas";
                    readonly tl: "account connection\naksyon\nautomation\nautomation gumawa linear isyu\nconnector\nconnector gumawa linear isyu\ncron\ndeadline\nfollow up\ngawain\ngawain gumawa linear isyu\ngumawa\ngumawa isyu\ngumawa linear isyu\nidagdag\nidagdag linear isyu\nintegration\nisyu\nisyu linear\nkahilingan\nkasangkapan\nlinear\nlinear isyu\nmonitor\noauth\npaalala\ntask\ntodo\ntrigger\nworkflow";
                    readonly vi: "cong cu\ncông cụ\nhanh dong\nhành động\nket noi\nkết nối\nkết nối tạo linear vấn đề\nkich hoat\nlinear\nlinear vấn đề\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnhiệm vụ tạo linear vấn đề\noauth\nquy trinh\nquy trình\ntac vu\ntác vụ\ntài khoản\ntao\ntạo\ntạo linear vấn đề\ntạo vấn đề\nthem\nthêm\nthêm linear vấn đề\ntich hop\ntích hợp\ntu dong hoa\ntự động hóa\ntự động hóa tạo linear vấn đề\nvan de\nvấn đề\nvấn đề linear\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "linear\nlinear 问题\n任务\n任务 创建 linear 问题\n创建\n创建 linear 问题\n创建 问题\n定时\n工作流\n工具\n待办\n截止日期\n授权\n提醒\n操作\n添加\n添加 linear 问题\n监控\n自动化\n自动化 创建 linear 问题\n触发器\n请求\n账号连接\n跟进\n连接器\n连接器 创建 linear 问题\n问题\n问题 linear\n集成";
                };
            };
        };
        readonly createPlan: {
            readonly request: {
                readonly base: "agent internal create plan\nagent_internal create plan\nautomation create plan\ncode create plan\ncomprehensive\ncreate plan\ncreate_plan\ncreates\ncreates comprehensive\ngenerate plan\ngenerate_plan\nmake plan\nmake_plan\nmultiple\nphases\nphases tasks\nplan\nplan multiple\nplan project\nplan_project\nproject\nproject plan\nproject_plan\ntasks\ntasks create plan\nmake a plan\ncomprehensive plan\norganize project\nstrategy\nstrategic plan";
                readonly locales: {
                    readonly es: "accion\nagente\nagente crear plan\nautomatizacion\nautomatizacion crear plan\ncodigo\ncodigo crear plan\ncrear\ncrear plan\ncron\ndepurar\ndisparador\nestado interno\nfecha limite\nflujo de trabajo\ngenerar\ngenerar plan\ngestion interna\nherramienta\nimplementar\ninterno del agente\nmonitor\npendiente\nplan\nprogramacion\nprueba\nrecordatorio\nrepositorio\nseguimiento\nsolicitud\ntarea\ntarea crear plan\ntareas\nhacer un plan\nplan de proyecto\nplan integral\norganizar proyecto\nestrategia\nplan estratégico\nplan estrategico";
                    readonly ko: "계획\n구현\n내부 상태\n도구\n디버그\n리마인더\n마감일\n모니터\n생성\n생성 계획\n에이전트\n에이전트 내부\n에이전트 생성 계획\n요청\n워크플로\n자동화\n자동화 생성 계획\n자체 관리\n작업\n작업 생성 계획\n저장소\n코드\n코드 생성 계획\n크론\n테스트\n트리거\n프로그래밍\n할 일\n후속 조치\n계획 만들어\n계획 세워\n프로젝트 계획\n종합 계획\n프로젝트 정리\n전략\n전략 계획";
                    readonly pt: "acao\nacompanhamento\nafazer\nagente\nagente criar plano\nautomacao\nautomacao criar plano\ncodigo\ncodigo criar plano\ncriar\ncriar plano\ncron\ndepurar\nestado interno\nferramenta\nfluxo de trabalho\ngatilho\ngerar\ngerar plano\ngestao interna\nimplementar\ninterno do agente\nlembrete\nmonitor\nplano\nprazo\nprogramacao\nrepositorio\nsolicitacao\ntarefa\ntarefa criar plano\ntarefas\nteste\nfazer um plano\nplano de projeto\nplano abrangente\norganizar projeto\nestratégia\nestrategia\nplano estratégico\nplano estrategico";
                    readonly tl: "agent\nagent gumawa plano\naksyon\nautomation\nautomation gumawa plano\nbumuo\nbumuo plano\ncode\ncode gumawa plano\ncron\ndeadline\ndebug\nfollow up\ngawain\ngawain gumawa plano\ngumawa\ngumawa plano\ninternal ng agent\ninternal state\nipatupad\nkahilingan\nkasangkapan\nmonitor\npaalala\nplano\nprogramming\nrepo\nsariling pamamahala\ntask\ntest\ntodo\ntrigger\nworkflow\ngumawa ng plano\nplano ng proyekto\nkomprehensibong plano\nayusin ang proyekto\ndiskarte\nestratehiya";
                    readonly vi: "cong cu\ncông cụ\nhanh dong\nhành động\nke hoach\nkế hoạch\nkho ma\nkho mã\nkich hoat\nkiểm thử\nlap trinh\nlập trình\nma\nmã\nmã tạo kế hoạch\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnhiệm vụ tạo kế hoạch\nnoi bo tac tu\nnội bộ tác tử\nquy trinh\nquy trình\ntac tu\ntác tử\ntác tử tạo kế hoạch\ntac vu\ntác vụ\ntao\ntạo\ntạo kế hoạch\ntu dong hoa\ntự động hóa\ntự động hóa tạo kế hoạch\ntu quan ly\ntự quản lý\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu\ntao ke hoach\nlập kế hoạch\nlap ke hoach\nkế hoạch dự án\nke hoach du an\nchiến lược\nchien luoc";
                    readonly "zh-CN": "仓库\n代理\n代理 创建 计划\n代理内部\n代码\n代码 创建 计划\n任务\n任务 创建 计划\n内部状态\n创建\n创建 计划\n定时\n实现\n工作流\n工具\n待办\n截止日期\n提醒\n操作\n智能体\n测试\n生成\n生成 计划\n监控\n编程\n自动化\n自动化 创建 计划\n自我管理\n触发器\n计划\n请求\n调试\n跟进\n创建计划\n制定计划\n项目计划\n综合计划\n组织项目\n策略\n战略计划";
                };
            };
        };
        readonly createTodo: {
            readonly request: {
                readonly base: "add todo\nadd_todo\nagent internal create todo\nagent_internal create todo\ncreate\ncreate todo\ncreate_todo\ndate\nitem\nitem user\nmake todo\nmake_todo\nnew todo\nnew_todo\nnotes\noptional\nplus\nrequired\ntitle\ntodo\ntodo item\ntodos create todo\nuser\nuser required";
                readonly locales: {
                    readonly es: "accion\nagente\nagente crear todo\nagregar\nagregar todo\nanadir\nborrar tarea\ncompletar tarea\ncrear\ncrear todo\nestado interno\ngestion interna\nherramienta\ninterno del agente\nlista de tareas\npendiente\npendientes\nsolicitud\ntarea\ntodo\ntodo crear todo\nusuario";
                    readonly ko: "내부 상태\n도구\n사용자\n생성\n생성 할일\n에이전트\n에이전트 내부\n에이전트 생성 할일\n요청\n자체 관리\n작업\n작업 목록\n작업 삭제\n작업 완료\n추가\n추가 할일\n할 일\n할일\n할일 생성 할일\n활성 작업";
                    readonly pt: "acao\nadicionar\nadicionar todo\nafazer\nafazeres\nagente\nagente criar todo\napagar tarefa\nconcluir tarefa\ncriar\ncriar todo\nestado interno\nferramenta\ngestao interna\ninterno do agente\nlista de tarefas\nsolicitacao\ntodo\ntodo criar todo\nusuario";
                    readonly tl: "agent\nagent gumawa todo\naksyon\nburahin task\ngawain\ngumagamit\ngumawa\ngumawa todo\nidagdag\nidagdag todo\ninternal ng agent\ninternal state\nkahilingan\nkasangkapan\nkumpletuhin task\nsariling pamamahala\ntask list\ntodo\ntodo gumawa todo\nuser";
                    readonly vi: "cong cu\ncông cụ\ndanh sách tác vụ\nhanh dong\nhành động\nhoàn thành tác vụ\nnguoi dung\nngười dùng\nnoi bo tac tu\nnội bộ tác tử\ntac tu\ntác tử\ntác tử tạo việc cần làm\ntao\ntạo\ntạo việc cần làm\nthem\nthêm\nthêm việc cần làm\ntu quan ly\ntự quản lý\nviec can lam\nviệc cần làm\nviệc cần làm tạo việc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "代理\n代理 创建 待办\n代理内部\n任务列表\n内部状态\n创建\n创建 待办\n删除任务\n完成任务\n工具\n待办\n待办 创建 待办\n操作\n智能体\n活动任务\n添加\n添加 待办\n用户\n自我管理\n请求";
                };
            };
        };
        readonly database: {
            readonly request: {
                readonly base: "admin database\nagent\nagent database\nagent internal database\nagent_internal database\nbrowse table\nbrowse_table\ndatabase\ndatabase list\ndb query\ndb tables\ndb_query\ndb_tables\ndefault\ndefault search\ndocuments database\nembedding search\nembedding_search\nexecute database query\nexecute_database_query\nget\nget table\nget table data\nget_table_data\ninspect\ninspect query\nlist\nlist database tables\nlist tables\nlist_database_tables\nlist_tables\nmemory\nmemory database\nmemory search\nonly\nquery\nquery agent\nquery read\nread\nread only\nread table\nread_table\nrun query\nrun_query\nsearch\nsearch vectors\nsearch_vectors\nselect table\nselect_table\nsemantic\nsemantic memory\nshow tables\nshow_tables\nsimilarity search\nsimilarity_search\nsql query\nsql_query\ntable\ntable query\ntables\ntables get\nvector search\nvector_search\nvectors";
                readonly locales: {
                    readonly es: "accion\nadministrador\nadministrador base de datos\nagente\nagente base de datos\narchivo\nbase de datos\nbase de datos listar\nbuscar\nconsulta\nconsulta agente\nconsulta leer\ndocumento\ndocumento base de datos\ndocumentos\ndueño\nejecutar\nejecutar base de datos consulta\nejecutar consulta\nestado interno\ngestion interna\nguardar memoria\nguardar notas\nherramienta\ninterno del agente\nleer\nlistar\nlistar base de datos\nmemoria\nmemoria base de datos\nmemoria buscar\nmostrar\nnotas\nobtener\npermisos\npolitica\nrecordar\nrecuerdo\nroles\nsolicitud\nsql consulta";
                    readonly ko: "sql 쿼리\n가져오기\n검색\n관리자\n관리자 데이터베이스\n권한\n기억\n기억 검색\n기억 데이터베이스\n기억해\n내부 상태\n노트\n데이터베이스\n데이터베이스 목록\n도구\n목록\n목록 데이터베이스\n문서\n문서 데이터베이스\n소유자\n실행\n실행 데이터베이스 쿼리\n실행 쿼리\n에이전트\n에이전트 내부\n에이전트 데이터베이스\n역할\n요청\n읽기\n자체 관리\n작업\n장기 기억\n저장\n정책\n질의\n쿼리\n쿼리 에이전트\n쿼리 읽기\n파일 내용\n회상";
                    readonly pt: "acao\nadministrador\nadministrador banco de dados\nagente\nagente banco de dados\narquivo\nbanco de dados\nbanco de dados listar\nbuscar\nconsulta\nconsulta agente\nconsulta ler\ndocumento\ndocumento banco de dados\ndocumentos\ndono\nestado interno\nexecutar\nexecutar banco de dados consulta\nexecutar consulta\nferramenta\nfuncoes\ngestao interna\ninterno do agente\nlembrar\nler\nlistar\nlistar banco de dados\nmemoria\nmemoria banco de dados\nmemoria buscar\nmostrar\nnotas\nobter\npermissoes\npolitica\nrecordar\nsalvar memoria\nsalvar notas\nsolicitacao\nsql consulta";
                    readonly tl: "admin\nadmin database\nagent\nagent database\naksyon\nalaala\nalalahanin\nbasahin\ndatabase\ndatabase ilista\ndokumento\ndokumento database\ni-save\nilista\nilista database\ninternal ng agent\ninternal state\nkahilingan\nkasangkapan\nkunin\nlong term memory\nmaghanap\nmay ari\nmemory\nmemory database\nmemory maghanap\nnilalaman ng file\nnotes\npahintulot\npatakaran\npatakbuhin\npatakbuhin database query\npatakbuhin query\nquery\nquery agent\nquery basahin\nrole\nsariling pamamahala\nsql query\ntandaan";
                    readonly vi: "chạy truy vấn\nchu so huu\nchủ sở hữu\nco so du lieu\ncơ sở dữ liệu\ncơ sở dữ liệu liệt kê\ncong cu\ncông cụ\nghi chu\nghi chú\nghi nho\nghi nhớ\nhanh dong\nhành động\nky uc\nký ức\nký ức cơ sở dữ liệu\nký ức tìm kiếm\nliet ke\nliệt kê\nliệt kê cơ sở dữ liệu\nlưu ghi chú\nnoi bo tac tu\nnội bộ tác tử\nquan tri\nquản trị\nquản trị cơ sở dữ liệu\nquyền\nsql truy vấn\ntac tu\ntác tử\ntác tử cơ sở dữ liệu\ntai lieu\ntài liệu\ntài liệu cơ sở dữ liệu\nthuc thi\nthực thi\nthực thi cơ sở dữ liệu truy vấn\ntim kiem\ntìm kiếm\ntruy van\ntruy vấn\ntruy vấn đọc\ntruy vấn tác tử\ntu quan ly\ntự quản lý\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "sql 查询\n代理\n代理 数据库\n代理内部\n保存笔记\n内部状态\n列出\n列出 数据库\n回忆\n工具\n所有者\n执行\n执行 数据库 查询\n搜索\n操作\n数据库\n数据库 列出\n文件内容\n文档\n文档 数据库\n智能体\n权限\n查询\n查询 代理\n查询 读取\n笔记\n策略\n管理员\n管理员 数据库\n自我管理\n获取\n角色\n记住\n记忆\n记忆 搜索\n记忆 数据库\n请求\n读取\n运行\n运行 查询\n长期记忆";
                };
            };
        };
        readonly deleteLinearComment: {
            readonly request: {
                readonly base: "automation delete linear comment\ncomment\nconnectors delete linear comment\ndelete\ndelete linear\ndelete linear comment\ndelete_linear_comment\nerase linear comment\nerase_linear_comment\nerase-linear-comment\nlinear\nlinear comment\nremove linear comment\nremove_linear_comment\nremove-linear-comment\ntasks delete linear comment";
                readonly locales: {
                    readonly es: "accion\nautomatizacion\nautomatizacion eliminar linear comentario\nborrar\ncomentario\nconector\nconector eliminar linear comentario\ncron\ncuenta conectada\ndisparador\neliminar\neliminar linear\neliminar linear comentario\nfecha limite\nflujo de trabajo\nherramienta\nintegracion\nlinear\nlinear comentario\nmcp\nmonitor\noauth\npendiente\nquitar\nrecordatorio\nseguimiento\nsolicitud\ntarea\ntarea eliminar linear comentario\ntareas";
                    readonly ko: "계정 연결\n댓글\n도구\n리니어\n리니어 댓글\n리마인더\n마감일\n모니터\n삭제\n삭제 리니어\n삭제 리니어 댓글\n오어스\n요청\n워크플로\n자동화\n자동화 삭제 리니어 댓글\n작업\n작업 삭제 리니어 댓글\n제거\n제거 리니어 댓글\n커넥터\n커넥터 삭제 리니어 댓글\n크론\n통합\n트리거\n할 일\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\napagar\nautomacao\nautomacao excluir linear comentario\ncomentario\nconector\nconector excluir linear comentario\nconta conectada\ncron\nexcluir\nexcluir linear\nexcluir linear comentario\nferramenta\nfluxo de trabalho\ngatilho\nintegracao\nlembrete\nlinear\nlinear comentario\nmcp\nmonitor\noauth\nprazo\nremover\nremover linear comentario\nsolicitacao\ntarefa\ntarefa excluir linear comentario\ntarefas";
                    readonly tl: "account connection\naksyon\nalisin\nalisin linear komento\nautomation\nautomation burahin linear komento\nburahin\nburahin linear\nburahin linear komento\nconnector\nconnector burahin linear komento\ncron\ndeadline\nfollow up\ngawain\ngawain burahin linear komento\nintegration\nkahilingan\nkasangkapan\nkomento\nlinear\nlinear komento\nmonitor\noauth\npaalala\ntask\ntodo\ntrigger\nworkflow";
                    readonly vi: "binh luan\nbình luận\ncong cu\ncông cụ\ngo\ngỡ\ngỡ linear bình luận\nhanh dong\nhành động\nket noi\nkết nối\nkết nối xóa linear bình luận\nkich hoat\nlinear\nlinear bình luận\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnhiệm vụ xóa linear bình luận\noauth\nquy trinh\nquy trình\ntac vu\ntác vụ\ntài khoản\ntich hop\ntích hợp\ntu dong hoa\ntự động hóa\ntự động hóa xóa linear bình luận\nviec can lam\nviệc cần làm\nxoa\nxóa\nxóa linear\nxóa linear bình luận\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "linear\nlinear 评论\n任务\n任务 删除 linear 评论\n删除\n删除 linear\n删除 linear 评论\n定时\n工作流\n工具\n待办\n截止日期\n授权\n提醒\n操作\n监控\n移除\n移除 linear 评论\n自动化\n自动化 删除 linear 评论\n触发器\n评论\n请求\n账号连接\n跟进\n连接器\n连接器 删除 linear 评论\n集成";
                };
            };
        };
        readonly deleteLinearIssue: {
            readonly request: {
                readonly base: "archive\narchive issue\narchive linear issue\narchive_linear_issue\narchive-linear-issue\nautomation delete linear issue\nclose linear issue\nclose_linear_issue\nclose-linear-issue\nconnectors delete linear issue\ndelete\ndelete archive\ndelete linear issue\ndelete_linear_issue\ndelete-linear-issue\nissue\nissue linear\nlinear\nremove linear issue\nremove_linear_issue\nremove-linear-issue\ntasks delete linear issue";
                readonly locales: {
                    readonly es: "accion\narchivar\narchivar incidencia\narchivar linear incidencia\nautomatizacion\nautomatizacion eliminar linear incidencia\nborrar\nconector\nconector eliminar linear incidencia\ncron\ncuenta conectada\ndisparador\neliminar\neliminar archivar\neliminar linear incidencia\nfecha limite\nflujo de trabajo\nherramienta\nincidencia\nincidencia linear\nintegracion\nlinear\nlinear incidencia\nmcp\nmonitor\noauth\npendiente\nquitar\nrecordatorio\nseguimiento\nsolicitud\ntarea\ntarea eliminar linear incidencia\ntareas";
                    readonly ko: "계정 연결\n도구\n리니어\n리니어 이슈\n리마인더\n마감일\n모니터\n보관\n보관 리니어 이슈\n보관 이슈\n삭제\n삭제 리니어 이슈\n삭제 보관\n오어스\n요청\n워크플로\n이슈\n이슈 리니어\n자동화\n자동화 삭제 리니어 이슈\n작업\n작업 삭제 리니어 이슈\n제거\n제거 리니어 이슈\n커넥터\n커넥터 삭제 리니어 이슈\n크론\n통합\n트리거\n할 일\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\napagar\narquivar\narquivar linear problema\narquivar problema\nautomacao\nautomacao excluir linear problema\nconector\nconector excluir linear problema\nconta conectada\ncron\nexcluir\nexcluir arquivar\nexcluir linear problema\nferramenta\nfluxo de trabalho\ngatilho\nintegracao\nissue\nlembrete\nlinear\nlinear problema\nmcp\nmonitor\noauth\nprazo\nproblema\nproblema linear\nremover\nremover linear problema\nsolicitacao\ntarefa\ntarefa excluir linear problema\ntarefas";
                    readonly tl: "account connection\naksyon\nalisin\nalisin linear isyu\nautomation\nautomation burahin linear isyu\nburahin\nburahin i-archive\nburahin linear isyu\nconnector\nconnector burahin linear isyu\ncron\ndeadline\nfollow up\ngawain\ngawain burahin linear isyu\ni-archive\ni-archive isyu\ni-archive linear isyu\nintegration\nisyu\nisyu linear\nkahilingan\nkasangkapan\nlinear\nlinear isyu\nmonitor\noauth\npaalala\ntask\ntodo\ntrigger\nworkflow";
                    readonly vi: "cong cu\ncông cụ\ngo\ngỡ\ngỡ linear vấn đề\nhanh dong\nhành động\nket noi\nkết nối\nkết nối xóa linear vấn đề\nkich hoat\nlinear\nlinear vấn đề\nluu tru\nlưu trữ\nlưu trữ linear vấn đề\nlưu trữ vấn đề\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnhiệm vụ xóa linear vấn đề\noauth\nquy trinh\nquy trình\ntac vu\ntác vụ\ntài khoản\ntich hop\ntích hợp\ntu dong hoa\ntự động hóa\ntự động hóa xóa linear vấn đề\nvan de\nvấn đề\nvấn đề linear\nviec can lam\nviệc cần làm\nxoa\nxóa\nxóa linear vấn đề\nxóa lưu trữ\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "linear\nlinear 问题\n任务\n任务 删除 linear 问题\n删除\n删除 linear 问题\n删除 归档\n定时\n工作流\n工具\n归档\n归档 linear 问题\n归档 问题\n待办\n截止日期\n授权\n提醒\n操作\n监控\n移除\n移除 linear 问题\n自动化\n自动化 删除 linear 问题\n触发器\n请求\n账号连接\n跟进\n连接器\n连接器 删除 linear 问题\n问题\n问题 linear\n集成";
                };
            };
        };
        readonly deleteTodo: {
            readonly request: {
                readonly base: "agent internal delete todo\nagent_internal delete todo\ndelete\ndelete existing\ndelete todo\ndelete_todo\ndiscard todo\ndiscard_todo\nexisting\nexisting todo\nitem\nremove todo\nremove_todo\nsoft\nsoft delete\ntodo\ntodo item\ntodos delete todo";
                readonly locales: {
                    readonly es: "accion\nagente\nagente eliminar todo\nborrar\nborrar tarea\ncompletar tarea\neliminar\neliminar todo\nestado interno\ngestion interna\nherramienta\ninterno del agente\nlista de tareas\npendiente\npendientes\nquitar\nsolicitud\ntarea\ntodo\ntodo eliminar todo";
                    readonly ko: "내부 상태\n도구\n삭제\n삭제 할일\n에이전트\n에이전트 내부\n에이전트 삭제 할일\n요청\n자체 관리\n작업\n작업 목록\n작업 삭제\n작업 완료\n제거\n제거 할일\n할 일\n할일\n할일 삭제 할일\n활성 작업";
                    readonly pt: "acao\nafazer\nafazeres\nagente\nagente excluir todo\napagar\napagar tarefa\nconcluir tarefa\nestado interno\nexcluir\nexcluir todo\nferramenta\ngestao interna\ninterno do agente\nlista de tarefas\nremover\nremover todo\nsolicitacao\ntodo\ntodo excluir todo";
                    readonly tl: "agent\nagent burahin todo\naksyon\nalisin\nalisin todo\nburahin\nburahin task\nburahin todo\ngawain\ninternal ng agent\ninternal state\nkahilingan\nkasangkapan\nkumpletuhin task\nsariling pamamahala\ntask list\ntodo\ntodo burahin todo";
                    readonly vi: "cong cu\ncông cụ\ndanh sách tác vụ\ngo\ngỡ\ngỡ việc cần làm\nhanh dong\nhành động\nhoàn thành tác vụ\nnoi bo tac tu\nnội bộ tác tử\ntac tu\ntác tử\ntác tử xóa việc cần làm\ntu quan ly\ntự quản lý\nviec can lam\nviệc cần làm\nviệc cần làm xóa việc cần làm\nxoa\nxóa\nxóa việc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "代理\n代理 删除 待办\n代理内部\n任务列表\n内部状态\n删除\n删除 待办\n删除任务\n完成任务\n工具\n待办\n待办 删除 待办\n操作\n智能体\n活动任务\n移除\n移除 待办\n自我管理\n请求";
                };
            };
        };
        readonly desktop: {
            readonly request: {
                readonly base: "action\naction file\nautomation desktop\nbrowser desktop\ncode desktop\ncomputer\ncomputer screenshot\ndesktop\ndesktop action\ndesktop_action\ndetect\ndispatches\nelements\nfile\nfile action\nfile window\nfile_action\nfiles desktop\nmanage window\nmanage_window\nmatching\nmatching computer\nreserved\nscreen time desktop\nscreen_time desktop\nscreenshot\nscreenshot detect\nsingle\nsingle desktop\nterminal\nterminal action\nterminal desktop\nterminal dispatches\nterminal_action\nuse desktop\nuse_desktop\nwindow\nwindow terminal";
                readonly locales: {
                    readonly es: "abrir pagina\naccion\naccion archivo\nadministrar\narchivo\narchivo accion\narchivo escritorio\narchivos\nautomatizacion\nautomatizacion escritorio\nbash\ncaptura de pantalla\ncarpeta\ncodigo\ncodigo escritorio\ncomputadora\ncomputadora captura de pantalla\ncron\ndepurar\ndirectorio\ndisparador\nenfoque\nescritorio\nescritorio accion\nflujo de trabajo\ngestionar\nhacer clic\nimplementar\nleer archivo\nlimites de apps\nlinea de comandos\nmonitor\nnavegador\nnavegador escritorio\nordenador\npantalla\npantalla escritorio\nproceso\nprogramacion\nprueba\nrepositorio\nshell\nsitio web\nterminal\nterminal accion\nterminal escritorio\ntiempo de pantalla\nuso del dispositivo";
                    readonly ko: "관리\n구현\n기기 사용\n데스크톱\n데스크톱 작업\n도구\n디렉터리\n디버그\n명령줄\n모니터\n배시\n브라우저\n브라우저 데스크톱\n사용 보고서\n셸\n스크린 타임\n스크린샷\n앱 제한\n워크플로\n웹사이트 입력\n자동화\n자동화 데스크톱\n작업\n작업 파일\n저장소\n집중\n컴퓨터\n컴퓨터 스크린샷\n코드\n코드 데스크톱\n크론\n클릭\n터미널\n터미널 데스크톱\n터미널 작업\n테스트\n트리거\n파일\n파일 데스크톱\n파일 쓰기\n파일 읽기\n파일 작업\n페이지 열기\n폴더\n프로그래밍\n프로세스\n화면\n화면 데스크톱";
                    readonly pt: "abrir pagina\nacao\nacao arquivo\narea de trabalho\narea de trabalho acao\narquivo\narquivo acao\narquivo area de trabalho\narquivos\nautomacao\nautomacao area de trabalho\nbash\ncaptura de tela\nclicar\ncodigo\ncodigo area de trabalho\ncomputador\ncomputador captura de tela\ncron\ndepurar\ndiretorio\nferramenta\nfluxo de trabalho\nfoco\ngatilho\ngerenciar\nimplementar\nler arquivo\nlimites de app\nlinha de comando\nmonitor\nnavegador\nnavegador area de trabalho\npasta\nprocesso\nprogramacao\nrepositorio\nshell\nsite\nsolicitacao\ntela\ntela area de trabalho\ntempo de tela\nterminal\nterminal acao\nterminal area de trabalho\nteste\nuso do dispositivo";
                    readonly tl: "aksyon\naksyon file\napp limits\nautomation\nautomation desktop\nbasahin file\nbash\nbrowser\nbrowser desktop\nbuksan ang pahina\nclick\ncode\ncode desktop\ncommand line\ncomputer\ncomputer screenshot\ncron\ndebug\ndesktop\ndesktop aksyon\ndirectory\nfile\nfile aksyon\nfile desktop\nfiles\nfocus\nfolder\ngamit ng device\nipatupad\nkahilingan\nkasangkapan\nmonitor\npamahalaan\nprocess\nprogramming\nrepo\nscreen\nscreen desktop\nscreen time\nscreenshot\nshell\nterminal\nterminal aksyon\nterminal desktop\ntest\ntrigger\nwebsite\nworkflow";
                    readonly vi: "anh chup man hinh\nảnh chụp màn hình\ncông cụ\ndoc tep\nđọc tệp\ndong lenh\ndòng lệnh\ngiới hạn ứng dụng\nhanh dong\nhành động\nhành động tệp\nkho ma\nkho mã\nkich hoat\nkiểm thử\nlap trinh\nlập trình\nmã máy tính để bàn\nman hinh\nmàn hình\nmàn hình máy tính để bàn\nmay tinh\nmáy tính\nmáy tính ảnh chụp màn hình\nmay tinh de ban\nmáy tính để bàn\nmáy tính để bàn hành động\nmo trang\nmở trang\nquan ly\nquản lý\nquy trinh\nquy trình\ntệp hành động\ntệp máy tính để bàn\nterminal hành động\nterminal máy tính để bàn\nthoi gian man hinh\nthời gian màn hình\nthu muc\nthư mục\ntiến trình\ntrinh duyet\ntrình duyệt\ntrình duyệt máy tính để bàn\ntu dong hoa\ntự động hóa\ntự động hóa máy tính để bàn";
                    readonly "zh-CN": "Bash\n专注\n仓库\n代码\n代码 桌面\n使用报告\n写文件\n命令行\n定时\n实现\n屏幕\n屏幕 桌面\n屏幕时间\n工作流\n工具\n应用限制\n截图\n打开页面\n操作\n操作 文件\n文件\n文件 操作\n文件 桌面\n文件夹\n标准输出\n桌面\n桌面 操作\n测试\n浏览器\n浏览器 桌面\n点击\n电脑\n电脑 截图\n监控\n目录\n管理\n终端\n终端 操作\n终端 桌面\n编程\n网站输入\n自动化\n自动化 桌面\n触发器\n设备使用\n读取文件\n调试\n进程";
                };
            };
        };
        readonly discordSetupCredentials: {
            readonly request: {
                readonly base: "account\naccount pairing\nconnectors discord setup credentials\ncredential\ncredentials\ndiscord\ndiscord add api key\ndiscord add credentials\ndiscord configure service\ndiscord connect\ndiscord connect service\ndiscord pair\ndiscord setup\ndiscord setup credentials\ndiscord setup service\ndiscord_add_api_key\ndiscord_add_credentials\ndiscord_configure_service\ndiscord_connect\ndiscord_connect_service\ndiscord_pair\ndiscord_setup\ndiscord_setup_credentials\ndiscord_setup_service\nguides\nguides user\nmessaging discord setup credentials\npairing\nparty\npossible\npossible stores\nsecurely\nservices\nsetting\nsettings discord setup credentials\nsetup\nsetup account\nstart\nstores\nstores them\nsupported\nthem\nthird\nthrough\nuser\nuser through\nvalidates";
                readonly locales: {
                    readonly es: "accion\nactivar\nagregar\najustes\nanadir\nclave\nconectar\nconector\nconector discord\nconfiguracion\nconfiguracion discord\nconfigurar\ncuenta\ncuenta conectada\ndiscord agregar\ndiscord agregar api clave\ndiscord conectar\ndiscord configurar\nherramienta\nintegracion\nmcp\nmodelo\noauth\npreferencias\nsolicitud\ntecla\ntienda\nusuario";
                    readonly ko: "discord 설정\ndiscord 연결\ndiscord 추가\ndiscord 추가 api 키\n계정\n계정 연결\n구성\n도구\n모델 설정\n사용자\n상점\n설정\n설정 discord\n스토어\n연결\n오어스\n요청\n작업\n추가\n커넥터\n커넥터 discord\n키\n토글\n통합\n환경설정";
                    readonly pt: "acao\nadicionar\nalternar\nchave\nconectar\nconector\nconector discord\nconfiguracao\nconfiguracoes\nconfiguracoes discord\nconfigurar\nconta\nconta conectada\ndiscord adicionar\ndiscord adicionar api chave\ndiscord conectar\ndiscord configurar\nferramenta\nintegracao\nloja\nmcp\nmodelo\noauth\npreferencias\nsolicitacao\ntecla\nusuario";
                    readonly tl: "account\naccount connection\naksyon\nconfiguration\nconnector\nconnector discord\ndiscord i-configure\ndiscord idagdag\ndiscord idagdag api key\ndiscord ikonekta\ngumagamit\ni-configure\nidagdag\nikonekta\nintegration\nkahilingan\nkasangkapan\nkey\nkuwenta\nmodel settings\noauth\npreferences\nsettings\nsettings discord\ntindahan\ntoggle\nuser";
                    readonly vi: "cai dat\ncài đặt\ncài đặt discord\ncau hinh\ncấu hình\ncong cu\ncông cụ\ncua hang\ncửa hàng\ndiscord cấu hình\ndiscord kết nối\ndiscord thêm\ndiscord thêm api khóa\nhanh dong\nhành động\nket noi\nkết nối\nkết nối discord\nkhoa\nkhóa\nnguoi dung\nngười dùng\noauth\nphim\nphím\ntai khoan\ntài khoản\nthem\nthêm\ntich hop\ntích hợp\ntuy chon\ntùy chọn\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "discord 添加\ndiscord 添加 api 键\ndiscord 连接\ndiscord 配置\n偏好\n商店\n密钥\n工具\n开关\n授权\n操作\n模型设置\n添加\n用户\n设置\n设置 discord\n请求\n账号\n账号连接\n账户\n连接\n连接器\n连接器 discord\n配置\n键\n集成";
                };
            };
        };
        readonly document: {
            readonly request: {
                readonly base: "delete\ndelete document\ndelete import\ndelete_document\ndispatches\ndispatches document\ndocument\ndocument operations\ndocuments\ndocuments document\ndocuments select\nedit\nedit delete\nedit document\nedit_document\nfields\nfile\nfile import\nimport\nimport file\nimport url\nimport_file\nimport_url\nlist\nlist documents\nlist search\nlist_documents\nneeded\noperation\noperations\noperations using\nprovide\nread\nread document\nread write\nread_document\nsave document\nsave_document\nsearch\nsearch documents\nsearch read\nsearch_documents\nselect\nstored\nstored documents\nsubaction\nsubaction list\nthat\nthat operation\nusing\nwrite\nwrite edit";
                readonly locales: {
                    readonly es: "accion\narchivo\nborrar\nbuscar\nbuscar documento\nbuscar leer\ndocumento\ndocumento documento\ndocumento operacion\ndocumentos\neditar\neditar documento\neditar eliminar\neliminar\neliminar documento\nescribir\nescribir editar\nguardar notas\nherramienta\nleer\nleer documento\nleer escribir\nlistar\nlistar buscar\nlistar documento\nmostrar\nnotas\noperacion\nsolicitud";
                    readonly ko: "검색\n검색 문서\n검색 읽기\n노트\n도구\n목록\n목록 검색\n목록 문서\n문서\n문서 문서\n문서 작업\n삭제\n삭제 문서\n쓰기\n쓰기 편집\n요청\n읽기\n읽기 문서\n읽기 쓰기\n작업\n저장\n파일\n파일 내용\n편집\n편집 문서\n편집 삭제";
                    readonly pt: "acao\napagar\narquivo\nbuscar\nbuscar documento\nbuscar ler\ndocumento\ndocumento documento\ndocumento operacao\ndocumentos\neditar\neditar documento\neditar excluir\nescrever\nescrever editar\nexcluir\nexcluir documento\nferramenta\nler\nler documento\nler escrever\nlistar\nlistar buscar\nlistar documento\nmostrar\nnotas\noperacao\nsalvar notas\nsolicitacao";
                    readonly tl: "aksyon\nbasahin\nbasahin dokumento\nbasahin isulat\nburahin\nburahin dokumento\ndokumento\ndokumento dokumento\ndokumento operasyon\nfile\ni-edit\ni-edit burahin\ni-edit dokumento\ni-save\nilista\nilista dokumento\nilista maghanap\nisulat\nisulat i-edit\nkahilingan\nkasangkapan\nmaghanap\nmaghanap basahin\nmaghanap dokumento\nnilalaman ng file\nnotes\noperasyon";
                    readonly vi: "chinh sua\nchỉnh sửa\nchỉnh sửa tài liệu\nchỉnh sửa xóa\ncong cu\ncông cụ\ndoc\nđọc\nđọc tài liệu\nđọc viết\nghi chu\nghi chú\nhanh dong\nhành động\nliet ke\nliệt kê\nliệt kê tài liệu\nliệt kê tìm kiếm\nlưu ghi chú\ntai lieu\ntài liệu\ntài liệu tài liệu\ntài liệu thao tác\ntep\ntệp\nthao tac\nthao tác\ntim kiem\ntìm kiếm\ntìm kiếm đọc\ntìm kiếm tài liệu\nviet\nviết\nviết chỉnh sửa\nxoa\nxóa\nxóa tài liệu\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "保存笔记\n写入\n写入 编辑\n列出\n列出 搜索\n列出 文档\n删除\n删除 文档\n工具\n搜索\n搜索 文档\n搜索 读取\n操作\n文件\n文件内容\n文档\n文档 操作\n文档 文档\n笔记\n编辑\n编辑 删除\n编辑 文档\n请求\n读取\n读取 写入\n读取 文档";
                };
            };
        };
        readonly edit: {
            readonly request: {
                readonly base: "automation edit\nbeen\nbeen read\nbehavior\ncannot\ncode edit\ncontent\ncontent cannot\ndefault\ndetected\ndetected secret\nedit\nedit file\nedit_file\nevery\nexact\nexactly\nexisting\nexisting file\nfile\nfile default\nfile must\nfile single\nhave\nintroduce\nmatch\nmodify file\nmodify_file\nmtime\nmtime content\nmultiple\nmust\noccurrence\noccurrence file\nonce\npass\npattern\nread\nread session\nrecorded\nreplace\nrequires\nsecret\nsecret pattern\nsession\nsingle\nstill\nstring\nsubstitute\nterminal edit\ntext\ntext file\ntrue";
                readonly locales: {
                    readonly es: "accion\narchivo\nautomatizacion\nautomatizacion editar\nbash\nclave secreta\ncodigo\ncodigo editar\ncontenido\ncron\ndepurar\ndisparador\neditar\neditar archivo\nflujo de trabajo\nherramienta\nimplementar\nleer\nlinea de comandos\nmonitor\nproceso\nprogramacion\nprueba\nrepositorio\nsecreto\nshell\nsolicitud\nterminal\nterminal editar";
                    readonly ko: "구현\n내용\n도구\n디버그\n명령줄\n모니터\n배시\n비밀\n셸\n시크릿\n요청\n워크플로\n읽기\n자동화\n자동화 편집\n작업\n저장소\n코드\n코드 편집\n콘텐츠\n크론\n터미널\n터미널 편집\n테스트\n트리거\n파일\n편집\n편집 파일\n프로그래밍\n프로세스";
                    readonly pt: "acao\narquivo\nautomacao\nautomacao editar\nbash\ncodigo\ncodigo editar\nconteudo\ncron\ndepurar\neditar\neditar arquivo\nferramenta\nfluxo de trabalho\ngatilho\nimplementar\nler\nlinha de comando\nmonitor\nprocesso\nprogramacao\nrepositorio\nsegredo\nshell\nsolicitacao\nterminal\nterminal editar\nteste";
                    readonly tl: "aksyon\nautomation\nautomation i-edit\nbasahin\nbash\ncode\ncode i-edit\ncommand line\ncron\ndebug\nfile\ni-edit\ni-edit file\nipatupad\nkahilingan\nkasangkapan\nmonitor\nnilalaman\nprocess\nprogramming\nrepo\nsecret\nshell\nterminal\nterminal i-edit\ntest\ntrigger\nworkflow";
                    readonly vi: "bash\nbi mat\nbí mật\nchinh sua\nchỉnh sửa\nchỉnh sửa tệp\ncong cu\ncông cụ\ndoc\nđọc\ndong lenh\ndòng lệnh\nhanh dong\nhành động\nkho ma\nkho mã\nkich hoat\nkiểm thử\nlap trinh\nlập trình\nma\nmã\nmã chỉnh sửa\nnoi dung\nnội dung\nquy trinh\nquy trình\nshell\ntep\ntệp\nterminal\nterminal chỉnh sửa\ntiến trình\ntu dong hoa\ntự động hóa\ntự động hóa chỉnh sửa\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "Bash\n仓库\n代码\n代码 编辑\n内容\n命令行\n定时\n实现\n密钥\n工作流\n工具\n操作\n文件\n标准输出\n测试\n监控\n秘密\n终端\n终端 编辑\n编程\n编辑\n编辑 文件\n自动化\n自动化 编辑\n触发器\n请求\n读取\n调试\n进程";
                };
            };
        };
        readonly editTodo: {
            readonly request: {
                readonly base: "agent internal edit todo\nagent_internal edit todo\nchange todo\nchange_todo\ndate\ndate status\nedit\nedit existing\nedit todo\nedit_todo\nexisting\nexisting todo\nitem\nmodify todo\nmodify_todo\nnotes\nstatus\ntitle\ntodo\ntodo item\ntodos edit todo\nupdate todo\nupdate_todo\nupdating";
                readonly locales: {
                    readonly es: "accion\nactualizar\nactualizar todo\nagente\nagente editar todo\nborrar tarea\ncompletar tarea\neditar\neditar todo\nestado\nestado interno\ngestion interna\nherramienta\ninterno del agente\nlista de tareas\npendiente\npendientes\nsolicitud\ntarea\ntodo\ntodo editar todo";
                    readonly ko: "내부 상태\n도구\n상태\n업데이트\n업데이트 할일\n에이전트\n에이전트 내부\n에이전트 편집 할일\n요청\n자체 관리\n작업\n작업 목록\n작업 삭제\n작업 완료\n편집\n편집 할일\n할 일\n할일\n할일 편집 할일\n활성 작업";
                    readonly pt: "acao\nafazer\nafazeres\nagente\nagente editar todo\napagar tarefa\natualizar\natualizar todo\nconcluir tarefa\neditar\neditar todo\nestado\nestado interno\nferramenta\ngestao interna\ninterno do agente\nlista de tarefas\nsolicitacao\nstatus\ntodo\ntodo editar todo";
                    readonly tl: "agent\nagent i-edit todo\naksyon\nburahin task\ngawain\ni-edit\ni-edit todo\ni-update\ni-update todo\ninternal ng agent\ninternal state\nkahilingan\nkasangkapan\nkumpletuhin task\nsariling pamamahala\nstatus\ntask list\ntodo\ntodo i-edit todo";
                    readonly vi: "cap nhat\ncập nhật\ncập nhật việc cần làm\nchinh sua\nchỉnh sửa\nchỉnh sửa việc cần làm\ncong cu\ncông cụ\ndanh sách tác vụ\nhanh dong\nhành động\nhoàn thành tác vụ\nnoi bo tac tu\nnội bộ tác tử\ntac tu\ntác tử\ntác tử chỉnh sửa việc cần làm\ntrang thai\ntrạng thái\ntu quan ly\ntự quản lý\nviec can lam\nviệc cần làm\nviệc cần làm chỉnh sửa việc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "代理\n代理 编辑 待办\n代理内部\n任务列表\n内部状态\n删除任务\n完成任务\n工具\n待办\n待办 编辑 待办\n操作\n智能体\n更新\n更新 待办\n活动任务\n状态\n编辑\n编辑 待办\n自我管理\n请求";
                };
            };
        };
        readonly enterWorktree: {
            readonly request: {
                readonly base: "add worktree\nadd_worktree\nautomation enter worktree\nbecomes\nbranch\ncheckout\ncode enter worktree\ncreate\ncreate switch\ncreate worktree\ndisturbing\nenter worktree\nenter_worktree\nexit\nfile\nfile operations\ngit worktree add\ngit_worktree_add\nisolate\nland\nmain\nopen worktree\nopen_worktree\noperations\noperations land\nparallel\npath\npops\nrepo\nroot\nsandbox\nsession\nsubsequent\nsubsequent file\nswitch\nterminal enter worktree\nthere\nuntil\nwithout\nwork\nworktree";
                readonly locales: {
                    readonly es: "abrir\naccion\nagregar\nanadir\narchivo\narchivo operacion\nautomatizacion\nbash\ncodigo\ncrear\ncron\ndepurar\ndisparador\nflujo de trabajo\nherramienta\nimplementar\nlinea de comandos\nmonitor\noperacion\nproceso\nprogramacion\nprueba\nrepositorio\nshell\nsolicitud\nterminal";
                    readonly ko: "구현\n도구\n디버그\n명령줄\n모니터\n배시\n생성\n셸\n열기\n요청\n워크플로\n자동화\n작업\n저장소\n추가\n코드\n크론\n터미널\n테스트\n트리거\n파일\n파일 작업\n프로그래밍\n프로세스";
                    readonly pt: "abrir\nacao\nadicionar\narquivo\narquivo operacao\nautomacao\nbash\ncodigo\ncriar\ncron\ndepurar\nferramenta\nfluxo de trabalho\ngatilho\nimplementar\nlinha de comando\nmonitor\noperacao\nprocesso\nprogramacao\nrepositorio\nshell\nsolicitacao\nterminal\nteste";
                    readonly tl: "aksyon\nautomation\nbash\nbuksan\ncode\ncommand line\ncron\ndebug\nfile\nfile operasyon\ngumawa\nidagdag\nipatupad\nkahilingan\nkasangkapan\nmonitor\noperasyon\nprocess\nprogramming\nrepo\nshell\nterminal\ntest\ntrigger\nworkflow";
                    readonly vi: "bash\ncong cu\ncông cụ\ndong lenh\ndòng lệnh\nhanh dong\nhành động\nkho ma\nkho mã\nkich hoat\nkiểm thử\nlap trinh\nlập trình\nma\nmã\nmo\nmở\nquy trinh\nquy trình\nshell\ntao\ntạo\ntep\ntệp\ntệp thao tác\nterminal\nthao tac\nthao tác\nthem\nthêm\ntiến trình\ntu dong hoa\ntự động hóa\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "Bash\n仓库\n代码\n创建\n命令行\n定时\n实现\n工作流\n工具\n打开\n操作\n文件\n文件 操作\n标准输出\n测试\n添加\n监控\n终端\n编程\n自动化\n触发器\n请求\n调试\n进程";
                };
            };
        };
        readonly evaluateTrust: {
            readonly request: {
                readonly base: "admin evaluate trust\nagent internal evaluate trust\nagent_internal evaluate trust\ncheck reputation\ncheck trust score\ncheck_reputation\ncheck_trust_score\nentity\nevaluate trust\nevaluate_trust\nevaluates\nevaluates trust\nprofile\nprofile specified\nscore\nscore profile\nsettings evaluate trust\nshow trust details\nshow trust level\nshow_trust_details\nshow_trust_level\nspecified\ntrust\ntrust assessment\ntrust profile\ntrust rating\ntrust score\ntrust_assessment\ntrust_profile\ntrust_rating";
                readonly locales: {
                    readonly es: "accion\nactivar\nadministrador\nadministrador confianza\nagente\nagente confianza\najustes\ncomprobar\nconfianza\nconfianza detalles\nconfianza perfil\nconfiguracion\nconfiguracion confianza\ndetalles\ndueño\nestado interno\ngestion interna\nherramienta\ninterno del agente\nmodelo\nperfil\npermisos\npolitica\npreferencias\nrevisar\nrevisar confianza\nroles\nsolicitud";
                    readonly ko: "관리자\n관리자 신뢰\n구성\n권한\n내부 상태\n도구\n모델 설정\n설정\n설정 신뢰\n세부정보\n소유자\n신뢰\n신뢰 세부정보\n신뢰 프로필\n에이전트\n에이전트 내부\n에이전트 신뢰\n역할\n요청\n자체 관리\n작업\n정책\n토글\n프로필\n확인\n확인 신뢰\n환경설정";
                    readonly pt: "acao\nadministrador\nadministrador confianca\nagente\nagente confianca\nalternar\nconfianca\nconfianca detalhes\nconfianca perfil\nconfiguracao\nconfiguracoes\nconfiguracoes confianca\ndetalhes\ndono\nestado interno\nferramenta\nfuncoes\ngestao interna\ninterno do agente\nmodelo\nperfil\npermissoes\npolitica\npreferencias\nsolicitacao\nverificar\nverificar confianca";
                    readonly tl: "admin\nadmin tiwala\nagent\nagent tiwala\naksyon\nconfiguration\ndetalye\ninternal ng agent\ninternal state\nkahilingan\nkasangkapan\nmay ari\nmodel settings\npahintulot\npatakaran\npreferences\nprofile\nrole\nsariling pamamahala\nsettings\nsettings tiwala\nsuriin\nsuriin tiwala\ntiwala\ntiwala detalye\ntiwala profile\ntoggle";
                    readonly vi: "cai dat\ncài đặt\ncài đặt tin cậy\ncấu hình\nchi tiet\nchi tiết\nchu so huu\nchủ sở hữu\ncong cu\ncông cụ\nhanh dong\nhành động\nho so\nhồ sơ\nkiem tra\nkiểm tra\nkiểm tra tin cậy\nnoi bo tac tu\nnội bộ tác tử\nquan tri\nquản trị\nquản trị tin cậy\nquyen\nquyền\ntac tu\ntác tử\ntác tử tin cậy\ntin cay\ntin cậy\ntin cậy chi tiết\ntin cậy hồ sơ\ntu quan ly\ntự quản lý\ntuy chon\ntùy chọn\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "代理\n代理 信任\n代理内部\n信任\n信任 详情\n信任 资料\n偏好\n内部状态\n工具\n开关\n所有者\n操作\n智能体\n权限\n检查\n检查 信任\n模型设置\n策略\n管理员\n管理员 信任\n自我管理\n角色\n设置\n设置 信任\n详情\n请求\n资料\n配置";
                };
            };
        };
        readonly exitWorktree: {
            readonly request: {
                readonly base: "added\nautomation exit worktree\ncleanup\ncode exit worktree\ndelete\ndelete worktree\ndirectory\ndrop\nenter\nexit\nexit worktree\nexit_worktree\nforce\nforce delete\ngit worktree remove\ngit_worktree_remove\nleave worktree\nleave_worktree\nmost\noptionally\npop worktree\npop_worktree\nprevious\nrecent\nremove\nremove force\nrestore\nroot\nrun\nrun worktree\nsandbox\nsession\nterminal exit worktree\ntrue\ntrue run\nworktree\nworktree remove";
                readonly locales: {
                    readonly es: "accion\nautomatizacion\nbash\nborrar\ncodigo\ncron\ndepurar\ndisparador\nejecutar\neliminar\nflujo de trabajo\nherramienta\nimplementar\nlinea de comandos\nmonitor\nproceso\nprogramacion\nprueba\nquitar\nrepositorio\nshell\nsolicitud\nterminal";
                    readonly ko: "구현\n도구\n디버그\n명령줄\n모니터\n배시\n삭제\n셸\n실행\n요청\n워크플로\n자동화\n작업\n저장소\n제거\n코드\n크론\n터미널\n테스트\n트리거\n프로그래밍\n프로세스";
                    readonly pt: "acao\napagar\nautomacao\nbash\ncodigo\ncron\ndepurar\nexcluir\nexecutar\nferramenta\nfluxo de trabalho\ngatilho\nimplementar\nlinha de comando\nmonitor\nprocesso\nprogramacao\nremover\nrepositorio\nshell\nsolicitacao\nterminal\nteste";
                    readonly tl: "aksyon\nalisin\nautomation\nbash\nburahin\ncode\ncommand line\ncron\ndebug\nipatupad\nkahilingan\nkasangkapan\nmonitor\npatakbuhin\nprocess\nprogramming\nrepo\nshell\nterminal\ntest\ntrigger\nworkflow";
                    readonly vi: "bash\nchay\nchạy\ncong cu\ncông cụ\ndong lenh\ndòng lệnh\ngo\ngỡ\nhanh dong\nhành động\nkho ma\nkho mã\nkich hoat\nkiểm thử\nlap trinh\nlập trình\nma\nmã\nquy trinh\nquy trình\nshell\nterminal\ntiến trình\ntu dong hoa\ntự động hóa\nxoa\nxóa\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "Bash\n仓库\n代码\n删除\n命令行\n定时\n实现\n工作流\n工具\n操作\n标准输出\n测试\n监控\n移除\n终端\n编程\n自动化\n触发器\n请求\n调试\n运行\n进程";
                };
            };
        };
        readonly extractPage: {
            readonly request: {
                readonly base: "browser extract page\nclean\ncleaned\ncloud\ncontent\ncontent through\ndata\ndata page\ndocuments extract page\neliza\nextract\nextract page\nextract web page\nextract_page\nextract_web_page\nfetch page\nfetch_page\nhost\nhost tool\nhosted\nhosted tools\nhtml\nlink\nlink screenshot\nlinks\nlinks screenshot\nmarkdown\nmetadata\noptional\npage\npage content\npage metadata\nplus\nread web page\nread_web_page\nreturn\nreturns\nscrape page\nscrape_page\nscreenshot\nscreenshot data\nthrough\ntool\ntool return\ntools\ntools returns\nweb extract page";
                readonly locales: {
                    readonly es: "abrir pagina\nabrir url\naccion\narchivo\nbuscar web\ncaptura de pantalla\ncontenido\ndocumento\ndocumento extraer pagina\ndocumentos\nextraer\nextraer pagina\nextraer web pagina\nguardar notas\nhacer clic\nherramienta\ninformacion actual\ninternet\nleer\nleer web pagina\nnavegador\nnavegador extraer pagina\nnotas\npagina\npagina contenido\nsitio web\nsolicitud\nultimo\nweb\nweb extraer pagina";
                    readonly ko: "url 열기\n내용\n노트\n도구\n문서\n문서 추출 페이지\n브라우저\n브라우저 추출 페이지\n스크린샷\n요청\n웹\n웹 검색\n웹 추출 페이지\n웹사이트 입력\n인터넷\n읽기\n읽기 웹 페이지\n작업\n저장\n최신\n최신 정보\n추출\n추출 웹 페이지\n추출 페이지\n콘텐츠\n클릭\n파일 내용\n페이지\n페이지 열기\n페이지 콘텐츠";
                    readonly pt: "abrir pagina\nabrir url\nacao\narquivo\nbuscar na web\ncaptura de tela\nclicar\nconteudo\ndocumento\ndocumento extrair pagina\ndocumentos\nextrair\nextrair pagina\nextrair web pagina\nferramenta\ninformacao atual\ninternet\nler\nler web pagina\nnavegador\nnavegador extrair pagina\nnotas\npagina\npagina conteudo\nsalvar notas\nsite\nsolicitacao\nweb\nweb extrair pagina";
                    readonly tl: "aksyon\nbasahin\nbasahin web pahina\nbrowser\nbrowser kunin pahina\nbuksan ang pahina\nclick\ndokumento\ndokumento kunin pahina\ni-save\ninternet\nkahilingan\nkasalukuyang impormasyon\nkasangkapan\nkunin\nkunin pahina\nkunin web pahina\nnilalaman\nnilalaman ng file\nnotes\nopen url\npahina\npahina nilalaman\nscreenshot\nsearch web\ntool\nweb\nweb kunin pahina\nwebsite";
                    readonly vi: "anh chup man hinh\nảnh chụp màn hình\ncong cu\ncông cụ\ndoc\nđọc\nđọc web trang\nghi chu\nghi chú\nhanh dong\nhành động\ninternet\nlưu ghi chú\nmo trang\nmở trang\nnhấp\nnoi dung\nnội dung\ntai lieu\ntài liệu\ntài liệu trích xuất trang\nthong tin hien tai\nthông tin hiện tại\ntìm web\ntrang\ntrang nội dung\ntrich xuat\ntrích xuất\ntrích xuất trang\ntrích xuất web trang\ntrinh duyet\ntrình duyệt\ntrình duyệt trích xuất trang\nweb\nweb trích xuất trang\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "互联网\n保存笔记\n内容\n最新信息\n工具\n截图\n打开网址\n打开页面\n提取\n提取 网页 页面\n提取 页面\n操作\n文件内容\n文档\n文档 提取 页面\n浏览器\n浏览器 提取 页面\n点击\n笔记\n网站输入\n网络\n网页\n网页 提取 页面\n网页搜索\n请求\n读取\n读取 网页 页面\n页面\n页面 内容";
                };
            };
        };
        readonly file: {
            readonly request: {
                readonly base: "absolute\nautomation file\ncode file\nedit\nedit absolute\nedit file\nedit_file\nfile\nfile io\nfile operation\nfile read\nfile_io\nfile_operation\npath\nread\nread file\nread write\nread_file\nterminal file\nwrite\nwrite edit\nwrite file\nwrite_file";
                readonly locales: {
                    readonly es: "accion\narchivo\narchivo leer\narchivo operacion\nautomatizacion\nautomatizacion archivo\nbash\ncodigo\ncodigo archivo\ncron\ndepurar\ndisparador\neditar\neditar archivo\nescribir\nescribir archivo\nescribir editar\nflujo de trabajo\nherramienta\nimplementar\nleer\nleer archivo\nleer escribir\nlinea de comandos\nmonitor\noperacion\nproceso\nprogramacion\nprueba\nrepositorio\nshell\nsolicitud\nterminal\nterminal archivo";
                    readonly ko: "구현\n도구\n디버그\n명령줄\n모니터\n배시\n셸\n쓰기\n쓰기 파일\n쓰기 편집\n요청\n워크플로\n읽기\n읽기 쓰기\n읽기 파일\n자동화\n자동화 파일\n작업\n저장소\n코드\n코드 파일\n크론\n터미널\n터미널 파일\n테스트\n트리거\n파일\n파일 읽기\n파일 작업\n편집\n편집 파일\n프로그래밍\n프로세스";
                    readonly pt: "acao\narquivo\narquivo ler\narquivo operacao\nautomacao\nautomacao arquivo\nbash\ncodigo\ncodigo arquivo\ncron\ndepurar\neditar\neditar arquivo\nescrever\nescrever arquivo\nescrever editar\nferramenta\nfluxo de trabalho\ngatilho\nimplementar\nler\nler arquivo\nler escrever\nlinha de comando\nmonitor\noperacao\nprocesso\nprogramacao\nrepositorio\nshell\nsolicitacao\nterminal\nterminal arquivo\nteste";
                    readonly tl: "aksyon\nautomation\nautomation file\nbasahin\nbasahin file\nbasahin isulat\nbash\ncode\ncode file\ncommand line\ncron\ndebug\nfile\nfile basahin\nfile operasyon\ni-edit\ni-edit file\nipatupad\nisulat\nisulat file\nisulat i-edit\nkahilingan\nkasangkapan\nmonitor\noperasyon\nprocess\nprogramming\nrepo\nshell\nterminal\nterminal file\ntest\ntrigger\nworkflow";
                    readonly vi: "bash\nchinh sua\nchỉnh sửa\nchỉnh sửa tệp\ncong cu\ncông cụ\ndoc\nđọc\nđọc tệp\nđọc viết\ndong lenh\ndòng lệnh\nhanh dong\nhành động\nkho ma\nkho mã\nkich hoat\nkiểm thử\nlap trinh\nlập trình\nma\nmã\nmã tệp\nquy trinh\nquy trình\nshell\ntep\ntệp\ntệp đọc\ntệp thao tác\nterminal\nterminal tệp\nthao tac\nthao tác\ntiến trình\ntu dong hoa\ntự động hóa\ntự động hóa tệp\nviet\nviết\nviết chỉnh sửa\nviết tệp\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "Bash\n仓库\n代码\n代码 文件\n写入\n写入 文件\n写入 编辑\n命令行\n定时\n实现\n工作流\n工具\n操作\n文件\n文件 操作\n文件 读取\n标准输出\n测试\n监控\n终端\n终端 文件\n编程\n编辑\n编辑 文件\n自动化\n自动化 文件\n触发器\n请求\n读取\n读取 写入\n读取 文件\n调试\n进程";
                };
            };
        };
        readonly finish: {
            readonly request: {
                readonly base: "finish";
                readonly locales: {
                    readonly es: "accion\nfinalizar\nherramienta\nsolicitud";
                    readonly ko: "도구\n완료\n요청\n작업";
                    readonly pt: "acao\nferramenta\nfinalizar\nsolicitacao";
                    readonly tl: "aksyon\nkahilingan\nkasangkapan\ntapusin";
                    readonly vi: "cong cu\ncông cụ\nhanh dong\nhành động\nket thuc\nkết thúc\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "工具\n操作\n结束\n请求";
                };
            };
        };
        readonly formEvaluator: {
            readonly request: {
                readonly base: "extracts\nextracts form\nfields\nfields handles\nform\nform evaluator\nform extraction\nform handler\nform_evaluator\nform_extraction\nform_handler\nhandles\nhandles form\nintents\nintents user\nmessages\nuser\nuser messages";
                readonly locales: {
                    readonly es: "accion\nextraer\nherramienta\nmanejar\nmensaje\nsolicitud\nusuario\nusuario mensaje";
                    readonly ko: "도구\n메시지\n사용자\n사용자 메시지\n요청\n작업\n처리\n추출";
                    readonly pt: "acao\nextrair\nferramenta\nlidar\nmensagem\nsolicitacao\nusuario\nusuario mensagem";
                    readonly tl: "aksyon\ngumagamit\nhawakan\nkahilingan\nkasangkapan\nkunin\nmensahe\nuser\nuser mensahe";
                    readonly vi: "cong cu\ncông cụ\nhanh dong\nhành động\nnguoi dung\nngười dùng\nngười dùng tin nhắn\ntin nhan\ntin nhắn\ntrich xuat\ntrích xuất\nxu ly\nxử lý\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "处理\n工具\n提取\n操作\n消息\n用户\n用户 消息\n请求";
                };
            };
        };
        readonly formRestore: {
            readonly request: {
                readonly base: "automation form restore\ncontinue form\ncontinue_form\nform\nform restore\nform_restore\nmemory form restore\npreviously\nrestore\nresume form\nresume_form\nsession\nstashed\ntasks form restore";
                readonly locales: {
                    readonly es: "accion\nautomatizacion\ncron\ndisparador\nfecha limite\nflujo de trabajo\nguardar memoria\nherramienta\nmemoria\nmonitor\npendiente\nrecordar\nrecordatorio\nrecuerdo\nseguimiento\nsolicitud\ntarea\ntareas";
                    readonly ko: "기억\n기억해\n도구\n리마인더\n마감일\n모니터\n요청\n워크플로\n자동화\n작업\n장기 기억\n크론\n트리거\n할 일\n회상\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\nautomacao\ncron\nferramenta\nfluxo de trabalho\ngatilho\nlembrar\nlembrete\nmemoria\nmonitor\nprazo\nrecordar\nsalvar memoria\nsolicitacao\ntarefa\ntarefas";
                    readonly tl: "aksyon\nalaala\nalalahanin\nautomation\ncron\ndeadline\nfollow up\ngawain\nkahilingan\nkasangkapan\nlong term memory\nmemory\nmonitor\npaalala\ntandaan\ntask\ntodo\ntrigger\nworkflow";
                    readonly vi: "cong cu\ncông cụ\nghi nho\nghi nhớ\nhanh dong\nhành động\nkich hoat\nky uc\nký ức\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnho\nnhớ\nquy trinh\nquy trình\ntac vu\ntác vụ\ntu dong hoa\ntự động hóa\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "任务\n回忆\n定时\n工作流\n工具\n待办\n截止日期\n提醒\n操作\n监控\n自动化\n触发器\n记住\n记忆\n请求\n跟进\n长期记忆";
                };
            };
        };
        readonly getLinearActivity: {
            readonly request: {
                readonly base: "activity\nactivity optional\nautomation get linear activity\ncheck linear activity\ncheck_linear_activity\ncheck-linear-activity\nconnectors get linear activity\nfilter\nfilters\nget\nget linear activity\nget recent\nget_linear_activity\nget-linear-activity\nlinear\nlinear activity\noptional\nrecent\nrecent linear\nshow linear activity\nshow_linear_activity\nshow-linear-activity\ntasks get linear activity\nview linear activity\nview_linear_activity\nview-linear-activity";
                readonly locales: {
                    readonly es: "accion\nactividad\nautomatizacion\nautomatizacion obtener linear actividad\ncomprobar\nconector\nconector obtener linear actividad\ncron\ncuenta conectada\ndisparador\nfecha limite\nflujo de trabajo\nherramienta\nintegracion\nlinear\nlinear actividad\nmcp\nmonitor\noauth\nobtener\nobtener linear actividad\npendiente\nrecordatorio\nrevisar\nrevisar linear actividad\nseguimiento\nsolicitud\ntarea\ntarea obtener linear actividad\ntareas";
                    readonly ko: "가져오기\n가져오기 리니어 활동\n계정 연결\n도구\n리니어\n리니어 활동\n리마인더\n마감일\n모니터\n오어스\n요청\n워크플로\n자동화\n자동화 가져오기 리니어 활동\n작업\n작업 가져오기 리니어 활동\n커넥터\n커넥터 가져오기 리니어 활동\n크론\n통합\n트리거\n할 일\n확인\n확인 리니어 활동\n활동\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\natividade\nautomacao\nautomacao obter linear atividade\nconector\nconector obter linear atividade\nconta conectada\ncron\nferramenta\nfluxo de trabalho\ngatilho\nintegracao\nlembrete\nlinear\nlinear atividade\nmcp\nmonitor\noauth\nobter\nobter linear atividade\nprazo\nsolicitacao\ntarefa\ntarefa obter linear atividade\ntarefas\nverificar\nverificar linear atividade";
                    readonly tl: "account connection\naksyon\naktibidad\nautomation\nautomation kunin linear aktibidad\nconnector\nconnector kunin linear aktibidad\ncron\ndeadline\nfollow up\ngawain\ngawain kunin linear aktibidad\nintegration\nkahilingan\nkasangkapan\nkunin\nkunin linear aktibidad\nlinear\nlinear aktibidad\nmonitor\noauth\npaalala\nsuriin\nsuriin linear aktibidad\ntask\ntodo\ntrigger\nworkflow";
                    readonly vi: "cong cu\ncông cụ\nhanh dong\nhành động\nhoat dong\nhoạt động\nket noi\nkết nối\nkết nối lấy linear hoạt động\nkich hoat\nkiem tra\nkiểm tra\nkiểm tra linear hoạt động\nlay\nlấy\nlấy linear hoạt động\nlinear\nlinear hoạt động\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnhiệm vụ lấy linear hoạt động\noauth\nquy trinh\nquy trình\ntac vu\ntác vụ\ntài khoản\ntich hop\ntích hợp\ntu dong hoa\ntự động hóa\ntự động hóa lấy linear hoạt động\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "linear\nlinear 活动\n任务\n任务 获取 linear 活动\n定时\n工作流\n工具\n待办\n截止日期\n授权\n提醒\n操作\n检查\n检查 linear 活动\n活动\n监控\n自动化\n自动化 获取 linear 活动\n获取\n获取 linear 活动\n触发器\n请求\n账号连接\n跟进\n连接器\n连接器 获取 linear 活动\n集成";
                };
            };
        };
        readonly getLinearIssue: {
            readonly request: {
                readonly base: "check linear issue\ncheck_linear_issue\ncheck-linear-issue\nconnectors get linear issue\ndetail\ndetails\ndetails specific\nfind linear issue\nfind_linear_issue\nfind-linear-issue\nget\nget detail\nget details\nget linear issue\nget_linear_issue\nget-linear-issue\nissue\nknowledge get linear issue\nlinear\nlinear issue\nshow linear issue\nshow_linear_issue\nshow-linear-issue\nspecific\nspecific linear\ntasks get linear issue\nview linear issue\nview_linear_issue\nview-linear-issue";
                readonly locales: {
                    readonly es: "accion\nbuscar\nbuscar linear incidencia\ncomprobar\nconector\nconector obtener linear incidencia\nconocimiento\nconocimiento obtener linear incidencia\ncuenta conectada\ndetalles\nencontrar\nfecha limite\nhechos guardados\nherramienta\nincidencia\nintegracion\nlinear\nlinear incidencia\nmcp\nnotas guardadas\noauth\nobtener\nobtener detalles\nobtener linear incidencia\npendiente\nrecordar\nrecordatorio\nrevisar\nrevisar linear incidencia\nseguimiento\nsolicitud\ntarea\ntarea obtener linear incidencia\ntareas";
                    readonly ko: "가져오기\n가져오기 리니어 이슈\n가져오기 세부정보\n검색\n계정 연결\n도구\n리니어\n리니어 이슈\n리마인더\n마감일\n세부정보\n오어스\n요청\n이슈\n작업\n작업 가져오기 리니어 이슈\n저장된 노트\n저장된 사실\n지식\n지식 가져오기 리니어 이슈\n찾기\n찾기 리니어 이슈\n커넥터\n커넥터 가져오기 리니어 이슈\n통합\n할 일\n확인\n확인 리니어 이슈\n회상\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\nbuscar\nconector\nconector obter linear problema\nconhecimento\nconhecimento obter linear problema\nconta conectada\ndetalhes\nencontrar\nencontrar linear problema\nfatos salvos\nferramenta\nintegracao\nissue\nlembrar\nlembrete\nlinear\nlinear problema\nmcp\nnotas salvas\noauth\nobter\nobter detalhes\nobter linear problema\nprazo\nproblema\nsolicitacao\ntarefa\ntarefa obter linear problema\ntarefas\nverificar\nverificar linear problema";
                    readonly tl: "account connection\naksyon\nalalahanin\nconnector\nconnector kunin linear isyu\ndeadline\ndetalye\nfollow up\ngawain\ngawain kunin linear isyu\nhanapin\nhanapin linear isyu\nintegration\nisyu\nkaalaman\nkaalaman kunin linear isyu\nkahilingan\nkasangkapan\nkunin\nkunin detalye\nkunin linear isyu\nlinear\nlinear isyu\noauth\npaalala\nsaved facts\nsaved notes\nsuriin\nsuriin linear isyu\ntask\ntodo";
                    readonly vi: "chi tiet\nchi tiết\ncong cu\ncông cụ\nghi chu da luu\nghi chú đã lưu\nhanh dong\nhành động\nket noi\nkết nối\nkết nối lấy linear vấn đề\nkiem tra\nkiểm tra\nkiểm tra linear vấn đề\nkien thuc\nkiến thức\nkiến thức lấy linear vấn đề\nlay\nlấy\nlấy chi tiết\nlấy linear vấn đề\nlinear\nlinear vấn đề\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnhiệm vụ lấy linear vấn đề\nnhớ lại\noauth\ntac vu\ntác vụ\ntài khoản\ntich hop\ntích hợp\ntim\ntìm\ntìm linear vấn đề\nvan de\nvấn đề\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "linear\nlinear 问题\n任务\n任务 获取 linear 问题\n回忆\n工具\n已保存事实\n已保存笔记\n待办\n截止日期\n授权\n提醒\n操作\n查找\n查找 linear 问题\n检查\n检查 linear 问题\n知识\n知识 获取 linear 问题\n获取\n获取 linear 问题\n获取 详情\n详情\n语义搜索\n请求\n账号连接\n跟进\n连接器\n连接器 获取 linear 问题\n问题\n集成";
                };
            };
        };
        readonly glob: {
            readonly request: {
                readonly base: "absolute\nautomation glob\nbash\nbash file\nbuild\ncode glob\ndependency\ndescending\ndirectories\ndiscovery\nexcludes\nfile\nfile discovery\nfiles\nfiles glob\nfiles matching\nfind\nfind files\nfind_files\nglob\ninstead\ninstead bash\nmatching\nmtime\npaths\npattern\nreturns\nsorted\nterminal glob";
                readonly locales: {
                    readonly es: "accion\narchivo\nautomatizacion\nbash\nbash archivo\nbuscar\nbuscar archivo\ncodigo\ncron\ndepurar\ndisparador\nencontrar\nflujo de trabajo\nherramienta\nimplementar\nlinea de comandos\nmonitor\nproceso\nprogramacion\nprueba\nrepositorio\nshell\nsolicitud\nterminal";
                    readonly ko: "구현\n도구\n디버그\n명령줄\n모니터\n배시\n배시 파일\n셸\n요청\n워크플로\n자동화\n작업\n저장소\n찾기\n찾기 파일\n코드\n크론\n터미널\n테스트\n트리거\n파일\n프로그래밍\n프로세스";
                    readonly pt: "acao\narquivo\nautomacao\nbash\nbash arquivo\nbuscar\ncodigo\ncron\ndepurar\nencontrar\nencontrar arquivo\nferramenta\nfluxo de trabalho\ngatilho\nimplementar\nlinha de comando\nmonitor\nprocesso\nprogramacao\nrepositorio\nshell\nsolicitacao\nterminal\nteste";
                    readonly tl: "aksyon\nautomation\nbash\nbash file\ncode\ncommand line\ncron\ndebug\nfile\nhanapin\nhanapin file\nipatupad\nkahilingan\nkasangkapan\nmonitor\nprocess\nprogramming\nrepo\nshell\nterminal\ntest\ntrigger\nworkflow";
                    readonly vi: "bash\nbash tệp\ncong cu\ncông cụ\ndong lenh\ndòng lệnh\nhanh dong\nhành động\nkho ma\nkho mã\nkich hoat\nkiểm thử\nlap trinh\nlập trình\nma\nmã\nquy trinh\nquy trình\nshell\ntep\ntệp\nterminal\ntiến trình\ntim\ntìm\ntìm tệp\ntu dong hoa\ntự động hóa\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "Bash\nbash 文件\n仓库\n代码\n命令行\n定时\n实现\n工作流\n工具\n操作\n文件\n查找\n查找 文件\n标准输出\n测试\n监控\n终端\n编程\n自动化\n触发器\n请求\n调试\n进程";
                };
            };
        };
        readonly googleCalendar: {
            readonly request: {
                readonly base: "book time block\nbook_time_block\ncalendar\ncalendar action\ncalendar create event\ncalendar feed\ncalendar google calendar\ncalendar life\ncalendar next event\ncalendar read\ncalendar search events\ncalendar_action\ncalendar_create_event\ncalendar_feed\ncalendar_next_event\ncalendar_read\ncalendar_search_events\ncheck calendar\ncheck schedule\ncheck_calendar\ncheck_schedule\ncontacts google calendar\ncreate\ncreate calendar event\ncreate events\ncreate_calendar_event\nemail\nemail habits\nevents\nevents create\nevents query\ngoogle\ngoogle calendar\ngoogle_calendar\nhabits\nitinerary\nlife\nnext meeting\nnext_meeting\nquery\nquery travel\nrebook travel\nrebook_travel\nrecurring time block\nrecurring_time_block\nschedule\nschedule event\nschedule search\nschedule_event\nsearch\nsearch calendar\nsearch events\nsearch_calendar\nshow calendar today\nshow_calendar_today\ntasks google calendar\ntoday schedule\ntoday_schedule\ntravel\ntravel email\ntravel schedule\ntravel_schedule\nview\nview schedule\nweek ahead\nweek view\nweek_ahead\nweek_view\nwhats my next meeting\nwhats_my_next_meeting";
                readonly locales: {
                    readonly es: "accion\nagendar\namigo\nbloquear\nbuscar\nbuscar calendario\ncalendario\ncalendario accion\ncalendario buscar\ncalendario crear\ncalendario google calendario\ncalendario leer\ncolega\ncomprobar\nconsulta\nconsulta viaje\ncontacto\ncontacto google calendario\ncontactos\ncorreo\ncrear\ncrear calendario\nemail\nfecha limite\ngente\ngoogle calendario\nherramienta\nleer\npendiente\npersona\nprogramar\nprogramar buscar\nrecordatorio\nrelacion\nreservar\nreservar bloquear\nrevisar\nrevisar calendario\nrevisar programar\nseguimiento\nsolicitud\ntarea\ntarea google calendario\ntareas\nviaje\nviaje correo\nviaje programar";
                    readonly ko: "google 캘린더\n검색\n검색 캘린더\n관계\n도구\n동료\n리마인더\n마감일\n사람\n생성\n생성 캘린더\n여행\n여행 예약\n여행 이메일\n연락처\n연락처 google 캘린더\n예약\n예약 검색\n예약 차단\n요청\n이메일\n일정\n읽기\n작업\n작업 google 캘린더\n질의\n차단\n친구\n캘린더\n캘린더 google 캘린더\n캘린더 검색\n캘린더 생성\n캘린더 읽기\n캘린더 작업\n쿼리\n쿼리 여행\n할 일\n확인\n확인 예약\n확인 캘린더\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\nagendar\nagendar buscar\namigo\nbloquear\nbuscar\nbuscar calendario\ncalendario\ncalendario acao\ncalendario buscar\ncalendario criar\ncalendario google calendario\ncalendario ler\ncolega\nconsulta\nconsulta viagem\ncontato\ncontato google calendario\ncontatos\ncorreio\ncriar\ncriar calendario\nemail\nferramenta\ngoogle calendario\nlembrete\nler\npessoa\npessoas\nprazo\nrelacao\nreservar\nreservar bloquear\nsolicitacao\ntarefa\ntarefa google calendario\ntarefas\nverificar\nverificar agendar\nverificar calendario\nviagem\nviagem agendar\nviagem email";
                    readonly tl: "aksyon\nbasahin\nbiyahe\nbiyahe email\nbiyahe i-schedule\ncontact\ncontact google kalendaryo\ncontacts\ndeadline\nemail\nfollow up\ngawain\ngawain google kalendaryo\ngoogle kalendaryo\ngumawa\ngumawa kalendaryo\ni-block\ni-schedule\ni-schedule maghanap\nireserba\nkahilingan\nkaibigan\nkalendaryo\nkalendaryo aksyon\nkalendaryo basahin\nkalendaryo google kalendaryo\nkalendaryo gumawa\nkalendaryo maghanap\nkasamahan\nkasangkapan\nkoreo\nmag-book\nmag-book i-block\nmaghanap\nmaghanap kalendaryo\npaalala\nquery\nquery biyahe\nrelasyon\nsuriin\nsuriin i-schedule\nsuriin kalendaryo\ntao\ntask\ntodo";
                    readonly vi: "cong cu\ncông cụ\nđặt chặn\ndu lich\ndu lịch\ndu lịch email\ndu lịch lên lịch\ngoogle lịch\nhanh dong\nhành động\nkiem tra\nkiểm tra\nkiểm tra lên lịch\nkiểm tra lịch\nlen lich\nlên lịch\nlên lịch tìm kiếm\nlich\nlịch\nlịch đọc\nlịch google lịch\nlịch hành động\nlịch tạo\nlịch tìm kiếm\nlien he\nliên hệ\nliên hệ google lịch\nnguoi\nngười\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnhiệm vụ google lịch\nquan he\nquan hệ\ntac vu\ntác vụ\ntạo lịch\ntim kiem\ntìm kiếm\ntìm kiếm lịch\ntruy van\ntruy vấn\ntruy vấn du lịch\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "google 日历\n人物\n任务\n任务 google 日历\n关系\n创建\n创建 日历\n同事\n安排\n安排 搜索\n工具\n待办\n截止日期\n提醒\n搜索\n搜索 日历\n操作\n旅行\n旅行 安排\n旅行 邮件\n日历\n日历 google 日历\n日历 创建\n日历 搜索\n日历 操作\n日历 读取\n朋友\n查询\n查询 旅行\n检查\n检查 安排\n检查 日历\n联系人\n联系人 google 日历\n请求\n读取\n跟进\n邮件\n阻止\n预订\n预订 阻止";
                };
            };
        };
        readonly grep: {
            readonly request: {
                readonly base: "always\nautomation grep\nbash\nbash content\ncode grep\ncontent\ncontent always\ncontent search\ncontents\ncontents using\ncounts\ncounts files\ndirectories\nexcludes\nfast\nfile\nfile contents\nfiles\nfiles counts\nfiles returns\ngrep\ninstead\ninstead bash\nline\nline content\nmatches\nmatching\nmatching files\nregex\nregex search\nreturns\nrg\nripgrep\nsearch\nsearch content\nsearch file\nsearch files\nsearch returns\nsearch_content\nterminal grep\nusing\nwrapper";
                readonly locales: {
                    readonly es: "accion\narchivo\narchivo contenido\nautomatizacion\nautomatizacion buscar texto\nbash\nbash contenido\nbuscar\nbuscar archivo\nbuscar contenido\nbuscar texto\ncodigo\ncodigo buscar texto\ncontenido\ncontenido buscar\ncron\ndepurar\ndisparador\nflujo de trabajo\ngrep\nherramienta\nimplementar\nlinea de comandos\nmonitor\nproceso\nprogramacion\nprueba\nrepositorio\nshell\nsolicitud\nterminal\nterminal buscar texto";
                    readonly ko: "grep\n검색\n검색 콘텐츠\n검색 파일\n구현\n내용\n도구\n디버그\n명령줄\n모니터\n배시\n배시 콘텐츠\n셸\n요청\n워크플로\n자동화\n자동화 텍스트 검색\n작업\n저장소\n코드\n코드 텍스트 검색\n콘텐츠\n콘텐츠 검색\n크론\n터미널\n터미널 텍스트 검색\n테스트\n텍스트 검색\n트리거\n파일\n파일 콘텐츠\n프로그래밍\n프로세스";
                    readonly pt: "acao\narquivo\narquivo conteudo\nautomacao\nautomacao buscar texto\nbash\nbash conteudo\nbuscar\nbuscar arquivo\nbuscar conteudo\nbuscar texto\ncodigo\ncodigo buscar texto\nconteudo\nconteudo buscar\ncron\ndepurar\nferramenta\nfluxo de trabalho\ngatilho\ngrep\nimplementar\nlinha de comando\nmonitor\nprocesso\nprogramacao\nrepositorio\nshell\nsolicitacao\nterminal\nterminal buscar texto\nteste";
                    readonly tl: "aksyon\nautomation\nautomation hanapin text\nbash\nbash nilalaman\ncode\ncode hanapin text\ncommand line\ncron\ndebug\nfile\nfile nilalaman\ngrep\nhanapin text\nipatupad\nkahilingan\nkasangkapan\nmaghanap\nmaghanap file\nmaghanap nilalaman\nmonitor\nnilalaman\nnilalaman maghanap\nprocess\nprogramming\nrepo\nshell\nterminal\nterminal hanapin text\ntest\ntrigger\nworkflow";
                    readonly vi: "bash\nbash nội dung\ncong cu\ncông cụ\ndong lenh\ndòng lệnh\ngrep\nhanh dong\nhành động\nkho ma\nkho mã\nkich hoat\nkiểm thử\nlap trinh\nlập trình\nma\nmã\nmã tìm văn bản\nnoi dung\nnội dung\nnội dung tìm kiếm\nquy trinh\nquy trình\nshell\ntep\ntệp\ntệp nội dung\nterminal\nterminal tìm văn bản\ntiến trình\ntim kiem\ntìm kiếm\ntìm kiếm nội dung\ntìm kiếm tệp\ntim van ban\ntìm văn bản\ntu dong hoa\ntự động hóa\ntự động hóa tìm văn bản\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "Bash\nbash 内容\ngrep\n仓库\n代码\n代码 文本搜索\n内容\n内容 搜索\n命令行\n定时\n实现\n工作流\n工具\n搜索\n搜索 内容\n搜索 文件\n操作\n文件\n文件 内容\n文本搜索\n标准输出\n测试\n监控\n终端\n终端 文本搜索\n编程\n自动化\n自动化 文本搜索\n触发器\n请求\n调试\n进程";
                };
            };
        };
        readonly health: {
            readonly request: {
                readonly base: "activity metrics\nactivity_metrics\ncalendar health\ncalories\ndays\ndistance\nexercise\nfitbit\nfitness\ngoogle\nhealth\nhealth fitness\nhealth google\nhealth health\nheart\nheart rate\nheart_rate\nmetric\noura\nrate\nsleep\nstatus\nsteps\nstrava\ntasks health\ntelemetry\ntelemetry health\ntoday\ntrend\nwellness\nwithings\nworkout\nworkouts\nworkouts status";
                readonly locales: {
                    readonly es: "accion\nactividad\nbienestar\ncalendario\ncalendario salud\nejercicio\nestado\nfecha limite\nherramienta\nmedicina\npendiente\nrecordatorio\nsalud\nsalud google\nsalud salud\nseguimiento\nsintoma\nsolicitud\nsueño\ntarea\ntarea salud\ntareas";
                    readonly ko: "건강\n건강 google\n건강 건강\n도구\n리마인더\n마감일\n상태\n수면\n약\n요청\n운동\n웰니스\n일정\n작업\n작업 건강\n증상\n캘린더\n캘린더 건강\n할 일\n활동\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\natividade\nbem-estar\ncalendario\ncalendario saude\nestado\nexercicio\nferramenta\nlembrete\nprazo\nremedio\nsaude\nsaude google\nsaude saude\nsintoma\nsolicitacao\nsono\nstatus\ntarefa\ntarefa saude\ntarefas";
                    readonly tl: "aksyon\naktibidad\ndeadline\nehersisyo\nfollow up\ngamot\ngawain\ngawain kalusugan\nkahilingan\nkalendaryo\nkalendaryo kalusugan\nkalusugan\nkalusugan google\nkalusugan kalusugan\nkasangkapan\npaalala\nsintomas\nstatus\ntask\ntodo\ntulog\nwellness";
                    readonly vi: "cong cu\ncông cụ\nhanh dong\nhành động\nhoat dong\nhoạt động\nlich\nlịch\nlịch sức khỏe\nngu\nngủ\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnhiệm vụ sức khỏe\nsuc khoe\nsức khỏe\nsức khỏe google\nsức khỏe sức khỏe\ntac vu\ntác vụ\ntập luyện\ntrang thai\ntrạng thái\ntrieu chung\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "任务\n任务 健康\n健康\n健康 google\n健康 健康\n工具\n待办\n截止日期\n提醒\n操作\n日历\n日历 健康\n活动\n状态\n症状\n睡眠\n药物\n请求\n跟进\n运动";
                };
            };
        };
        readonly life: {
            readonly request: {
                readonly base: "alarm\napp\naspiration\ncadence\ncalendar life\ncomplete\ncomplete skip\ncreate\ncreate update\ndaily\ndefinition\ndefinition goal\ndelete\ndelete kind\ngoal\ngoal complete\ngoals\nhabit\nhabits\nhealth life\nintent\ninterval\nitem\nkind\nlanguage\nlife\nlong\nmanagement\nmark done\nmark_done\nnatural\nnew goal\nnew habit\nnew_goal\nnew_habit\nnext\noccurrence\nonce\nonly\nowner\nparsed\npersistence\npersonal\nprofile\nprogress\nreminder\nreminders\nreview\nreview goal\nroutine\nset reminder\nset_reminder\nskip\nsnooze\nsubaction\nsubaction create\nsubactions\nsurface\ntask\ntasks life\nterm\ntimes\ntodo\ntodos\ntodos life\ntrack habit\ntrack_habit\nupdate\nupdate delete\nweekly";
                readonly locales: {
                    readonly es: "accion\nactualizar\nactualizar eliminar\nalarma\naplicacion\napp\nbienestar\nborrar\nborrar tarea\ncalendario\ncompletar\ncompletar tarea\ncrear\ncrear actualizar\nejercicio\neliminar\nfecha limite\ngestion\nherramienta\nlista de tareas\nmedicina\nmeta\nmeta completar\nobjetivo\npendiente\npendientes\nperfil\nrecordatorio\nsalud\nseguimiento\nsintoma\nsolicitud\nsueño\ntarea\ntareas\nterminar\ntodo";
                    readonly ko: "건강\n관리\n도구\n리마인더\n마감일\n목표\n목표 완료\n삭제\n생성\n생성 업데이트\n수면\n알람\n알림\n앱\n약\n업데이트\n업데이트 삭제\n완료\n요청\n운동\n웰니스\n일정\n작업\n작업 목록\n작업 삭제\n작업 완료\n증상\n캘린더\n프로필\n할 일\n할일\n활성 작업\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\nafazeres\nalarme\napagar\napagar tarefa\naplicativo\napp\natualizar\natualizar excluir\nbem-estar\ncalendario\ncompletar\nconcluir\nconcluir tarefa\ncriar\ncriar atualizar\nexcluir\nexercicio\nferramenta\ngerenciamento\nlembrete\nlista de tarefas\nmeta\nmeta concluir\nobjetivo\nperfil\nprazo\nremedio\nsaude\nsintoma\nsolicitacao\nsono\ntarefa\ntarefas\ntodo";
                    readonly tl: "aksyon\nalarm\napp\nburahin\nburahin task\ndeadline\nehersisyo\nfollow up\ngamot\ngawain\ngumawa\ngumawa i-update\ni-update\ni-update burahin\nkahilingan\nkalendaryo\nkalusugan\nkasangkapan\nkumpletuhin task\nlayunin\nlayunin tapusin\npaalala\npamamahala\nprofile\nsintomas\ntapusin\ntask\ntask list\ntodo\ntulog\nwellness";
                    readonly vi: "bao thuc\nbáo thức\ncap nhat\ncập nhật\ncập nhật xóa\ncong cu\ncông cụ\ndanh sách tác vụ\nhanh dong\nhành động\nho so\nhồ sơ\nhoan thanh\nhoàn thành\nhoàn thành tác vụ\nlich\nlịch\nmuc tieu\nmục tiêu\nmục tiêu hoàn thành\nngu\nngủ\nnhac nho\nnhắc nhở\nnhiem vu\nnhiệm vụ\nquan ly\nquản lý\nsuc khoe\nsức khỏe\ntac vu\ntác vụ\ntao\ntạo\ntạo cập nhật\ntập luyện\ntrieu chung\nung dung\nứng dụng\nviec can lam\nviệc cần làm\nxoa\nxóa\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "任务\n任务列表\n健康\n创建\n创建 更新\n删除\n删除任务\n完成\n完成任务\n工具\n应用\n待办\n截止日期\n提醒\n操作\n日历\n更新\n更新 删除\n活动任务\n症状\n目标\n目标 完成\n睡眠\n管理\n药物\n请求\n资料\n跟进\n运动\n闹钟";
                };
            };
        };
        readonly linear: {
            readonly request: {
                readonly base: "activity\nactivity operations\nautomation linear\nclear\nclear activity\nclear linear activity\nclear_linear_activity\ncomment\ncomment delete\ncomment linear issue\ncomment search\ncomment update\ncomment_linear_issue\ncomments\ncomments activity\ncreate\ncreate comment\ncreate get\ncreate issue\ncreate linear comment\ncreate linear issue\ncreate update\ncreate_linear_comment\ncreate_linear_issue\ndelete\ndelete issue\ndelete linear comment\ndelete linear issue\ndelete list\ndelete_linear_comment\ndelete_linear_issue\nexplicitly\ngeneral linear\nget\nget clear\nget issue\nget linear activity\nget linear issue\nget update\nget_linear_activity\nget_linear_issue\ninferred\nissue\nissue create\nissue delete\nissue get\nissue update\nissues\nissues comments\nissues get\nknowledge linear\nlinear\nlinear activity\nlinear comment\nlinear comments\nlinear create\nlinear issue\nlinear issues\nlinear search\nlinear workflow\nlinear workflow search\nlinear_activity\nlinear_comment\nlinear_comments\nlinear_issue\nlinear_issues\nlinear_search\nlinear_workflow\nlinear_workflow_search\nlist\nlist comment\nlist linear comments\nlist_linear_comments\nmanage\nmanage linear\nmanage linear issue\nmanage linear issues\nmanage_linear_issue\nmanage_linear_issues\nmessage\noperations\noperations create\nprovided\nsearch\nsearch issues\nsearch linear issues\nsearch_linear_issues\ntext\nupdate\nupdate comment\nupdate delete\nupdate issue\nupdate linear comment\nupdate linear issue\nupdate_linear_comment\nupdate_linear_issue";
                readonly locales: {
                    readonly es: "actividad operacion\nactualizar linear comentario\nactualizar linear incidencia\nautomatizacion linear\nbuscar linear incidencia\nchat general\ncomentario actividad\ncomentario actualizar\ncomentario buscar\ncomentario eliminar\ncomentario linear incidencia\nconocimiento linear\ncrear actualizar\ncrear comentario\ncrear incidencia\ncrear linear comentario\ncrear linear incidencia\ncrear obtener\neliminar incidencia\neliminar linear comentario\neliminar linear incidencia\neliminar listar\nflujo de trabajo\ngeneral linear\ngestionar linear\ngestionar linear incidencia\nhechos guardados\nincidencia actualizar\nincidencia comentario\nincidencia crear\nincidencia eliminar\nincidencia obtener\nlimpiar actividad\nlimpiar linear actividad\nlinear actividad\nlinear buscar\nlinear comentario\nlinear crear\nlinear flujo de trabajo\nlinear flujo de trabajo buscar\nlinear incidencia\nlistar linear comentario\nnotas guardadas\nobtener actualizar\nobtener incidencia\nobtener limpiar\nobtener linear actividad\nobtener linear incidencia";
                    readonly ko: "가져오기 리니어 이슈\n가져오기 리니어 활동\n가져오기 업데이트\n가져오기 이슈\n가져오기 지우기\n검색 리니어 이슈\n관리 리니어\n관리 리니어 이슈\n댓글 검색\n댓글 리니어 이슈\n댓글 삭제\n댓글 업데이트\n댓글 활동\n리니어 검색\n리니어 댓글\n리니어 생성\n리니어 워크플로\n리니어 워크플로 검색\n리니어 이슈\n리니어 활동\n목록 리니어 댓글\n삭제 리니어 댓글\n삭제 리니어 이슈\n삭제 목록\n삭제 이슈\n생성 가져오기\n생성 댓글\n생성 리니어 댓글\n생성 리니어 이슈\n생성 업데이트\n생성 이슈\n업데이트 리니어 댓글\n업데이트 리니어 이슈\n이슈 가져오기\n이슈 댓글\n이슈 삭제\n이슈 생성\n이슈 업데이트\n일반 대화\n일반 리니어\n자동화 리니어\n작업 생성\n저장된 노트\n저장된 사실\n지식 리니어\n지우기 리니어 활동\n지우기 활동\n활동 작업";
                    readonly pt: "atividade operacao\natualizar linear comentario\natualizar linear problema\nautomacao linear\nbuscar linear problema\nchat geral\ncomentario atividade\ncomentario atualizar\ncomentario buscar\ncomentario excluir\ncomentario linear problema\nconhecimento linear\ncriar atualizar\ncriar comentario\ncriar linear comentario\ncriar linear problema\ncriar obter\ncriar problema\nexcluir linear comentario\nexcluir linear problema\nexcluir listar\nexcluir problema\nfatos salvos\nfluxo de trabalho\ngeral linear\ngerenciar linear\ngerenciar linear problema\nlimpar atividade\nlimpar linear atividade\nlinear atividade\nlinear buscar\nlinear comentario\nlinear criar\nlinear fluxo de trabalho\nlinear fluxo de trabalho buscar\nlinear problema\nlistar linear comentario\nnotas salvas\nobter atualizar\nobter limpar\nobter linear atividade\nobter linear problema\nobter problema\nproblema atualizar\nproblema comentario\nproblema criar\nproblema excluir\nproblema obter";
                    readonly tl: "aktibidad operasyon\nautomation linear\nburahin ilista\nburahin isyu\nburahin linear isyu\nburahin linear komento\ngeneral chat\ngumawa i-update\ngumawa isyu\ngumawa komento\ngumawa kunin\ngumawa linear isyu\ngumawa linear komento\ni-update linear isyu\ni-update linear komento\nilista linear komento\nisyu burahin\nisyu gumawa\nisyu i-update\nisyu komento\nisyu kunin\nkaalaman linear\nkomento aktibidad\nkomento burahin\nkomento i-update\nkomento linear isyu\nkomento maghanap\nkunin i-update\nkunin isyu\nkunin linear aktibidad\nkunin linear isyu\nkunin linisin\nlinear aktibidad\nlinear gumawa\nlinear isyu\nlinear komento\nlinear maghanap\nlinear workflow\nlinear workflow maghanap\nlinisin aktibidad\nlinisin linear aktibidad\nmaghanap linear isyu\noperasyon gumawa\npamahalaan linear\npamahalaan linear isyu\npangkalahatan linear\nsaved facts\nsaved notes";
                    readonly vi: "binh luan\nbình luận\nbình luận linear vấn đề\ncap nhat\ncập nhật\ncập nhật linear bình luận\ncập nhật linear vấn đề\nghi chu da luu\nghi chú đã lưu\nhoat dong\nhoạt động\nkich hoat\nkien thuc\nkiến thức\nlấy linear hoạt động\nlấy linear vấn đề\nliet ke\nliệt kê\nliệt kê linear bình luận\nlinear bình luận\nlinear hoạt động\nlinear quy trình\nlinear quy trình tìm kiếm\nlinear tìm kiếm\nlinear vấn đề\nnhớ lại\nnói chuyện\nquan ly\nquản lý\nquản lý linear vấn đề\nquy trinh\nquy trình\ntạo linear bình luận\ntạo linear vấn đề\ntim kiem\ntìm kiếm\ntìm kiếm linear vấn đề\ntra loi\ntrả lời\ntro chuyen\ntrò chuyện\ntu dong hoa\ntự động hóa\nvan de\nvấn đề\nxóa linear bình luận\nxóa linear hoạt động\nxóa linear vấn đề";
                    readonly "zh-CN": "linear 创建\nlinear 工作流\nlinear 工作流 搜索\nlinear 搜索\nlinear 活动\nlinear 评论\nlinear 问题\n列出 linear 评论\n列出 评论\n创建 linear 评论\n创建 linear 问题\n创建 更新\n创建 获取\n创建 评论\n创建 问题\n删除 linear 评论\n删除 linear 问题\n删除 列出\n删除 问题\n搜索 linear 问题\n操作 创建\n更新 linear 评论\n更新 linear 问题\n更新 删除\n更新 问题\n活动 操作\n清除 linear 活动\n清除 活动\n知识 linear\n管理 linear\n管理 linear 问题\n自动化 linear\n获取 linear 活动\n获取 linear 问题\n获取 更新\n获取 清除\n获取 问题\n评论 linear 问题\n评论 删除\n评论 搜索\n评论 更新\n评论 活动\n通用 linear\n问题 创建\n问题 删除\n问题 更新\n问题 获取\n问题 评论";
                };
            };
        };
        readonly linearComment: {
            readonly request: {
                readonly base: "automation linear comment\ncomment\ncomment create\ncomment operations\ncreate\ncreate reply\ngeneral linear comment\nissue\nissue comment\nissues\nlinear\nlinear comment\nlinear issue\nlinear_comment\nnote\noperations\noperations issues\nreply\nreply note\nroute\nroute linear";
                readonly locales: {
                    readonly es: "accion\nautomatizacion\nautomatizacion linear comentario\nchat general\ncomentario\ncomentario crear\ncomentario operacion\nconversacion\ncrear\ncrear responder\ncron\ndisparador\nflujo de trabajo\ngeneral\ngeneral linear comentario\nhablar\nherramienta\nincidencia\nincidencia comentario\nlinear\nlinear comentario\nlinear incidencia\nmonitor\noperacion\noperacion incidencia\nresponder\nrespuesta\nsolicitud\ntarea";
                    readonly ko: "답변\n답장\n댓글\n댓글 생성\n댓글 작업\n도구\n리니어\n리니어 댓글\n리니어 이슈\n말하기\n모니터\n생성\n생성 답장\n요청\n워크플로\n이슈\n이슈 댓글\n일반\n일반 대화\n일반 리니어 댓글\n자동화\n자동화 리니어 댓글\n작업\n작업 이슈\n채팅\n크론\n트리거";
                    readonly pt: "acao\nautomacao\nautomacao linear comentario\nchat geral\ncomentario\ncomentario criar\ncomentario operacao\nconversa\ncriar\ncriar responder\ncron\nfalar\nferramenta\nfluxo de trabalho\ngatilho\ngeral\ngeral linear comentario\nissue\nlinear\nlinear comentario\nlinear problema\nmonitor\noperacao\noperacao problema\nproblema\nproblema comentario\nresponder\nresposta\nsolicitacao";
                    readonly tl: "aksyon\nautomation\nautomation linear komento\ncron\ngeneral chat\ngumawa\ngumawa sagot\nisyu\nisyu komento\nkahilingan\nkasangkapan\nkomento\nkomento gumawa\nkomento operasyon\nlinear\nlinear isyu\nlinear komento\nmakipag-usap\nmonitor\noperasyon\noperasyon isyu\npangkalahatan\npangkalahatan linear komento\nsagot\nsumagot\ntrigger\nusap\nworkflow";
                    readonly vi: "binh luan\nbình luận\nbình luận tạo\nbình luận thao tác\nchung\nchung linear bình luận\ncong cu\ncông cụ\nhanh dong\nhành động\nkich hoat\nlinear\nlinear bình luận\nlinear vấn đề\nnói chuyện\nquy trinh\nquy trình\ntao\ntạo\ntạo trả lời\nthao tac\nthao tác\nthao tác vấn đề\ntra loi\ntrả lời\ntro chuyen\ntrò chuyện\ntu dong hoa\ntự động hóa\ntự động hóa linear bình luận\nvan de\nvấn đề\nvấn đề bình luận\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "linear\nlinear 评论\nlinear 问题\n创建\n创建 回复\n回复\n回答\n定时\n对话\n工作流\n工具\n操作\n操作 问题\n普通聊天\n监控\n自动化\n自动化 linear 评论\n触发器\n评论\n评论 创建\n评论 操作\n请求\n通用\n通用 linear 评论\n问题\n问题 评论";
                };
            };
        };
        readonly linearIssue: {
            readonly request: {
                readonly base: "automation linear issue\ncreate\ncreate get\ndelete\ndelete issues\ngeneral linear issue\nget\nget update\nissue\nissue create\nissue operations\nissues\nknowledge linear issue\nlinear\nlinear issue\nlinear_issue\noperations\noperations create\nroute\nroute linear\nupdate\nupdate delete";
                readonly locales: {
                    readonly es: "accion\nactualizar\nactualizar eliminar\nautomatizacion\nautomatizacion linear incidencia\nborrar\nchat general\nconocimiento\nconocimiento linear incidencia\nconversacion\ncrear\ncrear obtener\ncron\ndisparador\neliminar\neliminar incidencia\nflujo de trabajo\ngeneral\ngeneral linear incidencia\nhablar\nhechos guardados\nherramienta\nincidencia\nincidencia crear\nincidencia operacion\nlinear\nlinear incidencia\nmonitor\nnotas guardadas\nobtener\nobtener actualizar\noperacion\noperacion crear\nrecordar\nrespuesta\nsolicitud\ntarea";
                    readonly ko: "가져오기\n가져오기 업데이트\n검색\n답변\n도구\n리니어\n리니어 이슈\n말하기\n모니터\n삭제\n삭제 이슈\n생성\n생성 가져오기\n업데이트\n업데이트 삭제\n요청\n워크플로\n이슈\n이슈 생성\n이슈 작업\n일반\n일반 대화\n일반 리니어 이슈\n자동화\n자동화 리니어 이슈\n작업\n작업 생성\n저장된 노트\n저장된 사실\n지식\n지식 리니어 이슈\n채팅\n크론\n트리거\n회상";
                    readonly pt: "acao\napagar\natualizar\natualizar excluir\nautomacao\nautomacao linear problema\nchat geral\nconhecimento\nconhecimento linear problema\nconversa\ncriar\ncriar obter\ncron\nexcluir\nexcluir problema\nfalar\nfatos salvos\nferramenta\nfluxo de trabalho\ngatilho\ngeral\ngeral linear problema\nissue\nlembrar\nlinear\nlinear problema\nmonitor\nnotas salvas\nobter\nobter atualizar\noperacao\noperacao criar\nproblema\nproblema criar\nproblema operacao\nresposta\nsolicitacao";
                    readonly tl: "aksyon\nalalahanin\nautomation\nautomation linear isyu\nburahin\nburahin isyu\ncron\ngeneral chat\ngumawa\ngumawa kunin\ni-update\ni-update burahin\nisyu\nisyu gumawa\nisyu operasyon\nkaalaman\nkaalaman linear isyu\nkahilingan\nkasangkapan\nkunin\nkunin i-update\nlinear\nlinear isyu\nmakipag-usap\nmonitor\noperasyon\noperasyon gumawa\npangkalahatan\npangkalahatan linear isyu\nsagot\nsaved facts\nsaved notes\ntrigger\nusap\nworkflow";
                    readonly vi: "cap nhat\ncập nhật\ncập nhật xóa\nchung\nchung linear vấn đề\ncong cu\ncông cụ\nghi chu da luu\nghi chú đã lưu\nhanh dong\nhành động\nkich hoat\nkien thuc\nkiến thức\nkiến thức linear vấn đề\nlay\nlấy\nlấy cập nhật\nlinear\nlinear vấn đề\nnhớ lại\nnói chuyện\nquy trinh\nquy trình\ntao\ntạo\ntạo lấy\nthao tac\nthao tác\nthao tác tạo\ntra loi\ntrả lời\ntro chuyen\ntrò chuyện\ntu dong hoa\ntự động hóa\ntự động hóa linear vấn đề\nvan de\nvấn đề\nvấn đề tạo\nvấn đề thao tác\nxoa\nxóa\nxóa vấn đề\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "linear\nlinear 问题\n创建\n创建 获取\n删除\n删除 问题\n回复\n回忆\n回答\n定时\n对话\n工作流\n工具\n已保存事实\n已保存笔记\n操作\n操作 创建\n普通聊天\n更新\n更新 删除\n监控\n知识\n知识 linear 问题\n自动化\n自动化 linear 问题\n获取\n获取 更新\n触发器\n语义搜索\n请求\n通用\n通用 linear 问题\n问题\n问题 创建\n问题 操作";
                };
            };
        };
        readonly linearWorkflow: {
            readonly request: {
                readonly base: "activity\nactivity issue\nactivity search\nautomation linear workflow\ncategory\ngeneral linear workflow\nissue\nissue category\nissue search\nknowledge linear workflow\nlinear\nlinear workflow\nlinear_workflow\noperations\nroute\nroute linear\nsearch\nsearch issue\nsearch operations\nworkflow\nworkflow activity";
                readonly locales: {
                    readonly es: "accion\nactividad\nactividad buscar\nactividad incidencia\nautomatizacion\nautomatizacion linear flujo de trabajo\nbuscar\nbuscar incidencia\nbuscar operacion\nchat general\nconocimiento\nconocimiento linear flujo de trabajo\nconversacion\ncron\ndisparador\nflujo de trabajo\nflujo de trabajo actividad\ngeneral\ngeneral linear flujo de trabajo\nhablar\nhechos guardados\nherramienta\nincidencia\nincidencia buscar\nlinear\nlinear flujo de trabajo\nmonitor\nnotas guardadas\noperacion\nrecordar\nrespuesta\nsolicitud\ntarea";
                    readonly ko: "검색\n검색 이슈\n검색 작업\n답변\n도구\n리니어\n리니어 워크플로\n말하기\n모니터\n요청\n워크플로\n워크플로 활동\n이슈\n이슈 검색\n일반\n일반 대화\n일반 리니어 워크플로\n자동화\n자동화 리니어 워크플로\n작업\n저장된 노트\n저장된 사실\n지식\n지식 리니어 워크플로\n채팅\n크론\n트리거\n활동\n활동 검색\n활동 이슈\n회상";
                    readonly pt: "acao\natividade\natividade buscar\natividade problema\nautomacao\nautomacao linear fluxo de trabalho\nbuscar\nbuscar operacao\nbuscar problema\nchat geral\nconhecimento\nconhecimento linear fluxo de trabalho\nconversa\ncron\nfalar\nfatos salvos\nferramenta\nfluxo de trabalho\nfluxo de trabalho atividade\ngatilho\ngeral\ngeral linear fluxo de trabalho\nissue\nlembrar\nlinear\nlinear fluxo de trabalho\nmonitor\nnotas salvas\noperacao\nproblema\nproblema buscar\nresposta\nsolicitacao";
                    readonly tl: "aksyon\naktibidad\naktibidad isyu\naktibidad maghanap\nalalahanin\nautomation\nautomation linear workflow\ncron\ngeneral chat\nisyu\nisyu maghanap\nkaalaman\nkaalaman linear workflow\nkahilingan\nkasangkapan\nlinear\nlinear workflow\nmaghanap\nmaghanap isyu\nmaghanap operasyon\nmakipag-usap\nmonitor\noperasyon\npangkalahatan\npangkalahatan linear workflow\nsagot\nsaved facts\nsaved notes\ntrigger\nusap\nworkflow\nworkflow aktibidad";
                    readonly vi: "chung\nchung linear quy trình\ncong cu\ncông cụ\nghi chu da luu\nghi chú đã lưu\nhanh dong\nhành động\nhoat dong\nhoạt động\nhoạt động tìm kiếm\nhoạt động vấn đề\nkich hoat\nkien thuc\nkiến thức\nkiến thức linear quy trình\nlinear\nlinear quy trình\nnhớ lại\nnói chuyện\nquy trinh\nquy trình\nquy trình hoạt động\nthao tac\nthao tác\ntim kiem\ntìm kiếm\ntìm kiếm thao tác\ntìm kiếm vấn đề\ntra loi\ntrả lời\ntro chuyen\ntrò chuyện\ntu dong hoa\ntự động hóa\ntự động hóa linear quy trình\nvan de\nvấn đề\nvấn đề tìm kiếm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "linear\nlinear 工作流\n回复\n回忆\n回答\n定时\n对话\n工作流\n工作流 活动\n工具\n已保存事实\n已保存笔记\n搜索\n搜索 操作\n搜索 问题\n操作\n普通聊天\n活动\n活动 搜索\n活动 问题\n监控\n知识\n知识 linear 工作流\n自动化\n自动化 linear 工作流\n触发器\n语义搜索\n请求\n通用\n通用 linear 工作流\n问题\n问题 搜索";
                };
            };
        };
        readonly liquidity: {
            readonly request: {
                readonly base: "action\naction onboard\naerodrome\namount\nautomate positions\nautomate raydium positions\nautomate raydium rebalancing\nautomate rebalancing\nautomate_positions\nautomate_raydium_positions\nautomate_raydium_rebalancing\nautomate_rebalancing\nautomation liquidity\nchain\nclose\ncrypto liquidity\nfilters\nfinance liquidity\nget\nget position\ninferred\ninferred omitted\nliquidity\nliquidity management\nliquidity pool management\nliquidity_pool_management\nlist\nlist pools\nlist positions\nlp management\nlp manager\nlp_management\nlp_manager\nmanage\nmanage liquidity\nmanage lp\nmanage lp positions\nmanage positions\nmanage raydium positions\nmanage_liquidity\nmanage_lp\nmanage_lp_positions\nmanage_positions\nmanage_raydium_positions\nmanagement\nmanagement action\nmeteora\nomitted\nonboard\nonboard list\nopen\nopen close\norca\npancakeswap\npool\npools\npools open\nposition\npositions\npositions get\npreferences\nprotocol\nrange\nrange token\nraydium\nreposition\nreposition list\nselects\nsingle\nsolana\nsolana inferred\nstart managing positions\nstart managing raydium positions\nstart_managing_positions\nstart_managing_raydium_positions\ntoken\ntoken filters\nuniswap\nwallet liquidity";
                readonly locales: {
                    readonly es: "abrir\naccion\nadministrar\nautomatizacion\nbilletera\ncadena\ncripto\ncron\ncuenta\ndefi\ndinero\ndireccion\ndisparador\nfactura\nfinanzas\nfirmar transaccion\nflujo de trabajo\ngestion\ngestion accion\ngestionar\nherramienta\ninferido\nintercambio\nliquidez\nlistar\nmonitor\nmostrar\nobtener\nportafolio\nsaldo\nsolicitud\ntoken\ntransferir";
                    readonly ko: "가져오기\n거래 서명\n계정\n관리\n관리 작업\n금융\n도구\n돈\n디파이\n모니터\n목록\n스왑\n암호화폐\n열기\n온체인\n요청\n워크플로\n유동성\n자동화\n작업\n잔액\n전송\n주소\n지갑\n청구서\n추론\n크론\n토큰\n트리거\n포트폴리오";
                    readonly pt: "abrir\nacao\nassinar transacao\nautomacao\ncarteira\nconta\ncripto\ncron\ndefi\ndinheiro\nendereco\nfatura\nferramenta\nfinancas\nfluxo de trabalho\ngatilho\ngerenciamento\ngerenciamento acao\ngerenciar\ninferido\nliquidez\nlistar\nmonitor\nmostrar\nobter\nonchain\nportfolio\nsaldo\nsolicitacao\ntoken\ntransferir\ntroca";
                    readonly tl: "account\naddress\naksyon\nautomation\nbalance\nbuksan\ncron\ncrypto\ndefi\nfinance\nhinula\nilista\ninvoice\nkahilingan\nkasangkapan\nkunin\nliquidity\nmonitor\npamahalaan\npamamahala\npamamahala aksyon\npera\nportfolio\nsign transaction\nswap\ntoken\ntransfer\ntrigger\nwallet\nworkflow";
                    readonly vi: "chuyen\nchuyển\ncong cu\ncông cụ\ncrypto\ndefi\nhanh dong\nhành động\nkich hoat\nký giao dịch\nlay\nlấy\nliet ke\nliệt kê\nmo\nmở\nquan ly\nquản lý\nquản lý hành động\nquy trinh\nquy trình\nso du\nsố dư\nsuy luan\nsuy luận\ntai chinh\ntài chính\nthanh khoản\ntien\ntiền\ntien ma hoa\ntiền mã hóa\ntoken\ntu dong hoa\ntự động hóa\nvi\nví\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "交换\n代币\n令牌\n余额\n列出\n加密货币\n发票\n地址\n定时\n工作流\n工具\n打开\n投资组合\n推断\n操作\n流动性\n监控\n签名交易\n管理\n管理 操作\n自动化\n获取\n触发器\n请求\n财务\n账户\n转账\n钱\n钱包\n链上";
                };
            };
        };
        readonly listActiveBlocks: {
            readonly request: {
                readonly base: "active\napp\nautomation list active blocks\nblock\nblocker\nblockers\nblocking\nblocks\nblocks live\nbrowser list active blocks\ncombining\ncontrol\ncontrol status\ndeadline\nduration\neither\nfixed\ngate\nhosts\ninbox\ninclude\nlevel\nlife\nlist\nlist active blocks\nlist block rules\nlist website\nlist_active_blocks\nlist_block_rules\nlive\nmanaged\nmanaged rules\nmessage\nmorning\nnotes\nonly\npermission\npriority\nreport\nrules\nrules gate\nscreen time list active blocks\nscreen_time list active blocks\nself\nself control\nshow active blocks\nshow_active_blocks\nsource\nstate\nstatus\nstatus managed\ntarget\ntarget websites\ntasks list active blocks\ntime\ntodo\ntoggle\ntype\nwebsite\nwebsite blocks\nwebsite blocks status\nwebsite_blocks_status\nwebsites";
                readonly locales: {
                    readonly es: "abrir pagina\naccion\nactivo\nactivo bloquear\naplicacion\napp\nautomatizacion\nautomatizacion listar activo bloquear\nbandeja de entrada\nbloqueador\nbloquear\ncontrolar\ncontrolar estado\ncron\ndisparador\nenfoque\nestado\nfecha limite\nflujo de trabajo\nhacer clic\nherramienta\nlimites de apps\nlistar\nlistar activo bloquear\nlistar bloquear regla\nlistar sitio web\nmensaje\nmonitor\nmostrar\nnavegador\nnavegador listar activo bloquear\npantalla\npantalla listar activo bloquear\npendiente\nrecordatorio\nregla\nseguimiento\nsitio web\nsitio web bloquear\nsitio web bloquear estado\nsolicitud\ntarea\ntarea listar activo bloquear\ntareas\ntiempo de pantalla\ntodo\nuso del dispositivo";
                    readonly ko: "규칙\n기기 사용\n도구\n리마인더\n마감일\n메시지\n모니터\n목록\n목록 웹사이트\n목록 차단 규칙\n목록 활성 차단\n받은편지함\n브라우저\n브라우저 목록 활성 차단\n사용 보고서\n상태\n스크린 타임\n앱\n앱 제한\n요청\n워크플로\n웹사이트\n웹사이트 입력\n웹사이트 차단\n웹사이트 차단 상태\n자동화\n자동화 목록 활성 차단\n작업\n작업 목록 활성 차단\n제어\n제어 상태\n집중\n차단\n차단기\n크론\n클릭\n트리거\n페이지 열기\n할 일\n할일\n화면\n화면 목록 활성 차단\n활성\n활성 차단\n후속 조치";
                    readonly pt: "abrir pagina\nacao\nacompanhamento\nafazer\naplicativo\napp\nativo\nativo bloquear\nautomacao\nautomacao listar ativo bloquear\nbloqueador\nbloquear\ncaixa de entrada\nclicar\ncontrolar\ncontrolar status\ncron\nestado\nferramenta\nfluxo de trabalho\nfoco\ngatilho\nlembrete\nlimites de app\nlistar\nlistar ativo bloquear\nlistar bloquear regra\nlistar site\nmensagem\nmonitor\nmostrar\nnavegador\nnavegador listar ativo bloquear\nprazo\nregra\nsite\nsite bloquear\nsite bloquear status\nsolicitacao\nstatus\ntarefa\ntarefa listar ativo bloquear\ntarefas\ntela\ntela listar ativo bloquear\ntempo de tela\ntodo\nuso do dispositivo";
                    readonly tl: "aksyon\naktibo\naktibo i-block\napp\napp limits\nautomation\nautomation ilista aktibo i-block\nblocker\nbrowser\nbrowser ilista aktibo i-block\nbuksan ang pahina\nclick\ncron\ndeadline\nfocus\nfollow up\ngamit ng device\ngawain\ngawain ilista aktibo i-block\ni-block\nilista\nilista aktibo i-block\nilista i-block panuntunan\nilista website\ninbox\nkahilingan\nkasangkapan\nkontrol\nkontrol status\nmensahe\nmonitor\npaalala\npanuntunan\nscreen\nscreen ilista aktibo i-block\nscreen time\nstatus\ntask\ntodo\ntrigger\nwebsite\nwebsite i-block\nwebsite i-block status\nworkflow";
                    readonly vi: "dang hoat dong\nđang hoạt động\nđang hoạt động chặn\ndieu khien\nđiều khiển\nđiều khiển trạng thái\ngiới hạn ứng dụng\nhop thu\nhộp thư\nkich hoat\nliet ke\nliệt kê\nliệt kê chặn quy tắc\nliệt kê đang hoạt động chặn\nliệt kê trang web\nman hinh\nmàn hình\nmàn hình liệt kê đang hoạt động chặn\nmo trang\nmở trang\nnhắc nhở\nnhiệm vụ liệt kê đang hoạt động chặn\nquy tac\nquy tắc\nquy trinh\nquy trình\ntac vu\ntác vụ\nthoi gian man hinh\nthời gian màn hình\ntin nhan\ntin nhắn\ntrang thai\ntrạng thái\ntrang web\ntrang web chặn trạng thái\ntrinh chan\ntrình chặn\ntrinh duyet\ntrình duyệt\ntrình duyệt liệt kê đang hoạt động chặn\ntu dong hoa\ntự động hóa\ntự động hóa liệt kê đang hoạt động chặn\nung dung\nứng dụng\nviec can lam\nviệc cần làm";
                    readonly "zh-CN": "专注\n任务\n任务 列出 活跃 阻止\n使用报告\n列出\n列出 活跃 阻止\n列出 网站\n列出 阻止 规则\n定时\n屏幕\n屏幕 列出 活跃 阻止\n屏幕时间\n工作流\n工具\n应用\n应用限制\n待办\n截止日期\n打开页面\n拦截器\n控制\n控制 状态\n提醒\n操作\n收件箱\n活跃\n活跃 阻止\n浏览器\n浏览器 列出 活跃 阻止\n消息\n点击\n状态\n监控\n网站\n网站 阻止\n网站 阻止 状态\n网站输入\n自动化\n自动化 列出 活跃 阻止\n规则\n触发器\n设备使用\n请求\n跟进\n阻止";
                };
            };
        };
        readonly listLinearComments: {
            readonly request: {
                readonly base: "automation list linear comments\ncomment\ncomment linear\ncomments\ncomments linear\nconnectors list linear comments\nfetch linear comments\nfetch_linear_comments\nfetch-linear-comments\nget linear comments\nget_linear_comments\nget-linear-comments\nissue\nlinear\nlinear issue\nlist\nlist comment\nlist comments\nlist linear comments\nlist_linear_comments\nshow linear comments\nshow_linear_comments\nshow-linear-comments\ntasks list linear comments";
                readonly locales: {
                    readonly es: "accion\nautomatizacion\nautomatizacion listar linear comentario\ncomentario\ncomentario linear\nconector\nconector listar linear comentario\ncron\ncuenta conectada\ndisparador\nfecha limite\nflujo de trabajo\nherramienta\nincidencia\nintegracion\nlinear\nlinear comentario\nlinear incidencia\nlistar\nlistar comentario\nlistar linear comentario\nmcp\nmonitor\nmostrar\noauth\nobtener\nobtener linear comentario\npendiente\nrecordatorio\nseguimiento\nsolicitud\ntarea\ntarea listar linear comentario\ntareas";
                    readonly ko: "가져오기\n가져오기 리니어 댓글\n계정 연결\n댓글\n댓글 리니어\n도구\n리니어\n리니어 댓글\n리니어 이슈\n리마인더\n마감일\n모니터\n목록\n목록 댓글\n목록 리니어 댓글\n오어스\n요청\n워크플로\n이슈\n자동화\n자동화 목록 리니어 댓글\n작업\n작업 목록 리니어 댓글\n커넥터\n커넥터 목록 리니어 댓글\n크론\n통합\n트리거\n할 일\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\nautomacao\nautomacao listar linear comentario\ncomentario\ncomentario linear\nconector\nconector listar linear comentario\nconta conectada\ncron\nferramenta\nfluxo de trabalho\ngatilho\nintegracao\nissue\nlembrete\nlinear\nlinear comentario\nlinear problema\nlistar\nlistar comentario\nlistar linear comentario\nmcp\nmonitor\nmostrar\noauth\nobter\nobter linear comentario\nprazo\nproblema\nsolicitacao\ntarefa\ntarefa listar linear comentario\ntarefas";
                    readonly tl: "account connection\naksyon\nautomation\nautomation ilista linear komento\nconnector\nconnector ilista linear komento\ncron\ndeadline\nfollow up\ngawain\ngawain ilista linear komento\nilista\nilista komento\nilista linear komento\nintegration\nisyu\nkahilingan\nkasangkapan\nkomento\nkomento linear\nkunin\nkunin linear komento\nlinear\nlinear isyu\nlinear komento\nmonitor\noauth\npaalala\ntask\ntodo\ntrigger\nworkflow";
                    readonly vi: "binh luan\nbình luận\nbình luận linear\ncong cu\ncông cụ\nhanh dong\nhành động\nket noi\nkết nối\nkết nối liệt kê linear bình luận\nkich hoat\nlay\nlấy\nlấy linear bình luận\nliet ke\nliệt kê\nliệt kê bình luận\nliệt kê linear bình luận\nlinear\nlinear bình luận\nlinear vấn đề\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnhiệm vụ liệt kê linear bình luận\noauth\nquy trinh\nquy trình\ntac vu\ntác vụ\ntài khoản\ntich hop\ntích hợp\ntu dong hoa\ntự động hóa\ntự động hóa liệt kê linear bình luận\nvan de\nvấn đề\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "linear\nlinear 评论\nlinear 问题\n任务\n任务 列出 linear 评论\n列出\n列出 linear 评论\n列出 评论\n定时\n工作流\n工具\n待办\n截止日期\n授权\n提醒\n操作\n监控\n自动化\n自动化 列出 linear 评论\n获取\n获取 linear 评论\n触发器\n评论\n评论 linear\n请求\n账号连接\n跟进\n连接器\n连接器 列出 linear 评论\n问题\n集成";
                };
            };
        };
        readonly listOverdueFollowups: {
            readonly request: {
                readonly base: "calendar list overdue followups\ncontacts list overdue followups\nfollowup list\nfollowup_list\nlist followups\nlist overdue followups\nlist_followups\nlist_overdue_followups\nmessaging list overdue followups\noverdue followups\noverdue_followups\ntasks list overdue followups\nwho haven t i talked to\nwho to follow up\nwho_haven_t_i_talked_to\nwho_to_follow_up";
                readonly locales: {
                    readonly es: "accion\namigo\ncalendario\ncalendario listar\ncolega\ncontacto\ncontacto listar\ncontactos\nfecha limite\ngente\nherramienta\nlistar\nmostrar\npendiente\npersona\nrecordatorio\nrelacion\nseguimiento\nseguir\nsolicitud\ntarea\ntarea listar\ntareas";
                    readonly ko: "관계\n도구\n동료\n리마인더\n마감일\n목록\n사람\n연락처\n연락처 목록\n요청\n일정\n작업\n작업 목록\n친구\n캘린더\n캘린더 목록\n팔로우\n할 일\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\namigo\ncalendario\ncalendario listar\ncolega\ncontato\ncontato listar\ncontatos\nferramenta\nlembrete\nlistar\nmostrar\npessoa\npessoas\nprazo\nrelacao\nseguir\nsolicitacao\ntarefa\ntarefa listar\ntarefas";
                    readonly tl: "aksyon\ncontact\ncontact ilista\ncontacts\ndeadline\nfollow up\ngawain\ngawain ilista\nilista\nkahilingan\nkaibigan\nkalendaryo\nkalendaryo ilista\nkasamahan\nkasangkapan\npaalala\nrelasyon\nsundan\ntao\ntask\ntodo";
                    readonly vi: "cong cu\ncông cụ\nhanh dong\nhành động\nlich\nlịch\nlịch liệt kê\nlien he\nliên hệ\nliên hệ liệt kê\nliet ke\nliệt kê\nnguoi\nngười\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnhiệm vụ liệt kê\nquan he\nquan hệ\ntac vu\ntác vụ\ntheo doi\ntheo dõi\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "人物\n任务\n任务 列出\n关注\n关系\n列出\n同事\n工具\n待办\n截止日期\n提醒\n操作\n日历\n日历 列出\n朋友\n联系人\n联系人 列出\n请求\n跟进";
                };
            };
        };
        readonly listTodos: {
            readonly request: {
                readonly base: "agent internal list todos\nagent_internal list todos\ncount\nfiltered\nfiltered status\nget todos\nget_todos\nitems\nitems user\nlimited\nlist\nlist todo\nlist todos\nlist_todos\nmy todos\nmy_todos\noptionally\nshow todos\nshow_todos\nstatus\nstatus limited\ntodo\ntodo items\ntodos list todos\nuser\nuser optionally";
                readonly locales: {
                    readonly es: "accion\nagente\nagente listar todo\nborrar tarea\ncompletar tarea\nestado\nestado interno\ngestion interna\nherramienta\ninterno del agente\nlista de tareas\nlistar\nlistar todo\nmostrar\nobtener\nobtener todo\npendiente\npendientes\nsolicitud\ntarea\ntodo\ntodo listar todo\nusuario";
                    readonly ko: "가져오기\n가져오기 할일\n내부 상태\n도구\n목록\n목록 할일\n사용자\n상태\n에이전트\n에이전트 내부\n에이전트 목록 할일\n요청\n자체 관리\n작업\n작업 목록\n작업 삭제\n작업 완료\n할 일\n할일\n할일 목록 할일\n활성 작업";
                    readonly pt: "acao\nafazer\nafazeres\nagente\nagente listar todo\napagar tarefa\nconcluir tarefa\nestado\nestado interno\nferramenta\ngestao interna\ninterno do agente\nlista de tarefas\nlistar\nlistar todo\nmostrar\nobter\nobter todo\nsolicitacao\nstatus\ntodo\ntodo listar todo\nusuario";
                    readonly tl: "agent\nagent ilista todo\naksyon\nburahin task\ngawain\ngumagamit\nilista\nilista todo\ninternal ng agent\ninternal state\nkahilingan\nkasangkapan\nkumpletuhin task\nkunin\nkunin todo\nsariling pamamahala\nstatus\ntask list\ntodo\ntodo ilista todo\nuser";
                    readonly vi: "cong cu\ncông cụ\ndanh sách tác vụ\nhanh dong\nhành động\nhoàn thành tác vụ\nlay\nlấy\nlấy việc cần làm\nliet ke\nliệt kê\nliệt kê việc cần làm\nnguoi dung\nngười dùng\nnoi bo tac tu\nnội bộ tác tử\ntac tu\ntác tử\ntác tử liệt kê việc cần làm\ntrang thai\ntrạng thái\ntu quan ly\ntự quản lý\nviec can lam\nviệc cần làm\nviệc cần làm liệt kê việc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "代理\n代理 列出 待办\n代理内部\n任务列表\n内部状态\n列出\n列出 待办\n删除任务\n完成任务\n工具\n待办\n待办 列出 待办\n操作\n智能体\n活动任务\n状态\n用户\n自我管理\n获取\n获取 待办\n请求";
                };
            };
        };
        readonly logs: {
            readonly request: {
                readonly base: "admin logs\nagent\nagent internal logs\nagent logs\nagent_internal logs\nbuffer\nchange log level\nchange_log_level\nclear logs\nclear_logs\nclears\nclears that\nconfigure logging\nconfigure_logging\ncontrol\ncontrol search\ndebug\ndebug mode\ndebug_mode\ndelete\ndelete agent\ndelete clears\ndelete logs\ndelete_logs\nempty logs\nempty_logs\nerror\nfilterable\nget logs\nget_logs\ninfo\ninspect logs\ninspect_logs\nlevel\nlevel room\nlog level\nlog_level\nlogs\nlogs level\nlookup logs\nlookup_logs\nmemory\nmemory buffer\nonly\noverrides\noverrides room\nowner\npolymorphic\npolymorphic control\nquery logs\nquery_logs\nread logs\nread_logs\nreset logs\nreset_logs\nroom\nroom level\nroom owner\nsearch\nsearch delete\nsearch logs\nsearch tails\nsearch_logs\nset debug\nset log level\nset_debug\nset_log_level\nsettings logs\nsince\nsince delete\nsource\ntails\ntails memory\nthat\ntrace\nview logs\nview_logs\nwarn\nwipe logs\nwipe_logs";
                readonly locales: {
                    readonly es: "accion\nactivar\nadministrador\nadministrador registros\nagente\nagente registros\najustes\nborrar\nbuscar\nbuscar eliminar\nbuscar registros\nchat\nconfiguracion\nconfigurar\nconsulta\nconsulta registros\ncontrolar\ncontrolar buscar\ndueño\neliminar\neliminar agente\neliminar limpiar\neliminar registros\nestado interno\ngestion interna\nherramienta\ninterno del agente\nleer\nleer registros\nlimpiar\nlimpiar registros\nlogs\nmemoria\nmodelo\nobtener\nobtener registros\npermisos\npolitica\npreferencias\nregistros\nroles\nsala\nsolicitud";
                    readonly ko: "가져오기\n가져오기 로그\n검색\n검색 로그\n검색 삭제\n관리자\n관리자 로그\n구성\n권한\n기억\n내부 상태\n도구\n로그\n모델 설정\n방\n삭제\n삭제 로그\n삭제 에이전트\n삭제 지우기\n설정\n소유자\n에이전트\n에이전트 내부\n에이전트 로그\n역할\n요청\n읽기\n읽기 로그\n자체 관리\n작업\n정책\n제어\n제어 검색\n지우기\n지우기 로그\n질의\n채팅방\n쿼리\n쿼리 로그\n토글\n환경설정";
                    readonly pt: "acao\nadministrador\nadministrador logs\nagente\nagente logs\nalternar\napagar\nbuscar\nbuscar excluir\nbuscar logs\nchat\nconfiguracao\nconfiguracoes\nconfigurar\nconsulta\nconsulta logs\ncontrolar\ncontrolar buscar\ndono\nestado interno\nexcluir\nexcluir agente\nexcluir limpar\nexcluir logs\nferramenta\nfuncoes\ngestao interna\ninterno do agente\nler\nler logs\nlimpar\nlimpar logs\nlogs\nmemoria\nmodelo\nobter\nobter logs\npermissoes\npolitica\npreferencias\nregistros\nsala\nsolicitacao";
                    readonly tl: "admin\nadmin logs\nagent\nagent logs\naksyon\nalaala\nbasahin\nbasahin logs\nburahin\nburahin agent\nburahin linisin\nburahin logs\nconfiguration\ni-configure\ninternal ng agent\ninternal state\nkahilingan\nkasangkapan\nkontrol\nkontrol maghanap\nkunin\nkunin logs\nkuwarto\nlinisin\nlinisin logs\nlogs\nmaghanap\nmaghanap burahin\nmaghanap logs\nmay ari\nmemory\nmodel settings\npahintulot\npatakaran\npreferences\nquery\nquery logs\nrole\nroom\nsariling pamamahala\nsettings\ntoggle";
                    readonly vi: "cai dat\ncài đặt\ncau hinh\ncấu hình\nchu so huu\nchủ sở hữu\ncong cu\ncông cụ\ndieu khien\nđiều khiển\nđiều khiển tìm kiếm\nđọc\nđọc nhật ký\nhanh dong\nhành động\nky uc\nký ức\nlấy nhật ký\nnhat ky\nnhật ký\nnoi bo tac tu\nnội bộ tác tử\nquan tri\nquản trị\nquản trị nhật ký\nquyen\nquyền\ntac tu\ntác tử\ntác tử nhật ký\ntim kiem\ntìm kiếm\ntìm kiếm nhật ký\ntìm kiếm xóa\ntruy van\ntruy vấn\ntruy vấn nhật ký\ntu quan ly\ntự quản lý\ntuy chon\ntùy chọn\nxoa\nxóa\nxóa nhật ký\nxóa tác tử\nxóa xóa\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "代理\n代理 日志\n代理内部\n偏好\n内部状态\n删除\n删除 代理\n删除 日志\n删除 清除\n工具\n开关\n房间\n所有者\n控制\n控制 搜索\n搜索\n搜索 删除\n搜索 日志\n操作\n日志\n智能体\n权限\n查询\n查询 日志\n模型设置\n清除\n清除 日志\n策略\n管理员\n管理员 日志\n聊天室\n自我管理\n获取\n获取 日志\n角色\n记忆\n设置\n请求\n读取\n读取 日志\n配置";
                };
            };
        };
        readonly ls: {
            readonly request: {
                readonly base: "array\nautomation ls\nbash\nbash directory\ncode ls\ndir\ndirectories\ndirectory\ndirs\neach\nentries\nfiles\nfiles each\nfiles second\nfirst\nfirst files\nglob\nglobs\nignore\ninstead\ninstead bash\nlist\nlist dir\nlist directory\nlist entries\nlist_dir\nlisting\nls\nname\npass\npatterns\nsecond\nskip\nsorted\nsupports\nterminal ls\nthen\nthen files\ntrailing";
                readonly locales: {
                    readonly es: "accion\narchivo\nautomatizacion\nbash\ncodigo\ncron\ndepurar\ndisparador\nflujo de trabajo\nherramienta\nimplementar\nlinea de comandos\nlistar\nmonitor\nmostrar\nproceso\nprogramacion\nprueba\nrepositorio\nshell\nsolicitud\nterminal";
                    readonly ko: "구현\n도구\n디버그\n명령줄\n모니터\n목록\n배시\n셸\n요청\n워크플로\n자동화\n작업\n저장소\n코드\n크론\n터미널\n테스트\n트리거\n파일\n프로그래밍\n프로세스";
                    readonly pt: "acao\narquivo\nautomacao\nbash\ncodigo\ncron\ndepurar\nferramenta\nfluxo de trabalho\ngatilho\nimplementar\nlinha de comando\nlistar\nmonitor\nmostrar\nprocesso\nprogramacao\nrepositorio\nshell\nsolicitacao\nterminal\nteste";
                    readonly tl: "aksyon\nautomation\nbash\ncode\ncommand line\ncron\ndebug\nfile\nilista\nipatupad\nkahilingan\nkasangkapan\nmonitor\nprocess\nprogramming\nrepo\nshell\nterminal\ntest\ntrigger\nworkflow";
                    readonly vi: "bash\ncong cu\ncông cụ\ndong lenh\ndòng lệnh\nhanh dong\nhành động\nkho ma\nkho mã\nkich hoat\nkiểm thử\nlap trinh\nlập trình\nliet ke\nliệt kê\nma\nmã\nquy trinh\nquy trình\nshell\ntep\ntệp\nterminal\ntiến trình\ntu dong hoa\ntự động hóa\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "Bash\n仓库\n代码\n列出\n命令行\n定时\n实现\n工作流\n工具\n操作\n文件\n标准输出\n测试\n监控\n终端\n编程\n自动化\n触发器\n请求\n调试\n进程";
                };
            };
        };
        readonly managePlugins: {
            readonly request: {
                readonly base: "admin manage plugins\nclones\nconnectors manage plugins\ncontrol\ncopy\ndetails\ndisable\neject\nejected\nenable\ninstall\ninstalled\ninstalls\nlist\nload\nloaded\nlocal\nlocally\nmanage ejected plugins\nmanage installed plugins\nmanage plugins\nmanage_ejected_plugins\nmanage_installed_plugins\nmanage_plugins\nplugin\nplugin control\nplugin manager\nplugin_control\nplugin_manager\nplugins\npulls\nqueries\nregistered\nregistry\nreinject\nremoves\nreports\nruntime\nsearch\nsettings manage plugins\nshows\nstate\nstatus\nsubaction\nsync\nunified\nunload\nupstream";
                readonly locales: {
                    readonly es: "accion\nactivar\nadministrador\nadministrador gestionar plugin\nadministrar\najustes\nbuscar\ncomplemento\nconector\nconector gestionar plugin\nconfiguracion\nconfiguracion gestionar plugin\nconsulta\ncontrolar\ncuenta conectada\ndesactivar\ndetalles\ndueño\neliminar\nestado\ngestionar\ngestionar plugin\nherramienta\ninstalar\nintegracion\nlistar\nmcp\nmodelo\nmostrar\noauth\npermisos\nplugin\nplugin controlar\npolitica\npreferencias\nquitar\nroles\nsolicitud";
                    readonly ko: "검색\n계정 연결\n관리\n관리 플러그인\n관리자\n관리자 관리 플러그인\n구성\n권한\n도구\n모델 설정\n목록\n비활성화\n상태\n설정\n설정 관리 플러그인\n설치\n세부정보\n소유자\n역할\n오어스\n요청\n작업\n정책\n제거\n제어\n질의\n커넥터\n커넥터 관리 플러그인\n쿼리\n토글\n통합\n플러그인\n플러그인 제어\n환경설정\n활성화";
                    readonly pt: "acao\nadministrador\nadministrador gerenciar plugin\nalternar\nativar\nbuscar\nconector\nconector gerenciar plugin\nconfiguracao\nconfiguracoes\nconfiguracoes gerenciar plugin\nconsulta\nconta conectada\ncontrolar\ndesativar\ndetalhes\ndono\nestado\nferramenta\nfuncoes\ngerenciar\ngerenciar plugin\ninstalar\nintegracao\nlistar\nmcp\nmodelo\nmostrar\noauth\npermissoes\nplugin\nplugin controlar\npolitica\npreferencias\nremover\nsolicitacao\nstatus";
                    readonly tl: "account connection\nadmin\nadmin pamahalaan plugin\naksyon\nalisin\nconfiguration\nconnector\nconnector pamahalaan plugin\ndetalye\ni-disable\ni-enable\ni-install\nilista\nintegration\nkahilingan\nkasangkapan\nkontrol\nmaghanap\nmay ari\nmodel settings\noauth\npahintulot\npamahalaan\npamahalaan plugin\npatakaran\nplugin\nplugin kontrol\npreferences\nquery\nrole\nsettings\nsettings pamahalaan plugin\nstatus\ntoggle";
                    readonly vi: "bat\nbật\ncai dat\ncài đặt\ncài đặt quản lý plugin\ncấu hình\nchi tiet\nchi tiết\nchu so huu\nchủ sở hữu\ncong cu\ncông cụ\ndieu khien\nđiều khiển\ngỡ\nhanh dong\nhành động\nket noi\nkết nối\nkết nối quản lý plugin\nliet ke\nliệt kê\noauth\nplugin\nplugin điều khiển\nquan ly\nquản lý\nquản lý plugin\nquan tri\nquản trị\nquản trị quản lý plugin\nquyen\nquyền\ntài khoản\ntat\ntắt\ntich hop\ntích hợp\ntim kiem\ntìm kiếm\ntrang thai\ntrạng thái\ntruy van\ntruy vấn\ntuy chon\ntùy chọn\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "偏好\n列出\n启用\n安装\n工具\n开关\n所有者\n授权\n控制\n插件\n插件 控制\n搜索\n操作\n权限\n查询\n模型设置\n状态\n禁用\n移除\n策略\n管理\n管理 插件\n管理员\n管理员 管理 插件\n角色\n设置\n设置 管理 插件\n详情\n请求\n账号连接\n连接器\n连接器 管理 插件\n配置\n集成";
                };
            };
        };
        readonly manageRouting: {
            readonly request: {
                readonly base: "assignment\nassignments\naudio\naudio rout\naudio routing\nautomation manage routing\nindependent mode\nindependent_mode\nmanage\nmanage audio\nmanage routing\nmanage_routing\nmedia manage routing\nmode\nmodes\nrout\nroute audio\nroute to\nroute_audio\nroute_to\nrouting\nset mode\nset routing mode\nset_mode\nset_routing_mode\nsettings manage routing\nsimulcast to\nsimulcast_to\nstop routing\nstop_routing";
                readonly locales: {
                    readonly es: "accion\nactivar\nadministrar\najustes\naudio\nautomatizacion\nautomatizacion gestionar\ncaptura\nconfiguracion\nconfiguracion gestionar\ncron\ndetener\ndisparador\nflujo de trabajo\ngestionar\ngestionar audio\nherramienta\nimagen\nmodelo\nmonitor\nmultimedia\nmultimedia gestionar\nparar\npreferencias\nsolicitud\ntranscripcion\nvideo";
                    readonly ko: "관리\n관리 오디오\n구성\n도구\n모니터\n모델 설정\n미디어\n미디어 관리\n비디오\n설정\n설정 관리\n스크린샷\n오디오\n요청\n워크플로\n이미지\n자동화\n자동화 관리\n작업\n전사\n중지\n크론\n토글\n트리거\n환경설정";
                    readonly pt: "acao\nalternar\naudio\nautomacao\nautomacao gerenciar\ncaptura\nconfiguracao\nconfiguracoes\nconfiguracoes gerenciar\ncron\nferramenta\nfluxo de trabalho\ngatilho\ngerenciar\ngerenciar audio\nimagem\nmidia\nmidia gerenciar\nmodelo\nmonitor\nparar\npreferencias\nsolicitacao\ntranscricao\nvideo";
                    readonly tl: "aksyon\naudio\nautomation\nautomation pamahalaan\nconfiguration\ncron\nitigil\nkahilingan\nkasangkapan\nlarawan\nmedia\nmedia pamahalaan\nmodel settings\nmonitor\npamahalaan\npamahalaan audio\npreferences\nscreenshot\nsettings\nsettings pamahalaan\ntoggle\ntranscript\ntrigger\nvideo\nworkflow";
                    readonly vi: "am thanh\nâm thanh\ncai dat\ncài đặt\ncài đặt quản lý\ncấu hình\ncong cu\ncông cụ\nda phuong tien\nđa phương tiện\nđa phương tiện quản lý\ndung\ndừng\nhanh dong\nhành động\nhinh anh\nhình ảnh\nkich hoat\nquan ly\nquản lý\nquản lý âm thanh\nquy trinh\nquy trình\ntu dong hoa\ntự động hóa\ntự động hóa quản lý\ntuy chon\ntùy chọn\nvideo\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "偏好\n停止\n图片\n媒体\n媒体 管理\n定时\n工作流\n工具\n开关\n截图\n操作\n模型设置\n监控\n视频\n管理\n管理 音频\n自动化\n自动化 管理\n触发器\n设置\n设置 管理\n请求\n转录\n配置\n音频";
                };
            };
        };
        readonly manageSecret: {
            readonly request: {
                readonly base: "check secret\ncheck_secret\nconnectors manage secret\ndelete\ndelete list\ndelete secret\ndelete_secret\nget\nget delete\nget secret\nget_secret\nhandle secret\nhandle_secret\nlevels\nlist\nlist secrets\nlist_secrets\nmanage\nmanage secret\nmanage secrets\nmanage_secret\nsecret management\nsecret operation\nsecret_management\nsecret_operation\nsecrets\nsecrets get\nsecrets manage secret\nsecrets various\nsettings manage secret\nvarious";
                readonly locales: {
                    readonly es: "accion\nactivar\nadministrar\najustes\nborrar\nclave api\nclave secreta\ncomprobar\nconector\nconector gestionar secreto\nconfiguracion\nconfiguracion gestionar secreto\ncontraseña\ncredencial\ncuenta conectada\neliminar\neliminar listar\neliminar secreto\ngestion\ngestionar\ngestionar secreto\nherramienta\nintegracion\nlistar\nlistar secreto\nmanejar\nmanejar secreto\nmcp\nmodelo\nmostrar\noauth\nobtener\nobtener eliminar\nobtener secreto\noperacion\npreferencias\nrevisar\nrevisar secreto\nsecreto\nsecreto gestion\nsecreto gestionar secreto\nsecreto obtener\nsecreto operacion\nsecretos\nsolicitud\ntoken";
                    readonly ko: "api 키\n가져오기\n가져오기 비밀\n가져오기 삭제\n계정 연결\n관리\n관리 비밀\n구성\n도구\n모델 설정\n목록\n목록 비밀\n비밀\n비밀 가져오기\n비밀 관리\n비밀 관리 비밀\n비밀 작업\n비밀번호\n삭제\n삭제 목록\n삭제 비밀\n설정\n설정 관리 비밀\n시크릿\n오어스\n요청\n자격 증명\n작업\n처리\n처리 비밀\n커넥터\n커넥터 관리 비밀\n토글\n토큰\n통합\n확인\n확인 비밀\n환경설정";
                    readonly pt: "acao\nalternar\napagar\nchave api\nconector\nconector gerenciar segredo\nconfiguracao\nconfiguracoes\nconfiguracoes gerenciar segredo\nconta conectada\ncredencial\nexcluir\nexcluir listar\nexcluir segredo\nferramenta\ngerenciamento\ngerenciar\ngerenciar segredo\nintegracao\nlidar\nlidar segredo\nlistar\nlistar segredo\nmcp\nmodelo\nmostrar\noauth\nobter\nobter excluir\nobter segredo\noperacao\npreferencias\nsegredo\nsegredo gerenciamento\nsegredo gerenciar segredo\nsegredo obter\nsegredo operacao\nsegredos\nsenha\nsolicitacao\ntoken\nverificar\nverificar segredo";
                    readonly tl: "account connection\naksyon\napi key\nburahin\nburahin ilista\nburahin secret\nconfiguration\nconnector\nconnector pamahalaan secret\ncredential\nhawakan\nhawakan secret\nilista\nilista secret\nintegration\nkahilingan\nkasangkapan\nkunin\nkunin burahin\nkunin secret\nmodel settings\noauth\noperasyon\npamahalaan\npamahalaan secret\npamamahala\npassword\npreferences\nsecret\nsecret kunin\nsecret operasyon\nsecret pamahalaan secret\nsecret pamamahala\nsettings\nsettings pamahalaan secret\nsuriin\nsuriin secret\ntoggle\ntoken";
                    readonly vi: "bi mat\nbí mật\nbí mật lấy\nbí mật quản lý\nbí mật quản lý bí mật\nbí mật thao tác\ncai dat\ncài đặt\ncài đặt quản lý bí mật\ncấu hình\ncong cu\ncông cụ\nhanh dong\nhành động\nket noi\nkết nối\nkết nối quản lý bí mật\nkhoa api\nkhóa api\nkiem tra\nkiểm tra\nkiểm tra bí mật\nlấy\nlấy bí mật\nlấy xóa\nliet ke\nliệt kê\nliệt kê bí mật\nmật khẩu\noauth\nquan ly\nquản lý\nquản lý bí mật\ntài khoản\nthao tac\nthao tác\ntich hop\ntích hợp\ntoken\ntuy chon\ntùy chọn\nxóa bí mật\nxóa liệt kê\nxu ly\nxử lý\nxử lý bí mật\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "API 密钥\n令牌\n偏好\n凭据\n列出\n列出 密钥\n删除\n删除 列出\n删除 密钥\n处理\n处理 密钥\n密码\n密钥\n密钥 操作\n密钥 管理\n密钥 管理 密钥\n密钥 获取\n工具\n开关\n授权\n操作\n检查\n检查 密钥\n模型设置\n秘密\n管理\n管理 密钥\n获取\n获取 删除\n获取 密钥\n设置\n设置 管理 密钥\n请求\n账号连接\n连接器\n连接器 管理 密钥\n配置\n集成";
                };
            };
        };
        readonly manageZones: {
            readonly request: {
                readonly base: "add to zone\nadd_to_zone\naudio\naudio zone\naudio zones\nautomation manage zones\ncreate zone\ncreate_zone\ndelete zone\ndelete_zone\nlist zones\nlist_zones\nmanage\nmanage audio\nmanage zones\nmanage_zones\nmedia manage zones\nmulti\nremove from zone\nremove_from_zone\nrout\nrouting\nsettings manage zones\nshow zones\nshow_zones\nvoice\nzone\nzone multi\nzones\nzones multi";
                readonly locales: {
                    readonly es: "accion\nactivar\nadministrar\nagregar\nagregar zona\najustes\nanadir\naudio\naudio zona\nautomatizacion\nautomatizacion gestionar zona\nborrar\ncaptura\nconfiguracion\nconfiguracion gestionar zona\ncrear\ncrear zona\ncron\ndisparador\neliminar\neliminar zona\nflujo de trabajo\ngestionar\ngestionar audio\ngestionar zona\nherramienta\nimagen\nlistar\nlistar zona\nmodelo\nmonitor\nmostrar\nmultimedia\nmultimedia gestionar zona\npreferencias\nquitar\nsolicitud\ntranscripcion\nvideo\nzona";
                    readonly ko: "관리\n관리 구역\n관리 오디오\n구성\n구역\n도구\n모니터\n모델 설정\n목록\n목록 구역\n미디어\n미디어 관리 구역\n비디오\n삭제\n삭제 구역\n생성\n생성 구역\n설정\n설정 관리 구역\n스크린샷\n오디오\n오디오 구역\n요청\n워크플로\n이미지\n자동화\n자동화 관리 구역\n작업\n전사\n제거\n제거 구역\n추가\n추가 구역\n크론\n토글\n트리거\n환경설정";
                    readonly pt: "acao\nadicionar\nadicionar zona\nalternar\napagar\naudio\naudio zona\nautomacao\nautomacao gerenciar zona\ncaptura\nconfiguracao\nconfiguracoes\nconfiguracoes gerenciar zona\ncriar\ncriar zona\ncron\nexcluir\nexcluir zona\nferramenta\nfluxo de trabalho\ngatilho\ngerenciar\ngerenciar audio\ngerenciar zona\nimagem\nlistar\nlistar zona\nmidia\nmidia gerenciar zona\nmodelo\nmonitor\nmostrar\npreferencias\nremover\nremover zona\nsolicitacao\ntranscricao\nvideo\nzona";
                    readonly tl: "aksyon\nalisin\nalisin zone\naudio\naudio zone\nautomation\nautomation pamahalaan zone\nburahin\nburahin zone\nconfiguration\ncron\ngumawa\ngumawa zone\nidagdag\nidagdag zone\nilista\nilista zone\nkahilingan\nkasangkapan\nlarawan\nmedia\nmedia pamahalaan zone\nmodel settings\nmonitor\npamahalaan\npamahalaan audio\npamahalaan zone\npreferences\nscreenshot\nsettings\nsettings pamahalaan zone\ntoggle\ntranscript\ntrigger\nvideo\nworkflow\nzone";
                    readonly vi: "am thanh\nâm thanh\nâm thanh vùng\ncai dat\ncài đặt\ncài đặt quản lý vùng\ncấu hình\ncong cu\ncông cụ\nda phuong tien\nđa phương tiện\nđa phương tiện quản lý vùng\ngo\ngỡ\ngỡ vùng\nhanh dong\nhành động\nhinh anh\nhình ảnh\nkich hoat\nliet ke\nliệt kê\nliệt kê vùng\nquan ly\nquản lý\nquản lý âm thanh\nquản lý vùng\nquy trinh\nquy trình\ntao\ntạo\ntạo vùng\nthem\nthêm\nthêm vùng\ntu dong hoa\ntự động hóa\ntự động hóa quản lý vùng\ntuy chon\ntùy chọn\nvideo\nvung\nvùng\nxoa\nxóa\nxóa vùng\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "偏好\n列出\n列出 区域\n创建\n创建 区域\n删除\n删除 区域\n区域\n图片\n媒体\n媒体 管理 区域\n定时\n工作流\n工具\n开关\n截图\n操作\n模型设置\n添加\n添加 区域\n监控\n视频\n移除\n移除 区域\n管理\n管理 区域\n管理 音频\n自动化\n自动化 管理 区域\n触发器\n设置\n设置 管理 区域\n请求\n转录\n配置\n音频\n音频 区域";
                };
            };
        };
        readonly markFollowupDone: {
            readonly request: {
                readonly base: "calendar mark followup done\ncontacted\ncontacts mark followup done\nfollowed up\nfollowed_up\nfollowup done\nfollowup_done\nmark contacted\nmark followup done\nmark_contacted\nmark_followup_done\nmessaging mark followup done\nrecord interaction\nrecord_interaction\ntasks mark followup done";
                readonly locales: {
                    readonly es: "accion\namigo\ncalendario\ncolega\ncontacto\ncontactos\nfecha limite\ngente\nherramienta\npendiente\npersona\nrecordatorio\nrelacion\nseguimiento\nsolicitud\ntarea\ntareas";
                    readonly ko: "관계\n도구\n동료\n리마인더\n마감일\n사람\n연락처\n요청\n일정\n작업\n친구\n캘린더\n할 일\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\namigo\ncalendario\ncolega\ncontato\ncontatos\nferramenta\nlembrete\npessoa\npessoas\nprazo\nrelacao\nsolicitacao\ntarefa\ntarefas";
                    readonly tl: "aksyon\ncontact\ncontacts\ndeadline\nfollow up\ngawain\nkahilingan\nkaibigan\nkalendaryo\nkasamahan\nkasangkapan\npaalala\nrelasyon\ntao\ntask\ntodo";
                    readonly vi: "cong cu\ncông cụ\nhanh dong\nhành động\nlich\nlịch\nlien he\nliên hệ\nnguoi\nngười\nnhắc nhở\nnhiem vu\nnhiệm vụ\nquan he\nquan hệ\ntac vu\ntác vụ\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "人物\n任务\n关系\n同事\n工具\n待办\n截止日期\n提醒\n操作\n日历\n朋友\n联系人\n请求\n跟进";
                };
            };
        };
        readonly mcp: {
            readonly request: {
                readonly base: "accept\naccept search\naccess mcp resource\naccess resource\naccess_mcp_resource\naccess_resource\nactions\nactions connected\nactions discovers\nactions list\nalso\nautomation mcp\ncall\ncall mcp tool\ncall tool\ncall_mcp_tool\ncloud\nconnected\nconnected services\nconnected_services\nconnections\nconnections lists\nconnectors mcp\ndiscover actions\ndiscover tools\ndiscover_actions\ndiscover_tools\ndiscovers\ndiscovers tool\nentry\nexecute mcp tool\nexecute tool\nfetch mcp resource\nfetch resource\nfetch_mcp_resource\nfetch_resource\nfiles mcp\nfind actions\nfind tools\nfind_actions\nfind_tools\ngeneral mcp\nget connections\nget mcp resource\nget resource\nget_connections\nget_mcp_resource\nget_resource\ninvoke\ninvoke mcp tool\ninvoke tool\nknowledge mcp\nlist\nlist connections\nlist_connections\nlists\nlists oauth\nlookup actions\nlookup_actions\nmcp\nmcp action\nmcp router\nmcp_action\nmy connections\noauth\noauth connections\nplatforms\nplatforms list\npoint\npoint call\npoint read\nread\nread mcp resource\nread resource\nreads\nreads resource\nresource\nresource cloud\nresource read\nresource reads\nresource search\nrun mcp tool\nrun tool\nruntimes\nsearch\nsearch actions\nsearch tools\nshow connections\nsingle\ntool\ntool actions\ntool invoke\ntool read\nuse mcp\nuse mcp tool\nuse tool";
                readonly locales: {
                    readonly es: "accion listar\narchivo\narchivo mcp\narchivos\nautomatizacion\nautomatizacion mcp\nbuscar\nbuscar accion\nbuscar herramienta\ncarpeta\nchat general\nconector\nconector mcp\nconocimiento\nconocimiento mcp\nconversacion\ncron\ncuenta conectada\ndirectorio\ndisparador\nejecutar herramienta\nejecutar mcp herramienta\nflujo de trabajo\ngeneral mcp\nhablar\nhechos guardados\nherramienta accion\nherramienta leer\nintegracion\nleer archivo\nleer mcp recurso\nleer recurso\nlistar oauth\nllamar herramienta\nllamar mcp herramienta\nmcp\nmcp accion\nmcp herramienta\nmcp recurso\nmonitor\nnotas guardadas\noauth\nobtener mcp recurso\nobtener recurso\nrecordar\nrecurso buscar\nrecurso leer\nrespuesta";
                    readonly ko: "mcp 도구\nmcp 리소스\nmcp 작업\n가져오기 mcp 리소스\n가져오기 리소스\n검색\n검색 도구\n검색 작업\n계정 연결\n답변\n도구 읽기\n도구 작업\n리소스 검색\n리소스 읽기\n말하기\n모니터\n목록 oauth\n실행 mcp 도구\n실행 도구\n오어스\n워크플로\n일반 mcp\n일반 대화\n읽기 mcp 리소스\n읽기 리소스\n자동화\n자동화 mcp\n작업 목록\n저장된 노트\n저장된 사실\n지식\n지식 mcp\n찾기 도구\n찾기 작업\n채팅\n커넥터\n커넥터 mcp\n크론\n통합\n통화 mcp 도구\n통화 도구\n트리거\n파일\n파일 mcp\n파일 쓰기\n파일 읽기\n폴더\n회상";
                    readonly pt: "acao listar\narquivo\narquivo mcp\narquivos\nautomacao\nautomacao mcp\nbuscar acao\nbuscar ferramenta\nchat geral\nconector\nconector mcp\nconhecimento\nconhecimento mcp\nconta conectada\nconversa\ncron\nencontrar acao\nencontrar ferramenta\nexecutar ferramenta\nexecutar mcp ferramenta\nfalar\nfatos salvos\nferramenta acao\nferramenta ler\nfluxo de trabalho\ngatilho\ngeral mcp\nintegracao\nlembrar\nler arquivo\nler mcp recurso\nler recurso\nligar ferramenta\nligar mcp ferramenta\nlistar oauth\nmcp\nmcp acao\nmcp ferramenta\nmcp recurso\nmonitor\nnotas salvas\noauth\nobter mcp recurso\nobter recurso\npasta\nrecurso buscar\nrecurso ler\nresposta";
                    readonly tl: "account connection\naksyon ilista\nalalahanin\nautomation\nautomation mcp\nbasahin file\nbasahin mcp resource\nbasahin resource\nconnector\nconnector mcp\ncron\ndirectory\nfile\nfile mcp\nfiles\nfolder\ngeneral chat\nhanapin aksyon\nhanapin tool\nilista oauth\nintegration\nkaalaman\nkaalaman mcp\nkunin mcp resource\nkunin resource\nmaghanap aksyon\nmaghanap tool\nmakipag-usap\nmcp aksyon\nmcp resource\nmcp tool\nmonitor\noauth\npangkalahatan mcp\npatakbuhin mcp tool\npatakbuhin tool\nresource basahin\nresource maghanap\nsagot\nsaved facts\nsaved notes\ntawag mcp tool\ntawag tool\ntool aksyon\ntool basahin\ntrigger\nusap\nworkflow";
                    readonly vi: "cong cu\ncông cụ\nđọc mcp tài nguyên\nđọc tài nguyên\ndoc tep\nđọc tệp\nghi chu da luu\nghi chú đã lưu\ngọi công cụ\ngọi mcp công cụ\nhanh dong\nhành động\nket noi\nkết nối\nkich hoat\nkien thuc\nkiến thức\nlấy mcp tài nguyên\nlấy tài nguyên\nliet ke\nliệt kê\nmcp hành động\nmcp tài nguyên\nnhớ lại\nnói chuyện\nquy trinh\nquy trình\ntài khoản\ntai nguyen\ntài nguyên\nthu muc\nthư mục\ntich hop\ntích hợp\ntìm công cụ\ntìm hành động\ntim kiem\ntìm kiếm\ntìm kiếm công cụ\ntìm kiếm hành động\ntra loi\ntrả lời\ntro chuyen\ntrò chuyện\ntu dong hoa\ntự động hóa\nuy quyen\nủy quyền";
                    readonly "zh-CN": "mcp 工具\nmcp 操作\nmcp 资源\n列出 oauth\n回复\n回忆\n回答\n定时\n对话\n工作流\n工具 操作\n工具 读取\n已保存事实\n已保存笔记\n执行 mcp 工具\n执行 工具\n授权\n搜索 工具\n搜索 操作\n操作 列出\n文件\n文件 mcp\n文件夹\n普通聊天\n查找 工具\n查找 操作\n监控\n知识\n知识 mcp\n自动化\n自动化 mcp\n获取 mcp 资源\n获取 资源\n触发器\n语义搜索\n读取 mcp 资源\n读取 资源\n账号连接\n资源 搜索\n资源 读取\n运行 mcp 工具\n运行 工具\n连接器\n连接器 mcp\n通用 mcp\n通话 mcp 工具\n通话 工具\n集成";
                };
            };
        };
        readonly memory: {
            readonly request: {
                readonly base: "agent\nagent internal memory\nagent memory\nagent_internal memory\nbrowse memories\nbrowse_memories\nconfirm\ncreate\ncreate memory\ncreate search\ncreate stores\ncreate_memory\ndelete\ndelete memory\ndelete removes\ndelete require\ndelete update\ndelete_memory\ndocuments memory\nedit memory\nedit_memory\nedits\nedits text\nembeds\nentity\nentity room\nfilter memories\nfilter_memories\nfilters\nfind memories\nfind_memories\nforget memory\nforget_memory\nmanage\nmanage agent\nmemorize\nmemory\nmemory create\nmemory memory\nmemory records\nmemory requires\nmemory search\nmodify memory\nmodify_memory\nquery\nquery update\nrecall memory filtered\nrecall_memory_filtered\nrecords\nrecords create\nremember this\nremember_this\nremove memory\nremove_memory\nremoves\nremoves memory\nrequire\nrequires\nroom\nroom query\nsave memory\nsave_memory\nsearch\nsearch filters\nsearch memories\nsearch update\nsearch_memories\nstore memory\nstore_memory\nstores\nstores memory\ntext\ntrue\ntrue delete\ntype\nupdate\nupdate delete\nupdate edits\nupdate memory\nupdate_memory\nwrite memory\nwrite_memory";
                readonly locales: {
                    readonly es: "actualizar\nactualizar editar\nactualizar eliminar\nactualizar memoria\nagente\nagente memoria\narchivo\nborrar\nbuscar\nbuscar actualizar\nbuscar memoria\nchat\nconsulta actualizar\ncrear\ncrear buscar\ncrear memoria\ncrear tienda\ndocumento\ndocumento memoria\ndocumentos\neditar\neditar memoria\neliminar\neliminar actualizar\neliminar eliminar\neliminar memoria\nencontrar\nescribir\nescribir memoria\nestado interno\ngestion interna\ngestionar\ngestionar agente\nguardar memoria\nguardar notas\ninterno del agente\nmemoria\nmemoria buscar\nmemoria crear\nmemoria memoria\nnotas\nquitar\nrecordar\nrecuerdo\nsala\nsala consulta\ntienda\ntienda memoria";
                    readonly ko: "검색\n검색 기억\n검색 업데이트\n관리 에이전트\n기억\n기억 검색\n기억 기억\n기억 생성\n기억해\n내부 상태\n노트\n문서\n문서 기억\n방\n방 쿼리\n삭제\n삭제 기억\n삭제 업데이트\n삭제 제거\n상점\n상점 기억\n생성\n생성 검색\n생성 기억\n생성 상점\n스토어\n쓰기\n쓰기 기억\n업데이트\n업데이트 기억\n업데이트 삭제\n업데이트 편집\n에이전트\n에이전트 기억\n에이전트 내부\n자체 관리\n장기 기억\n저장\n제거\n제거 기억\n찾기\n찾기 기억\n채팅방\n쿼리 업데이트\n파일 내용\n편집\n편집 기억\n회상";
                    readonly pt: "agente\nagente memoria\napagar\narquivo\natualizar\natualizar editar\natualizar excluir\natualizar memoria\nbuscar\nbuscar atualizar\nbuscar memoria\nconsulta atualizar\ncriar\ncriar buscar\ncriar loja\ncriar memoria\ndocumento\ndocumento memoria\ndocumentos\neditar\neditar memoria\nencontrar\nencontrar memoria\nescrever\nescrever memoria\nestado interno\nexcluir\nexcluir atualizar\nexcluir memoria\nexcluir remover\ngerenciar agente\ngestao interna\ninterno do agente\nlembrar\nloja\nloja memoria\nmemoria\nmemoria buscar\nmemoria criar\nmemoria memoria\nnotas\nrecordar\nremover\nremover memoria\nsala\nsala consulta\nsalvar memoria\nsalvar notas";
                    readonly tl: "agent\nagent memory\nalaala\nalalahanin\nalisin\nalisin memory\nburahin\nburahin alisin\nburahin i-update\nburahin memory\ndokumento\ndokumento memory\ngumawa\ngumawa maghanap\ngumawa memory\ngumawa tindahan\nhanapin\nhanapin memory\ni-edit\ni-edit memory\ni-save\ni-update\ni-update burahin\ni-update i-edit\ni-update memory\ninternal ng agent\ninternal state\nisulat\nisulat memory\nkuwarto\nlong term memory\nmaghanap\nmaghanap i-update\nmaghanap memory\nmemory\nmemory gumawa\nmemory maghanap\nmemory memory\nnilalaman ng file\nnotes\npamahalaan agent\nquery i-update\nroom\nroom query\nsariling pamamahala\ntandaan\ntindahan\ntindahan memory";
                    readonly vi: "cap nhat\ncập nhật\ncập nhật ký ức\nchinh sua\nchỉnh sửa\nchỉnh sửa ký ức\ncua hang\ncửa hàng\ncửa hàng ký ức\nghi chu\nghi chú\nghi nho\nghi nhớ\ngỡ ký ức\nky uc\nký ức\nký ức ký ức\nký ức tạo\nký ức tìm kiếm\nlưu ghi chú\nnoi bo tac tu\nnội bộ tác tử\nphòng truy vấn\nquan ly\nquản lý\nquản lý tác tử\ntac tu\ntác tử\ntác tử ký ức\ntai lieu\ntài liệu\ntài liệu ký ức\ntạo cửa hàng\ntạo ký ức\ntạo tìm kiếm\ntim kiem\ntìm kiếm\ntìm kiếm ký ức\ntìm ký ức\ntruy van\ntruy vấn\ntruy vấn cập nhật\ntu quan ly\ntự quản lý\nviết ký ức\nxóa cập nhật\nxóa gỡ\nxóa ký ức";
                    readonly "zh-CN": "代理\n代理 记忆\n代理内部\n保存笔记\n内部状态\n写入\n写入 记忆\n创建\n创建 商店\n创建 搜索\n创建 记忆\n删除\n删除 更新\n删除 移除\n删除 记忆\n商店\n商店 记忆\n回忆\n房间\n房间 查询\n搜索\n搜索 更新\n搜索 记忆\n文件内容\n文档\n文档 记忆\n智能体\n更新\n更新 删除\n更新 编辑\n更新 记忆\n查找\n查找 记忆\n查询 更新\n移除\n移除 记忆\n笔记\n管理 代理\n编辑\n编辑 记忆\n聊天室\n自我管理\n记住\n记忆\n记忆 创建\n记忆 搜索\n记忆 记忆\n长期记忆";
                };
            };
        };
        readonly message: {
            readonly request: {
                readonly base: "add remove\narchive message\narchive trash\nasks draft\nasks send\nautomation message\nblock sender\nblock target\ncalendar message\ncheck in draft\ncheck message\ncompose draft\ncompose followup\ncompose message\ncompose reply\nconfirm and send\nconfirmed message\nconnectors message\ncontact chosen\ncontacts message\ncross channel search\ndefer send\ndirect message\ndispatch draft\ndocuments message\ndraft follow\ndraft message reply\ndraft policy\ndraft reply\ndrafts reply\nemail finance\nemail message\nemail sarah\nexisting message\nfind message\nfollow check\nfollowup draft\ngate send\nhints draft\ninbox everything\ninbox needs\nlabel mute\nlast email\nlatest email\nlist messages\nlist unread\nmark read\nmessage contact\nmessage known\nmessage latest\nmessage reply\nmessage sender\nmessage step\nmessage user\nmessaging message\nmute unsubscribe\none shot reply\nonly list\noutbound message\npass message\nprioritize messages\nquick reply\nrank inbox\nread label\nread only\nread unread\nrecency user\nreply existing\nreply inbox\nreply including\nreply message\nreply only\nreply target\nreply then\nreply to message\nreply worthy\nrequests message\nrespond reply\nscan messages\nschedule send\nsearch chats\nsearch email\nsearch inbox\nsend later\nsend respond\nsender archive\nshow unread across\nsingle message\nstep user\ntag message\ntarget message\ntasks message\nunread add\nunsubscribe block\nuser asks\nwhat inbox";
                readonly locales: {
                    readonly es: "agregar eliminar\narchivar mensaje\nautomatizacion mensaje\nbandeja\nbandeja de entrada\nborrador enviar\nborrador mensaje responder\nborrador responder\nborrador seguir\nbuscar bandeja de entrada\nbuscar chat\nbuscar correo\nbuscar mensaje\ncalendario mensaje\nconector mensaje\ncontacto mensaje\ncorreo\ncorreo mensaje\ncrear enviar\ncuenta conectada\ndiscord correo\ndocumento mensaje\nenviar correo\nenviar enviar\nenviar solicitud\nenviar telegram\nfecha limite\nflujo de trabajo\nguardar notas\nlistar mensaje\nmensaje borrador\nmensaje contacto\nmensaje enviar\nmensaje responder\nmensaje usuario\npreguntar borrador\npreguntar enviar\nprogramar borrador\nprogramar enviar\nredactar correo\nresponder bandeja de entrada\nresponder enviar\nresponder mensaje\nrevisar borrador\nrevisar mensaje\nseguir revisar\ntelegram mensaje\nusuario preguntar";
                    readonly ko: "discord 이메일\ntelegram 메시지\n검색 받은편지함\n검색 이메일\n검색 채팅\n계정 연결\n답장 메시지\n답장 받은편지함\n답장 보내기\n메시지 답장\n메시지 보내기\n메시지 사용자\n메시지 연락처\n메시지 초안\n메일 보내기\n메일함\n목록 메시지\n문서 메시지\n받은편지함\n보관 메시지\n보내기 telegram\n보내기 보내기\n보내기 요청\n사용자 질문\n생성 보내기\n연락처\n연락처 메시지\n예약 보내기\n예약 초안\n이메일\n이메일 메시지\n자동화 메시지\n질문 보내기\n질문 초안\n찾기 메시지\n초안 답장\n초안 메시지 답장\n초안 보내기\n초안 팔로우\n추가 제거\n캘린더 메시지\n커넥터 메시지\n파일 내용\n팔로우 확인\n할 일\n확인 메시지\n확인 초안\n후속 조치";
                    readonly pt: "adicionar remover\nagendar enviar\nagendar rascunho\narquivar mensagem\nautomacao mensagem\nbuscar caixa de entrada\nbuscar chat\nbuscar email\ncaixa de entrada\ncalendario mensagem\nconector mensagem\nconta conectada\ncontato mensagem\ncontatos\ncorreio\ncriar enviar\ndiscord email\ndocumento mensagem\nemail\nemail mensagem\nencontrar mensagem\nenviar email\nenviar enviar\nenviar solicitacao\nenviar telegram\nfluxo de trabalho\nlistar mensagem\nmensagem contato\nmensagem enviar\nmensagem rascunho\nmensagem responder\nmensagem usuario\nperguntar enviar\nperguntar rascunho\npessoa\nrascunho enviar\nrascunho mensagem responder\nrascunho responder\nrascunho seguir\nresponder caixa de entrada\nresponder enviar\nresponder mensagem\nsalvar notas\nseguir verificar\ntelegram mensagem\nusuario perguntar\nverificar mensagem\nverificar rascunho";
                    readonly tl: "account connection\nautomation mensahe\nconnector mensahe\ncontact mensahe\ncontacts\ndiscord email\ndokumento mensahe\ndraft ipadala\ndraft mensahe sagot\ndraft sagot\ndraft sundan\nemail\nemail mensahe\nfollow up\ngumawa ipadala\ngumawa ng email\nhanapin mensahe\ni-archive mensahe\ni-schedule draft\ni-schedule ipadala\nidagdag alisin\nilista mensahe\ninbox\nipadala ipadala\nipadala kahilingan\nipadala telegram\nkalendaryo mensahe\nmaghanap chat\nmaghanap email\nmaghanap inbox\nmagpadala ng email\nmagtanong draft\nmagtanong ipadala\nmensahe contact\nmensahe draft\nmensahe ipadala\nmensahe sagot\nmensahe user\nnilalaman ng file\nsagot inbox\nsagot ipadala\nsagot mensahe\nsundan suriin\nsuriin draft\nsuriin mensahe\ntao\ntelegram mensahe\nuser magtanong";
                    readonly vi: "ban nhap\nbản nháp\nbản nháp tin nhắn trả lời\nghi chu\nghi chú\ngửi email\nhop thu\nhộp thư\nket noi\nkết nối\nkich hoat\nkiem tra\nkiểm tra\nkiểm tra bản nháp\nlên lịch\nlên lịch gửi\nlien he\nliên hệ\nliet ke\nliệt kê\nliệt kê tin nhắn\nlưu ghi chú\nluu tru\nlưu trữ\nlưu trữ tin nhắn\nnhắc nhở\nquan he\nquan hệ\nquy trinh\nquy trình\ntac vu\ntác vụ\ntài khoản\ntai lieu\ntài liệu\ntich hop\ntích hợp\ntin nhan\ntin nhắn\ntra loi\ntrả lời\ntrả lời tin nhắn\ntro chuyen\ntrò chuyện\ntu dong hoa\ntự động hóa\nviec can lam\nviệc cần làm";
                    readonly "zh-CN": "discord 邮件\ntelegram 消息\n人物\n关注 检查\n关系\n列出 消息\n创建 发送\n发送 telegram\n发送 发送\n发送 请求\n发送邮件\n同事\n回复 发送\n回复 收件箱\n回复 消息\n安排 发送\n安排 草稿\n归档 消息\n搜索 收件箱\n搜索 聊天\n搜索 邮件\n收件箱\n文档 消息\n日历 消息\n朋友\n查找 消息\n检查 消息\n检查 草稿\n消息 发送\n消息 回复\n消息 用户\n消息 联系人\n消息 草稿\n添加 移除\n用户 询问\n联系人\n联系人 消息\n自动化 消息\n草稿 关注\n草稿 发送\n草稿 回复\n草稿 消息 回复\n询问 发送\n询问 草稿\n连接器 消息\n邮件\n邮件 消息\n邮箱";
                };
            };
        };
        readonly musicGeneration: {
            readonly request: {
                readonly base: "audio\naudio duration\ncompose music\ncompose_music\ncreate music\ncreate_music\ncustom\ncustom generate music\ncustom_generate_music\nduration\nexisting\nexisting audio\nextend\nextend audio\nextend_audio\ngenerate\ngenerate custom\ngenerate music\ngenerate simple\ngenerate_music\ngeneration\nkey\nkey reference\nmake music\nmake_music\nmedia music generation\nmusic\nmusic generation\nmusic through\nmusic_generation\nparameters\nprompt\nreference\nrouter\nsimple\nstyle\nstyle key\nsubaction\nsubaction generate\nsuno\nsuno music\nthrough";
                readonly locales: {
                    readonly es: "accion\naudio\ncaptura\nclave\ncrear\ncrear musica\ngenerar\ngenerar musica\nherramienta\nimagen\nmultimedia\nmultimedia musica\nmusica\nsolicitud\ntecla\ntranscripcion\nvideo";
                    readonly ko: "도구\n미디어\n미디어 음악\n비디오\n생성\n생성 음악\n스크린샷\n오디오\n요청\n음악\n이미지\n작업\n전사\n키";
                    readonly pt: "acao\naudio\ncaptura\nchave\ncriar\ncriar musica\nferramenta\ngerar\ngerar musica\nimagem\nmidia\nmidia musica\nmusica\nsolicitacao\ntecla\ntranscricao\nvideo";
                    readonly tl: "aksyon\naudio\nbumuo\nbumuo musika\ngumawa\ngumawa musika\nkahilingan\nkasangkapan\nkey\nlarawan\nmedia\nmedia musika\nmusika\nscreenshot\ntranscript\nvideo";
                    readonly vi: "am thanh\nâm thanh\ncong cu\ncông cụ\nda phuong tien\nđa phương tiện\nđa phương tiện nhạc\nhanh dong\nhành động\nhinh anh\nhình ảnh\nkhoa\nkhóa\nnhac\nnhạc\nphim\nphím\ntao\ntạo\ntạo nhạc\nvideo\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "创建\n创建 音乐\n图片\n媒体\n媒体 音乐\n密钥\n工具\n截图\n操作\n生成\n生成 音乐\n视频\n请求\n转录\n键\n音乐\n音频";
                };
            };
        };
        readonly musicLibrary: {
            readonly request: {
                readonly base: "action\naction playlist\nadd\nadd play\nadd playlist\nchanges\ncomplex\ncomplex music\nconfirmed\nconsolidated\nconsolidated music\ndelete\ndelete add\ndownload\ndownload mutations\ndownloads\nfetch\nlibrary\nlibrary action\nlinks\nload\nload delete\nlocal\nmanagement\nmanagement play\nmusic\nmusic library\nmusic_library\nmutations\nplay\nplay query\nplaylist\nplaylist management\nquery\nquery research\nquery search\nqueue\nrequests\nrequire\nresearch\nreturn\nsave\nsearch\nsearch youtube\nsubaction\ntrue\ntube\nyoutube\nyoutube download";
                readonly locales: {
                    readonly es: "accion\nagregar\nagregar reproducir\nanadir\nborrar\nbuscar\nconsulta\nconsulta buscar\ndescargar\neliminar\neliminar agregar\ngestion\ngestion reproducir\nherramienta\nmusica\npedir\nreproducir\nreproducir consulta\nsolicitud\ntocar";
                    readonly ko: "검색\n관리\n관리 재생\n다운로드\n도구\n삭제\n삭제 추가\n요청\n음악\n작업\n재생\n재생 쿼리\n질의\n추가\n추가 재생\n쿼리\n쿼리 검색";
                    readonly pt: "acao\nadicionar\nadicionar tocar\napagar\nbaixar\nbuscar\nconsulta\nconsulta buscar\nexcluir\nexcluir adicionar\nferramenta\ngerenciamento\ngerenciamento tocar\nmusica\npedir\nreproduzir\nsolicitacao\ntocar\ntocar consulta";
                    readonly tl: "aksyon\nburahin\nburahin idagdag\nhiling\ni-download\nidagdag\nidagdag patugtugin\nkahilingan\nkasangkapan\nmaghanap\nmusika\npamamahala\npamamahala patugtugin\npatugtugin\npatugtugin query\nquery\nquery maghanap";
                    readonly vi: "cong cu\ncông cụ\nhanh dong\nhành động\nnhac\nnhạc\nphat\nphát\nphát truy vấn\nquan ly\nquản lý\nquản lý phát\ntai xuong\ntải xuống\nthem\nthêm\nthêm phát\ntim kiem\ntìm kiếm\ntruy van\ntruy vấn\ntruy vấn tìm kiếm\nxoa\nxóa\nxóa thêm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "下载\n删除\n删除 添加\n工具\n搜索\n播放\n播放 查询\n操作\n查询\n查询 搜索\n添加\n添加 播放\n管理\n管理 播放\n请求\n音乐";
                };
            };
        };
        readonly nostrPublishProfile: {
            readonly request: {
                readonly base: "connectors nostr publish profile\nkind\nmetadata\nnostr\nnostr profile\nnostr publish profile\nnostr_profile\nnostr_publish_profile\nprofile\nprofile kind\npublish\npublish update\nset nostr profile\nset_nostr_profile\nsocial posting nostr publish profile\nsocial_posting nostr publish profile\nupdate\nupdate nostr\nupdate nostr profile\nupdate_nostr_profile";
                readonly locales: {
                    readonly es: "accion\nactualizar\nactualizar nostr\nactualizar nostr perfil\nconector\nconector nostr publicar perfil\ncuenta conectada\nherramienta\nintegracion\nlinea de tiempo\nmcp\nnostr perfil\nnostr publicar perfil\noauth\nperfil\npost\npublicar\npublicar actualizar\nrespuesta publica\nsocial\nsocial nostr publicar perfil\nsolicitud\ntuit";
                    readonly ko: "nostr 게시 프로필\nnostr 프로필\n게시\n게시 업데이트\n계정 연결\n공개 답글\n도구\n발행\n소셜\n소셜 nostr 게시 프로필\n업데이트\n업데이트 nostr\n업데이트 nostr 프로필\n오어스\n요청\n작업\n커넥터\n커넥터 nostr 게시 프로필\n타임라인\n통합\n트윗\n프로필";
                    readonly pt: "acao\natualizar\natualizar nostr\natualizar nostr perfil\nconector\nconector nostr publicar perfil\nconta conectada\nferramenta\nintegracao\nlinha do tempo\nmcp\nnostr perfil\nnostr publicar perfil\noauth\nperfil\npostar\npublicar\npublicar atualizar\nresposta publica\nsocial\nsocial nostr publicar perfil\nsolicitacao\ntweet";
                    readonly tl: "account connection\naksyon\nconnector\nconnector nostr i-publish profile\ni-publish\ni-publish i-update\ni-update\ni-update nostr\ni-update nostr profile\nintegration\nkahilingan\nkasangkapan\nmag-post\nnostr i-publish profile\nnostr profile\noauth\nprofile\npublic reply\npublish\nsocial\nsocial nostr i-publish profile\ntimeline\ntweet";
                    readonly vi: "cap nhat\ncập nhật\ncập nhật nostr\ncập nhật nostr hồ sơ\ncong cu\ncông cụ\ndang\nđăng\ndòng thời gian\nhanh dong\nhành động\nho so\nhồ sơ\nket noi\nkết nối\nkết nối nostr xuất bản hồ sơ\nmang xa hoi\nmạng xã hội\nmạng xã hội nostr xuất bản hồ sơ\nnostr hồ sơ\nnostr xuất bản hồ sơ\noauth\ntài khoản\ntich hop\ntích hợp\ntweet\nxuat ban\nxuất bản\nxuất bản cập nhật\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "nostr 发布 资料\nnostr 资料\n公开回复\n发布\n发布 更新\n工具\n帖子\n授权\n推文\n操作\n时间线\n更新\n更新 nostr\n更新 nostr 资料\n社交\n社交 nostr 发布 资料\n请求\n账号连接\n资料\n连接器\n连接器 nostr 发布 资料\n集成";
                };
            };
        };
        readonly oauth: {
            readonly request: {
                readonly base: "accounts\nadd connection\nadd_connection\nairtable\nasana\nauthorize app\nauthorize_app\ncheck\ncheck connection\ncheck_connection\ncloud\ncloud oauth\ncompleted\nconnect\nconnect account\nconnect oauth\nconnect start\nconnect_account\nconnect_oauth\nconnected\nconnected apps\nconnection\nconnection status\nconnection_status\nconnections\nconnections operations\nconnectors oauth\ndid it work\ndid_it_work\ndisconnect\ndisconnect account\ndisconnect oauth\ndone\ndropbox\nexplicitly\nfinished\nflow\nget\ngithub\ngoogle\ninferred\nis connected\nis_connected\njira\nlinear\nlink account\nlink integration\nlink_account\nlink_integration\nlinkedin\nlist\nlist connections\nlist_connections\nmanage\nmanage cloud\nmessage\nmicrosoft\nmy accounts\nmy integrations\nnotion\noauth\noauth connect\noauth connections\noauth flow\noauth get\noauth list\noauth revoke\noauth_connect\noauth_get\noauth_list\noauth_revoke\noperations\noperations connect\nplatform\nplatforms\nprovided\nremove connection\nrevoke\nrevoke connection\nsalesforce\nsecrets oauth\nsettings oauth\nshow\nshow connections\nshow integrations\nslack\nstart\nstart oauth\nstatus\nsupported\ntext\ntwitter\nunlink account\nverify connection\nwhat is connected\nzoom";
                readonly locales: {
                    readonly es: "accion\nactivar\nadministrar\nagregar\najustes\nanadir\naplicacion\napp\nautorizacion\nclave api\ncomprobar\nconectar\nconectar cuenta\nconectar oauth\nconector\nconector oauth\nconfiguracion\ncontraseña\ncredencial\ncuenta\ncuenta conectada\neliminar\nestado\ngestionar\nherramienta\ninferido\nintegracion\nlinear\nlistar\nmcp\nmensaje\nmodelo\nmostrar\noauth\noauth conectar\noauth listar\noauth obtener\nobtener\noperacion\noperacion conectar\npreferencias\nquitar\nrevisar\nsecreto\nsecretos\nsolicitud\ntoken";
                    readonly ko: "api 키\noauth\noauth 가져오기\noauth 목록\noauth 연결\n가져오기\n계정\n계정 연결\n관리\n구성\n도구\n리니어\n메시지\n모델 설정\n목록\n비밀\n비밀번호\n상태\n설정\n시크릿\n앱\n연결\n연결 oauth\n연결 계정\n오어스\n요청\n인증\n자격 증명\n작업\n작업 연결\n제거\n추가\n추론\n커넥터\n커넥터 oauth\n토글\n토큰\n통합\n확인\n환경설정";
                    readonly pt: "acao\nadicionar\nalternar\naplicativo\napp\nautorizacao\nchave api\nconectar\nconectar conta\nconectar oauth\nconector\nconector oauth\nconfiguracao\nconfiguracoes\nconta\nconta conectada\ncredencial\nestado\nferramenta\ngerenciar\ninferido\nintegracao\nlinear\nlistar\nmcp\nmensagem\nmodelo\nmostrar\noauth\noauth conectar\noauth listar\noauth obter\nobter\noperacao\noperacao conectar\npreferencias\nremover\nsegredo\nsegredos\nsenha\nsolicitacao\nstatus\ntoken\nverificar";
                    readonly tl: "account\naccount connection\naksyon\nalisin\napi key\napp\nconfiguration\nconnector\nconnector oauth\ncredential\nhinula\nidagdag\nikonekta\nikonekta account\nikonekta oauth\nilista\nintegration\nkahilingan\nkasangkapan\nkunin\nkuwenta\nlinear\nmensahe\nmodel settings\noauth\noauth ikonekta\noauth ilista\noauth kunin\noperasyon\noperasyon ikonekta\npamahalaan\npassword\npreferences\nsecret\nsettings\nstatus\nsuriin\ntoggle\ntoken";
                    readonly vi: "bi mat\nbí mật\ncai dat\ncài đặt\ncấu hình\ncong cu\ncông cụ\nhanh dong\nhành động\nket noi\nkết nối\nkết nối oauth\nkết nối tài khoản\nkhoa api\nkhóa api\nkiem tra\nkiểm tra\nliet ke\nliệt kê\nmật khẩu\noauth\noauth kết nối\noauth lấy\noauth liệt kê\nquan ly\nquản lý\nsuy luan\nsuy luận\ntai khoan\ntài khoản\nthao tac\nthao tác\nthao tác kết nối\ntich hop\ntích hợp\ntin nhan\ntin nhắn\ntoken\ntrang thai\ntrạng thái\ntuy chon\ntùy chọn\nung dung\nứng dụng\nuy quyen\nủy quyền\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "API 密钥\nlinear\noauth\noauth 列出\noauth 获取\noauth 连接\n令牌\n偏好\n凭据\n列出\n密码\n密钥\n工具\n应用\n开关\n授权\n推断\n操作\n操作 连接\n检查\n模型设置\n消息\n添加\n状态\n秘密\n移除\n管理\n获取\n设置\n请求\n账号\n账号连接\n账户\n连接\n连接 oauth\n连接 账户\n连接器\n连接器 oauth\n配置\n集成";
                };
            };
        };
        readonly passwordManager: {
            readonly request: {
                readonly base: "automation password manager\nbrowser password manager\nchat\nclipboard\nconfirm\ncopy credential\ncopy_credential\ncredential lookup\ncredential_lookup\ninject\ninject password\nlist\nlist inject\nmanager\nmanager password\nonepassword\nonly\npass\npass search\npassword\npassword clipboard\npassword manager\npassword proton\npassword_manager\nplaintext\nplaintext chat\nproton\nprotonpass\nrequired\nsearch\nsearch list\nsecrets password manager\nshow logins\nshow_logins\nusername";
                readonly locales: {
                    readonly es: "abrir pagina\naccion\nautomatizacion\nautomatizacion contrasena\nbuscar\nbuscar listar\nchat\nclave api\nclave secreta\ncontrasena\ncontraseña\nconversacion\ncredencial\ncron\ndisparador\nflujo de trabajo\nhacer clic\nherramienta\niniciar sesion\nlistar\nmonitor\nmostrar\nnavegador\nnavegador contrasena\nsecreto\nsecreto contrasena\nsecretos\nsitio web\nsolicitud\ntoken";
                    readonly ko: "api 키\n검색\n검색 목록\n대화\n도구\n로그인\n모니터\n목록\n브라우저\n브라우저 비밀번호\n비밀\n비밀 비밀번호\n비밀번호\n시크릿\n요청\n워크플로\n웹사이트 입력\n자격 증명\n자동화\n자동화 비밀번호\n작업\n채팅\n크론\n클릭\n토큰\n트리거\n페이지 열기";
                    readonly pt: "abrir pagina\nacao\nautomacao\nautomacao senha\nbuscar\nbuscar listar\nchat\nchave api\nclicar\nconversa\ncredencial\ncron\nentrar\nferramenta\nfluxo de trabalho\ngatilho\nlistar\nlogin\nmonitor\nmostrar\nnavegador\nnavegador senha\nsegredo\nsegredo senha\nsegredos\nsenha\nsite\nsolicitacao\ntoken";
                    readonly tl: "aksyon\napi key\nautomation\nautomation password\nbrowser\nbrowser password\nbuksan ang pahina\nchat\nclick\ncredential\ncron\nilista\nkahilingan\nkasangkapan\nmag-login\nmaghanap\nmaghanap ilista\nmonitor\npassword\nsecret\nsecret password\ntoken\ntrigger\nusap\nwebsite\nworkflow";
                    readonly vi: "bi mat\nbí mật\nbí mật mật khẩu\ncong cu\ncông cụ\ndang nhap\nđăng nhập\nhanh dong\nhành động\nkhoa api\nkhóa api\nkich hoat\nliet ke\nliệt kê\nmat khau\nmật khẩu\nmo trang\nmở trang\nnhấp\nquy trinh\nquy trình\ntim kiem\ntìm kiếm\ntìm kiếm liệt kê\ntoken\ntrinh duyet\ntrình duyệt\ntrình duyệt mật khẩu\ntro chuyen\ntrò chuyện\ntu dong hoa\ntự động hóa\ntự động hóa mật khẩu\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "API 密钥\n令牌\n凭据\n列出\n定时\n密码\n密钥\n密钥 密码\n工作流\n工具\n打开页面\n搜索\n搜索 列出\n操作\n浏览器\n浏览器 密码\n点击\n登录\n监控\n秘密\n网站输入\n聊天\n自动化\n自动化 密码\n触发器\n请求";
                };
            };
        };
        readonly payment: {
            readonly request: {
                readonly base: "active\nactive mysticism\namount\nask\nask for payment\nask user\nask_for_payment\ncharge user\ncharge_user\ncheck\ncheck payment\ncheck read\ncheck request\ncheck_payment\nfinance payment\ninclude\ninclude message\nmessage\nmysticism\nmysticism payment\npay\npay amount\npayment\npayment check\npayment router\npayment status\npayment_status\npayments payment\nread\nread payment\nreading\nrequest\nrequest ask\nrequest payment\nrequest_payment\nrouter\nrouter active\nsession\nsession check\nset price\nset_price\nstatus\nstatus request\nuser\nuser pay\nverify payment\nverify_payment";
                readonly locales: {
                    readonly es: "accion\nactivo\ncheckout\ncobro\ncomprobar\ncuenta\ndinero\nestado\nestado solicitud\nfactura\nfinanzas\nherramienta\nleer\nleer pago\nmensaje\npagar\npago\npago estado\npago pago\npago revisar\npedir\nportafolio\npreguntar\npreguntar pago\npreguntar usuario\nrevisar\nrevisar leer\nrevisar pago\nrevisar solicitud\nsaldo\nsolicitud\nsolicitud pago\nsolicitud preguntar\nusuario\nusuario pagar";
                    readonly ko: "결제\n결제 결제\n결제 상태\n결제 확인\n계정\n금융\n도구\n돈\n메시지\n사용자\n사용자 지불\n상태\n상태 요청\n요금\n요청\n요청 결제\n요청 질문\n읽기\n읽기 결제\n작업\n잔액\n지불\n질문\n질문 결제\n질문 사용자\n청구서\n체크아웃\n포트폴리오\n확인\n확인 결제\n확인 요청\n확인 읽기\n활성";
                    readonly pt: "acao\nativo\ncheckout\ncobranca\nconta\ndinheiro\nestado\nfatura\nferramenta\nfinancas\nler\nler pagamento\nmensagem\npagamento\npagamento pagamento\npagamento status\npagamento verificar\npagar\npedir\nperguntar\nperguntar pagamento\nperguntar usuario\nportfolio\nsaldo\nsolicitacao\nsolicitacao pagamento\nsolicitacao perguntar\nstatus\nstatus solicitacao\nusuario\nusuario pagar\nverificar\nverificar ler\nverificar pagamento\nverificar solicitacao";
                    readonly tl: "account\naksyon\naktibo\nbalance\nbasahin\nbasahin bayad\nbayad\nbayad bayad\nbayad status\nbayad suriin\nbilling\ncheckout\nfinance\ngumagamit\nhiling\ninvoice\nkahilingan\nkahilingan bayad\nkahilingan magtanong\nkasangkapan\nmagbayad\nmagtanong\nmagtanong bayad\nmagtanong user\nmensahe\npera\nportfolio\nstatus\nstatus kahilingan\nsuriin\nsuriin basahin\nsuriin bayad\nsuriin kahilingan\nuser\nuser magbayad";
                    readonly vi: "cong cu\ncông cụ\ndang hoat dong\nđang hoạt động\ndoc\nđọc\nđọc thanh toán\nhanh dong\nhành động\nhoa don\nhóa đơn\nhoi\nhỏi\nhỏi người dùng\nhỏi thanh toán\nkiem tra\nkiểm tra\nkiểm tra đọc\nkiểm tra thanh toán\nkiểm tra yêu cầu\nnguoi dung\nngười dùng\nngười dùng trả tiền\nso du\nsố dư\ntai chinh\ntài chính\nthanh toan\nthanh toán\nthanh toán kiểm tra\nthanh toán thanh toán\nthanh toán trạng thái\ntien\ntiền\ntin nhan\ntin nhắn\ntính tiền\ntra tien\ntrả tiền\ntrang thai\ntrạng thái\ntrạng thái yêu cầu\nyeu cau\nyêu cầu\nyêu cầu hỏi\nyêu cầu thanh toán";
                    readonly "zh-CN": "付款\n付款 付款\n付款 检查\n付款 状态\n余额\n发票\n工具\n投资组合\n操作\n支付\n检查\n检查 付款\n检查 请求\n检查 读取\n活跃\n消息\n状态\n状态 请求\n用户\n用户 支付\n结账\n询问\n询问 付款\n询问 用户\n请求\n请求 付款\n请求 询问\n读取\n读取 付款\n财务\n账单\n账户\n钱";
                };
            };
        };
        readonly placeCall: {
            readonly request: {
                readonly base: "android\ncall\ncall android\ncall phone\ndial\nmake call\nmake_call\npermission\nphone\nphone call\nphone_call\nplace\nplace call\nplace_call\nrequires\nrequires call\nring\ntelecom";
                readonly locales: {
                    readonly es: "accion\nherramienta\nllamada\nllamar\nsolicitud";
                    readonly ko: "도구\n요청\n작업\n전화\n통화";
                    readonly pt: "acao\nchamada\nferramenta\nligar\nsolicitacao";
                    readonly tl: "aksyon\nkahilingan\nkasangkapan\ntawag";
                    readonly vi: "cong cu\ncông cụ\ngoi\ngọi\nhanh dong\nhành động\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "工具\n拨打\n操作\n请求\n通话";
                };
            };
        };
        readonly playAudio: {
            readonly request: {
                readonly base: "add to queue\nadd_to_queue\nartist\nautomation play audio\nmedia play audio\nname\npause\nplay\nplay audio\nplay from youtube\nplay music\nplay song\nplay this\nplay track\nplay video audio\nplay youtube\nplay youtube audio\nplay_audio\nplay_from_youtube\nplay_music\nplay_song\nplay_this\nplay_track\nplay_video_audio\nplay_youtube\nplay_youtube_audio\nqueue song\nqueue_song\nresume\nresume stop\nskip\nsong\nstart music\nstart_music\nstop\nstop skip\nstream youtube\nstream_youtube";
                readonly locales: {
                    readonly es: "accion\nagregar\nanadir\naudio\nautomatizacion\nautomatizacion reproducir audio\ncaptura\ncron\ndetener\ndisparador\nflujo de trabajo\nherramienta\nimagen\nmonitor\nmultimedia\nmultimedia reproducir audio\nmusica\nparar\nreproducir\nreproducir audio\nreproducir musica\nreproducir video audio\nsolicitud\nstream\ntocar\ntranscripcion\ntransmitir\nvideo";
                    readonly ko: "도구\n모니터\n미디어\n미디어 재생 오디오\n방송\n비디오\n스크린샷\n스트림\n영상\n오디오\n요청\n워크플로\n음악\n이미지\n자동화\n자동화 재생 오디오\n작업\n재생\n재생 비디오 오디오\n재생 오디오\n재생 음악\n전사\n중지\n추가\n크론\n트리거";
                    readonly pt: "acao\nadicionar\naudio\nautomacao\nautomacao tocar audio\ncaptura\ncron\nferramenta\nfluxo de trabalho\ngatilho\nimagem\nmidia\nmidia tocar audio\nmonitor\nmusica\nparar\nreproduzir\nsolicitacao\nstream\ntocar\ntocar audio\ntocar musica\ntocar video audio\ntranscricao\ntransmitir\nvideo";
                    readonly tl: "aksyon\naudio\nautomation\nautomation patugtugin audio\ncron\nidagdag\nitigil\nkahilingan\nkasangkapan\nlarawan\nmedia\nmedia patugtugin audio\nmonitor\nmusika\npatugtugin\npatugtugin audio\npatugtugin musika\npatugtugin video audio\nscreenshot\nstream\ntranscript\ntrigger\nvideo\nworkflow";
                    readonly vi: "am thanh\nâm thanh\ncong cu\ncông cụ\nda phuong tien\nđa phương tiện\nđa phương tiện phát âm thanh\ndung\ndừng\nhanh dong\nhành động\nhinh anh\nhình ảnh\nkich hoat\nnhac\nnhạc\nphat\nphát\nphát âm thanh\nphát nhạc\nphat truc tiep\nphát trực tiếp\nphát video âm thanh\nquy trinh\nquy trình\nthem\nthêm\ntu dong hoa\ntự động hóa\ntự động hóa phát âm thanh\nvideo\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "停止\n图片\n媒体\n媒体 播放 音频\n定时\n工作流\n工具\n截图\n播放\n播放 视频 音频\n播放 音乐\n播放 音频\n操作\n添加\n监控\n直播\n视频\n自动化\n自动化 播放 音频\n触发器\n请求\n转录\n音乐\n音频";
                };
            };
        };
        readonly playback: {
            readonly request: {
                readonly base: "add to queue\nadd_to_queue\nautomation playback\nmedia playback\nmusic\nmusic playback\nnext track\nnext_track\npause\npause music\npause_music\nplayback\nqueue\nqueue music\nqueue_music\nresume\nresume music\nresume_music\nskip\nskip stop\nskip track\nskip_track\nstop\nstop music\nstop queue\nstop_music\nunpause";
                readonly locales: {
                    readonly es: "accion\nagregar\nanadir\naudio\nautomatizacion\ncaptura\ncron\ndetener\ndetener musica\ndisparador\nflujo de trabajo\nherramienta\nimagen\nmonitor\nmultimedia\nmusica\nparar\nsolicitud\ntranscripcion\nvideo";
                    readonly ko: "도구\n모니터\n미디어\n비디오\n스크린샷\n오디오\n요청\n워크플로\n음악\n이미지\n자동화\n작업\n전사\n중지\n중지 음악\n추가\n크론\n트리거";
                    readonly pt: "acao\nadicionar\naudio\nautomacao\ncaptura\ncron\nferramenta\nfluxo de trabalho\ngatilho\nimagem\nmidia\nmonitor\nmusica\nparar\nparar musica\nsolicitacao\ntranscricao\nvideo";
                    readonly tl: "aksyon\naudio\nautomation\ncron\nidagdag\nitigil\nitigil musika\nkahilingan\nkasangkapan\nlarawan\nmedia\nmonitor\nmusika\nscreenshot\ntranscript\ntrigger\nvideo\nworkflow";
                    readonly vi: "âm thanh\ncong cu\ncông cụ\nda phuong tien\nđa phương tiện\ndung\ndừng\ndừng nhạc\nhanh dong\nhành động\nhinh anh\nhình ảnh\nkich hoat\nnhac\nnhạc\nquy trinh\nquy trình\nthem\nthêm\ntu dong hoa\ntự động hóa\nvideo\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "停止\n停止 音乐\n图片\n媒体\n定时\n工作流\n工具\n截图\n操作\n添加\n监控\n视频\n自动化\n触发器\n请求\n转录\n音乐\n音频";
                };
            };
        };
        readonly playEmote: {
            readonly request: {
                readonly base: "action\nanimate\nanimation\navatar\ndance\ndo emote\ndo_emote\nemote\ngeneral play emote\ngesture\nmedia play emote\nperform\nplay\nplay animation\nplay emote\nplay shot\nplay_animation\nplay_emote\nshot\nside\nside action\nsilent\nvisual\nwave";
                readonly locales: {
                    readonly es: "accion\naudio\ncaptura\nchat general\nconversacion\ngeneral\ngeneral reproducir\nhablar\nherramienta\nimagen\nmultimedia\nmultimedia reproducir\nreproducir\nrespuesta\nsolicitud\ntocar\ntranscripcion\nvideo";
                    readonly ko: "답변\n도구\n말하기\n미디어\n미디어 재생\n비디오\n스크린샷\n오디오\n요청\n이미지\n일반\n일반 대화\n일반 재생\n작업\n재생\n전사\n채팅";
                    readonly pt: "acao\naudio\ncaptura\nchat geral\nconversa\nfalar\nferramenta\ngeral\ngeral tocar\nimagem\nmidia\nmidia tocar\nreproduzir\nresposta\nsolicitacao\ntocar\ntranscricao\nvideo";
                    readonly tl: "aksyon\naudio\ngeneral chat\nkahilingan\nkasangkapan\nlarawan\nmakipag-usap\nmedia\nmedia patugtugin\npangkalahatan\npangkalahatan patugtugin\npatugtugin\nsagot\nscreenshot\ntranscript\nusap\nvideo";
                    readonly vi: "âm thanh\nchung\nchung phát\ncong cu\ncông cụ\nda phuong tien\nđa phương tiện\nđa phương tiện phát\nhanh dong\nhành động\nhinh anh\nhình ảnh\nnói chuyện\nphat\nphát\ntra loi\ntrả lời\ntro chuyen\ntrò chuyện\nvideo\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "回复\n回答\n图片\n媒体\n媒体 播放\n对话\n工具\n截图\n播放\n操作\n普通聊天\n视频\n请求\n转录\n通用\n通用 播放\n音频";
                };
            };
        };
        readonly plugin: {
            readonly request: {
                readonly base: "admin plugin\ncode plugin\nconfig\nconfigure\nconfigure connector\nconfigure plugin\nconfigure read\nconfigure_connector\nconfigure_plugin\nconnector\nconnector lifecycle\nconnectors plugin\ndisconnect\ndisconnect connector\ndisconnect_connector\neject\neject plugin\neject_plugin\nfiles plugin\ninstall\ninstall plugin\ninstall uninstall\ninstall_plugin\nlifecycle\nlifecycle install\nlist\nlist connectors\nlist disconnect\nlist_connectors\nmanage\nmanage connector\nmanage plugin\nmanage_connector\nmanage_plugin\nplugin\nplugin connector\nplugin lifecycle\nplugin_lifecycle\nread\nread config\nread plugin config\nread_plugin_config\nreinject\nreinject configure\nreinject plugin\nreinject_plugin\nsave connector config\nsave_connector_config\nsecrets plugin\nset connector enabled\nset_connector_enabled\nsettings plugin\nsync\nsync plugin\nsync_plugin\ntoggle\ntoggle connector\ntoggle list\ntoggle plugin\ntoggle_connector\ntoggle_plugin\ntype\ntype plugin\nuninstall\nuninstall plugin\nuninstall update\nuninstall_plugin\nupdate\nupdate plugin\nupdate sync\nupdate_plugin";
                readonly locales: {
                    readonly es: "activar\nactualizar plugin\nadministrador\nadministrador plugin\najustes\narchivo\narchivo plugin\narchivos\ncarpeta\nclave api\nclave secreta\ncodigo\ncodigo plugin\nconector\nconector plugin\nconfiguracion\nconfiguracion plugin\nconfigurar conector\nconfigurar leer\nconfigurar plugin\ncontraseña\ncredencial\ncuenta conectada\ndepurar\ndueño\ngestionar conector\ngestionar plugin\nimplementar\ninstalar plugin\nintegracion\nleer archivo\nleer plugin\nlistar conector\nmcp\nmodelo\noauth\npermisos\nplugin conector\npolitica\npreferencias\nprogramacion\nprueba\nrepositorio\nroles\nsecreto\nsecreto plugin\nsecretos\ntoken";
                    readonly ko: "api 키\n계정 연결\n관리 커넥터\n관리 플러그인\n관리자\n관리자 플러그인\n구성\n구현\n권한\n디렉터리\n디버그\n모델 설정\n목록 커넥터\n비밀\n비밀 플러그인\n비밀번호\n설정\n설정 읽기\n설정 커넥터\n설정 플러그인\n설치\n설치 플러그인\n소유자\n시크릿\n업데이트 플러그인\n역할\n오어스\n읽기 플러그인\n자격 증명\n저장소\n정책\n커넥터\n커넥터 플러그인\n코드\n코드 플러그인\n테스트\n토글\n토큰\n통합\n파일\n파일 쓰기\n파일 읽기\n파일 플러그인\n폴더\n프로그래밍\n플러그인\n플러그인 커넥터\n환경설정";
                    readonly pt: "administrador\nadministrador plugin\nalternar\narquivo\narquivo plugin\narquivos\natualizar plugin\nchave api\ncodigo\ncodigo plugin\nconector\nconector plugin\nconfiguracao\nconfiguracoes\nconfiguracoes plugin\nconfigurar conector\nconfigurar ler\nconfigurar plugin\nconta conectada\ncredencial\ndepurar\ndiretorio\ndono\nfuncoes\ngerenciar conector\ngerenciar plugin\nimplementar\ninstalar plugin\nintegracao\nler arquivo\nler plugin\nlistar conector\nmcp\nmodelo\noauth\npasta\npermissoes\nplugin conector\npolitica\npreferencias\nprogramacao\nrepositorio\nsegredo\nsegredo plugin\nsegredos\nsenha\nteste\ntoken";
                    readonly tl: "account connection\nadmin\nadmin plugin\napi key\nbasahin file\nbasahin plugin\ncode\ncode plugin\nconfiguration\nconnector\nconnector plugin\ncredential\ndebug\ndirectory\nfile\nfile plugin\nfiles\nfolder\ni-configure basahin\ni-configure connector\ni-configure plugin\ni-install\ni-install plugin\ni-update plugin\nilista connector\nintegration\nipatupad\nmay ari\nmodel settings\noauth\npahintulot\npamahalaan connector\npamahalaan plugin\npassword\npatakaran\nplugin\nplugin connector\npreferences\nprogramming\nrepo\nrole\nsecret\nsecret plugin\nsettings\nsettings plugin\ntest\ntoggle\ntoken";
                    readonly vi: "bi mat\nbí mật\ncai dat\ncài đặt\ncài đặt plugin\ncap nhat\ncập nhật\ncập nhật plugin\ncau hinh\ncấu hình\ncấu hình đọc\ncấu hình kết nối\ncấu hình plugin\nchu so huu\nchủ sở hữu\nđọc plugin\ndoc tep\nđọc tệp\nket noi\nkết nối\nkết nối plugin\nkho ma\nkho mã\nkhoa api\nkhóa api\nkiểm thử\nlap trinh\nlập trình\nliet ke\nliệt kê\nliệt kê kết nối\nmã plugin\nmật khẩu\nquan ly\nquản lý\nquản lý kết nối\nquản lý plugin\nquan tri\nquản trị\nquản trị plugin\ntài khoản\ntệp plugin\nthu muc\nthư mục\ntich hop\ntích hợp\ntuy chon\ntùy chọn";
                    readonly "zh-CN": "API 密钥\n仓库\n代码\n代码 插件\n令牌\n偏好\n写文件\n凭据\n列出 连接器\n安装 插件\n实现\n密码\n密钥\n密钥 插件\n开关\n所有者\n授权\n插件\n插件 连接器\n文件\n文件 插件\n文件夹\n更新 插件\n权限\n模型设置\n测试\n目录\n秘密\n策略\n管理 插件\n管理 连接器\n管理员\n管理员 插件\n编程\n角色\n设置\n设置 插件\n读取 插件\n读取文件\n调试\n账号连接\n连接器\n连接器 插件\n配置\n配置 插件\n配置 读取\n配置 连接器\n集成";
                };
            };
        };
        readonly post: {
            readonly request: {
                readonly base: "cast\nconnectors post\nfeed post\nfeed_post\npost\npublish\nsocial posting post\nsocial_posting post\ntimeline\ntweet";
                readonly locales: {
                    readonly es: "accion\nconector\nconector publicacion\ncuenta conectada\nherramienta\nintegracion\nlinea de tiempo\nmcp\noauth\npost\npublicacion\npublicar\nrespuesta publica\nsocial\nsocial publicacion\nsolicitud\ntuit";
                    readonly ko: "게시\n게시물\n계정 연결\n공개 답글\n도구\n발행\n소셜\n소셜 게시물\n오어스\n요청\n작업\n커넥터\n커넥터 게시물\n타임라인\n통합\n트윗";
                    readonly pt: "acao\nconector\nconector postagem\nconta conectada\nferramenta\nintegracao\nlinha do tempo\nmcp\noauth\npostagem\npostar\npublicar\nresposta publica\nsocial\nsocial postagem\nsolicitacao\ntweet";
                    readonly tl: "account connection\naksyon\nconnector\nconnector post\ni-publish\nintegration\nkahilingan\nkasangkapan\nmag-post\noauth\npost\npublic reply\npublish\nsocial\nsocial post\ntimeline\ntweet";
                    readonly vi: "bai dang\nbài đăng\ncong cu\ncông cụ\ndang\nđăng\ndòng thời gian\nhanh dong\nhành động\nket noi\nkết nối\nkết nối bài đăng\nmang xa hoi\nmạng xã hội\nmạng xã hội bài đăng\noauth\ntài khoản\ntich hop\ntích hợp\ntweet\nxuat ban\nxuất bản\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "公开回复\n发布\n工具\n帖子\n授权\n推文\n操作\n时间线\n社交\n社交 帖子\n请求\n账号连接\n连接器\n连接器 帖子\n集成";
                };
            };
        };
        readonly profile: {
            readonly request: {
                readonly base: "booking\ncalendar profile\ncapture\ncapture phone\ncapture_phone\nconfigure\nconfigure escalation\nconfigure_escalation\ncontacts profile\ndurable\nescalation\nescalation operations\nescalation rules\nfacts\ngender\nintensity\nintensity configure\nintensity reminder\nlocation\nmemory profile\nname\nnumber\nnumber capture\nnumber reminder\nonly\noperations\noperations durable\nowner\npersist\nphone\nphone reminder\npreference\npreferences\nprefs\nprefs capture\nprofile\nrelationship\nrelationship status\nremember about me\nremember preferences\nremember_about_me\nremember_preferences\nreminder\nreminder intensity\nreminder preference\nrules\nrules configure\nsave\nsave my location\nsave my name\nsave travel preferences\nsave_my_location\nsave_my_name\nsave_travel_preferences\nscoped\nset reminder intensity\nset_reminder_intensity\nsettings profile\nstable\nstate\nstatus\nstatus travel\nsubaction\ntasks profile\ntravel\ntravel booking";
                readonly locales: {
                    readonly es: "accion\nactivar\najustes\namigo\ncalendario\ncalendario perfil\ncapturar\ncolega\nconfiguracion\nconfiguracion perfil\nconfigurar\ncontacto\ncontacto perfil\ncontactos\nestado\nestado viaje\nfecha limite\ngente\nguardar memoria\nherramienta\nmemoria\nmemoria perfil\nmodelo\noperacion\npendiente\nperfil\npersona\npreferencias\nrecordar\nrecordatorio\nrecuerdo\nregla\nregla configurar\nrelacion\nseguimiento\nsolicitud\ntarea\ntarea perfil\ntareas\nviaje";
                    readonly ko: "관계\n구성\n규칙\n규칙 설정\n기억\n기억 프로필\n기억해\n도구\n동료\n리마인더\n마감일\n모델 설정\n사람\n상태\n상태 여행\n설정\n설정 프로필\n알림\n여행\n연락처\n연락처 프로필\n요청\n일정\n작업\n작업 프로필\n장기 기억\n친구\n캘린더\n캘린더 프로필\n캡처\n토글\n프로필\n할 일\n환경설정\n회상\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\nalternar\namigo\ncalendario\ncalendario perfil\ncapturar\ncolega\nconfiguracao\nconfiguracoes\nconfiguracoes perfil\nconfigurar\ncontato\ncontato perfil\ncontatos\nestado\nferramenta\nlembrar\nlembrete\nmemoria\nmemoria perfil\nmodelo\noperacao\nperfil\npessoa\npessoas\nprazo\npreferencias\nrecordar\nregra\nregra configurar\nrelacao\nsalvar memoria\nsolicitacao\nstatus\nstatus viagem\ntarefa\ntarefa perfil\ntarefas\nviagem";
                    readonly tl: "aksyon\nalaala\nalalahanin\nbiyahe\nconfiguration\ncontact\ncontact profile\ncontacts\ndeadline\nfollow up\ngawain\ngawain profile\ni-configure\nkahilingan\nkaibigan\nkalendaryo\nkalendaryo profile\nkasamahan\nkasangkapan\nkuha\nlong term memory\nmemory\nmemory profile\nmodel settings\noperasyon\npaalala\npanuntunan\npanuntunan i-configure\npreferences\nprofile\nrelasyon\nsettings\nsettings profile\nstatus\nstatus biyahe\ntandaan\ntao\ntask\ntodo\ntoggle";
                    readonly vi: "cai dat\ncài đặt\ncài đặt hồ sơ\ncau hinh\ncấu hình\ncong cu\ncông cụ\ndu lich\ndu lịch\nghi nho\nghi nhớ\nhanh dong\nhành động\nho so\nhồ sơ\nky uc\nký ức\nký ức hồ sơ\nlịch hồ sơ\nlien he\nliên hệ\nliên hệ hồ sơ\nngười\nnhac nho\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnhiệm vụ hồ sơ\nnho\nnhớ\nquan he\nquan hệ\nquy tac\nquy tắc\nquy tắc cấu hình\ntac vu\ntác vụ\nthao tac\nthao tác\ntrang thai\ntrạng thái\ntrạng thái du lịch\ntuy chon\ntùy chọn\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "人物\n任务\n任务 资料\n偏好\n关系\n同事\n回忆\n工具\n开关\n待办\n截图\n截止日期\n捕获\n提醒\n操作\n旅行\n日历\n日历 资料\n朋友\n模型设置\n状态\n状态 旅行\n联系人\n联系人 资料\n规则\n规则 配置\n记住\n记忆\n记忆 资料\n设置\n设置 资料\n请求\n资料\n跟进\n配置\n长期记忆";
                };
            };
        };
        readonly proposeMeetingTimes: {
            readonly request: {
                readonly base: "available\nbulk reschedule meetings\nbulk_reschedule_meetings\nbundle meetings while traveling\nbundle_meetings_while_traveling\ncalendar\ncalendar crud\ncalendar meeting\ncalendar propose meeting times\ncontacts propose meeting times\ncrud\nfind meeting slots\nfind_meeting_slots\nmeeting\nnegotiation\noffer meeting slots\noffer_meeting_slots\nowner\nowner calendar\npreferences\npreferences calendar\npropose\npropose meeting times\npropose slots\npropose_meeting_times\npropose_slots\nreschedule meetings\nreschedule_meetings\nslots\nsuggest meeting times\nsuggest_meeting_times\ntasks propose meeting times\ntracking";
                readonly locales: {
                    readonly es: "accion\namigo\nbuscar\ncalendario\ncolega\ncontacto\ncontactos\nencontrar\nfecha limite\ngente\nherramienta\npendiente\npersona\nrecordatorio\nrelacion\nseguimiento\nsolicitud\ntarea\ntareas";
                    readonly ko: "관계\n도구\n동료\n리마인더\n마감일\n사람\n연락처\n요청\n일정\n작업\n찾기\n친구\n캘린더\n할 일\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\namigo\nbuscar\ncalendario\ncolega\ncontato\ncontatos\nencontrar\nferramenta\nlembrete\npessoa\npessoas\nprazo\nrelacao\nsolicitacao\ntarefa\ntarefas";
                    readonly tl: "aksyon\ncontact\ncontacts\ndeadline\nfollow up\ngawain\nhanapin\nkahilingan\nkaibigan\nkalendaryo\nkasamahan\nkasangkapan\npaalala\nrelasyon\ntao\ntask\ntodo";
                    readonly vi: "cong cu\ncông cụ\nhanh dong\nhành động\nlich\nlịch\nlien he\nliên hệ\nnguoi\nngười\nnhắc nhở\nnhiem vu\nnhiệm vụ\nquan he\nquan hệ\ntac vu\ntác vụ\ntim\ntìm\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "人物\n任务\n关系\n同事\n工具\n待办\n截止日期\n提醒\n操作\n日历\n朋友\n查找\n联系人\n请求\n跟进";
                };
            };
        };
        readonly queryTrajectories: {
            readonly request: {
                readonly base: "admin query trajectories\nagent internal query trajectories\nagent_internal query trajectories\nbatch\nbatchid\nbrowse trajectories\nbrowse_trajectories\ndocuments query trajectories\nfilter\nfilters\nfind trajectories\nfind_trajectories\nlimit\nlist\nlist record\nlist recorded\nlist trajectories\nlist_trajectories\noffset\noptional\nplus\nquery trajectories\nquery_trajectories\nrecord\nrecorded\nscenario\nscenarioid\nsource\nsource status\nstatus\nstatus scenario\nstatus scenarioid\ntrajectories\ntrajectory";
                readonly locales: {
                    readonly es: "accion\nadministrador\nadministrador consulta\nagente\nagente consulta\narchivo\nbuscar\nconsulta\ndocumento\ndocumento consulta\ndocumentos\ndueño\nencontrar\nestado\nestado interno\ngestion interna\nguardar notas\nherramienta\ninterno del agente\nlistar\nmostrar\nnotas\npermisos\npolitica\nroles\nsolicitud";
                    readonly ko: "관리자\n관리자 쿼리\n권한\n내부 상태\n노트\n도구\n목록\n문서\n문서 쿼리\n상태\n소유자\n에이전트\n에이전트 내부\n에이전트 쿼리\n역할\n요청\n자체 관리\n작업\n저장\n정책\n질의\n찾기\n쿼리\n파일 내용";
                    readonly pt: "acao\nadministrador\nadministrador consulta\nagente\nagente consulta\narquivo\nbuscar\nconsulta\ndocumento\ndocumento consulta\ndocumentos\ndono\nencontrar\nestado\nestado interno\nferramenta\nfuncoes\ngestao interna\ninterno do agente\nlistar\nmostrar\nnotas\npermissoes\npolitica\nsalvar notas\nsolicitacao\nstatus";
                    readonly tl: "admin\nadmin query\nagent\nagent query\naksyon\ndokumento\ndokumento query\nhanapin\ni-save\nilista\ninternal ng agent\ninternal state\nkahilingan\nkasangkapan\nmay ari\nnilalaman ng file\nnotes\npahintulot\npatakaran\nquery\nrole\nsariling pamamahala\nstatus";
                    readonly vi: "chu so huu\nchủ sở hữu\ncong cu\ncông cụ\nghi chu\nghi chú\nhanh dong\nhành động\nliet ke\nliệt kê\nlưu ghi chú\nnoi bo tac tu\nnội bộ tác tử\nquan tri\nquản trị\nquản trị truy vấn\nquyen\nquyền\ntac tu\ntác tử\ntác tử truy vấn\ntai lieu\ntài liệu\ntài liệu truy vấn\ntim\ntìm\ntrang thai\ntrạng thái\ntruy van\ntruy vấn\ntu quan ly\ntự quản lý\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "代理\n代理 查询\n代理内部\n保存笔记\n内部状态\n列出\n工具\n所有者\n操作\n文件内容\n文档\n文档 查询\n智能体\n权限\n查找\n查询\n状态\n笔记\n策略\n管理员\n管理员 查询\n自我管理\n角色\n请求";
                };
            };
        };
        readonly read: {
            readonly request: {
                readonly base: "absolute\nautomation read\nbefore\nbefore write\nbyte\ncall\ncall line\ncapped\ncapped call\ncat\ncode read\ncontents\ncontents file\nedit\nedit mutate\nexisting\nexisting file\nfile\nfile absolute\nfile byte\nfiles\nfiles required\nlarge\nlarge files\nlimit\nlimit file\nline\nlines\nmutate\nnumbered\noffset\nopen file\nopen_file\npaginate\npath\nread\nread contents\nread file\nread_file\nrequired\nreturns\nsupported\nterminal read\nthrough\nwrite\nwrite edit";
                readonly locales: {
                    readonly es: "abrir\nabrir archivo\naccion\narchivo\nautomatizacion\nautomatizacion leer\nbash\ncodigo\ncodigo leer\ncontenido\ncontenido archivo\ncron\ndepurar\ndisparador\neditar\nescribir\nescribir editar\nflujo de trabajo\nherramienta\nimplementar\nleer\nleer archivo\nleer contenido\nlinea de comandos\nllamada\nllamar\nmonitor\nproceso\nprogramacion\nprueba\nrepositorio\nshell\nsolicitud\nterminal\nterminal leer";
                    readonly ko: "구현\n내용\n도구\n디버그\n명령줄\n모니터\n배시\n셸\n쓰기\n쓰기 편집\n열기\n열기 파일\n요청\n워크플로\n읽기\n읽기 콘텐츠\n읽기 파일\n자동화\n자동화 읽기\n작업\n저장소\n전화\n코드\n코드 읽기\n콘텐츠\n콘텐츠 파일\n크론\n터미널\n터미널 읽기\n테스트\n통화\n트리거\n파일\n편집\n프로그래밍\n프로세스";
                    readonly pt: "abrir\nabrir arquivo\nacao\narquivo\nautomacao\nautomacao ler\nbash\nchamada\ncodigo\ncodigo ler\nconteudo\nconteudo arquivo\ncron\ndepurar\neditar\nescrever\nescrever editar\nferramenta\nfluxo de trabalho\ngatilho\nimplementar\nler\nler arquivo\nler conteudo\nligar\nlinha de comando\nmonitor\nprocesso\nprogramacao\nrepositorio\nshell\nsolicitacao\nterminal\nterminal ler\nteste";
                    readonly tl: "aksyon\nautomation\nautomation basahin\nbasahin\nbasahin file\nbasahin nilalaman\nbash\nbuksan\nbuksan file\ncode\ncode basahin\ncommand line\ncron\ndebug\nfile\ni-edit\nipatupad\nisulat\nisulat i-edit\nkahilingan\nkasangkapan\nmonitor\nnilalaman\nnilalaman file\nprocess\nprogramming\nrepo\nshell\ntawag\nterminal\nterminal basahin\ntest\ntrigger\nworkflow";
                    readonly vi: "bash\nchinh sua\nchỉnh sửa\ncong cu\ncông cụ\ndoc\nđọc\nđọc nội dung\nđọc tệp\ndong lenh\ndòng lệnh\ngoi\ngọi\nhanh dong\nhành động\nkho ma\nkho mã\nkich hoat\nkiểm thử\nlap trinh\nlập trình\nma\nmã\nmã đọc\nmo\nmở\nmở tệp\nnoi dung\nnội dung\nnội dung tệp\nquy trinh\nquy trình\nshell\ntep\ntệp\nterminal\nterminal đọc\ntiến trình\ntu dong hoa\ntự động hóa\ntự động hóa đọc\nviet\nviết\nviết chỉnh sửa\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "Bash\n仓库\n代码\n代码 读取\n内容\n内容 文件\n写入\n写入 编辑\n命令行\n定时\n实现\n工作流\n工具\n打开\n打开 文件\n拨打\n操作\n文件\n标准输出\n测试\n监控\n终端\n终端 读取\n编程\n编辑\n自动化\n自动化 读取\n触发器\n请求\n读取\n读取 内容\n读取 文件\n调试\n进程\n通话";
                };
            };
        };
        readonly readAttachment: {
            readonly request: {
                readonly base: "add\nadd clipboard\nattachments\nattachments link\nbounded\nbounded task\nclipboard\ncontent\ncontent media\ndescriptions\ndescriptions add\ndocuments read attachment\nextracted\nfiles read attachment\ninspect attachment\ninspect_attachment\nkeep\nlink\nmedia\nmedia descriptions\nmedia read attachment\nmessaging read attachment\nopen attachment\nopen url\nopen_attachment\nopen_url\npage\npage content\npreviews\nread\nread attachment\nread recent\nread url\nread webpage\nread_attachment\nread_url\nread_webpage\nrecent\nrecent attachments\nresult\nstate\ntask\ntask clipboard\ntext\ntranscripts\ntranscripts page\ntrue\nusing";
                readonly locales: {
                    readonly es: "abrir\nabrir adjunto\nabrir url\naccion\nadjunto\nagregar\nanadir\narchivo\narchivo leer adjunto\narchivos\naudio\ncaptura\ncarpeta\ncontenido\ncontenido multimedia\ndirectorio\ndocumento\ndocumento leer adjunto\ndocumentos\nguardar notas\nherramienta\nimagen\nleer\nleer adjunto\nleer archivo\nleer url\nmultimedia\nmultimedia leer adjunto\nnotas\npagina\npagina contenido\nsolicitud\ntarea\ntranscripcion\nvideo";
                    readonly ko: "내용\n노트\n도구\n디렉터리\n문서\n문서 읽기 첨부파일\n미디어\n미디어 읽기 첨부파일\n비디오\n스크린샷\n열기\n열기 url\n열기 첨부파일\n오디오\n요청\n이미지\n읽기\n읽기 url\n읽기 첨부파일\n작업\n저장\n전사\n첨부파일\n추가\n콘텐츠\n콘텐츠 미디어\n파일\n파일 내용\n파일 쓰기\n파일 읽기\n파일 읽기 첨부파일\n페이지\n페이지 콘텐츠\n폴더";
                    readonly pt: "abrir\nabrir anexo\nabrir url\nacao\nadicionar\nanexo\narquivo\narquivo ler anexo\narquivos\naudio\ncaptura\nconteudo\nconteudo midia\ndiretorio\ndocumento\ndocumento ler anexo\ndocumentos\nferramenta\nimagem\nler\nler anexo\nler arquivo\nler url\nmidia\nmidia ler anexo\nnotas\npagina\npagina conteudo\npasta\nsalvar notas\nsolicitacao\ntarefa\ntranscricao\nvideo";
                    readonly tl: "aksyon\nattachment\naudio\nbasahin\nbasahin attachment\nbasahin file\nbasahin url\nbuksan\nbuksan attachment\nbuksan url\ndirectory\ndokumento\ndokumento basahin attachment\nfile\nfile basahin attachment\nfiles\nfolder\ngawain\ni-save\nidagdag\nkahilingan\nkasangkapan\nlarawan\nmedia\nmedia basahin attachment\nnilalaman\nnilalaman media\nnilalaman ng file\nnotes\npahina\npahina nilalaman\nscreenshot\ntranscript\nvideo";
                    readonly vi: "âm thanh\ncong cu\ncông cụ\nda phuong tien\nđa phương tiện\nđa phương tiện đọc tệp đính kèm\ndoc\nđọc\ndoc tep\nđọc tệp\nđọc tệp đính kèm\nđọc url\nghi chu\nghi chú\nhanh dong\nhành động\nhinh anh\nhình ảnh\nlưu ghi chú\nmo\nmở\nmở tệp đính kèm\nmở url\nnhiem vu\nnhiệm vụ\nnoi dung\nnội dung\nnội dung đa phương tiện\ntai lieu\ntài liệu\ntài liệu đọc tệp đính kèm\ntep\ntệp\ntep dinh kem\ntệp đính kèm\ntệp đọc tệp đính kèm\nthem\nthêm\nthu muc\nthư mục\ntrang\ntrang nội dung\nvideo\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "任务\n保存笔记\n内容\n内容 媒体\n写文件\n图片\n媒体\n媒体 读取 附件\n工具\n截图\n打开\n打开 url\n打开 附件\n操作\n文件\n文件 读取 附件\n文件内容\n文件夹\n文档\n文档 读取 附件\n添加\n目录\n视频\n笔记\n请求\n读取\n读取 url\n读取 附件\n读取文件\n转录\n附件\n音频\n页面\n页面 内容";
                };
            };
        };
        readonly reading: {
            readonly request: {
                readonly base: "astrology\nastrology reading\nastrology_reading\nbegin\nbirth chart\nbirth_chart\ncard reading\ncard_reading\ncast hexagram\ncast_hexagram\nconsult iching\nconsult_iching\ncontinue reading\ncontinue_reading\ndeepen\ndeepen reading\ndeepen_reading\ndraw cards\ndraw_cards\nelaborate reading\nelaborate_reading\nelement\nexplore deeper\nexplore_deeper\nfollowup\ngeneral reading\nhoroscope reading\nhoroscope_reading\niching\niching reading\niching_reading\ninterpretation\nknowledge reading\nmore\nmost\nmystical\nnatal chart\nnatal_chart\nnext\nnext card\nnext_card\noracle reading\noracle_reading\nproceed reading\nproceed_reading\nread tarot\nread_tarot\nreading\nreading followup\nreading_followup\nreadings\nrecent\nreveal\nrouter\nstart\nsubaction\nsubactions\ntarot\ntarot reading\ntarot spread\ntarot_reading\ntarot_spread\nthrow coins\nthrow_coins\ntype\nzodiac reading\nzodiac_reading";
                readonly locales: {
                    readonly es: "accion\nchat general\nconocimiento\nconversacion\ngeneral\nhablar\nhechos guardados\nherramienta\nleer\nnotas guardadas\nrecordar\nrespuesta\nsolicitud";
                    readonly ko: "검색\n답변\n도구\n말하기\n요청\n일반\n일반 대화\n읽기\n작업\n저장된 노트\n저장된 사실\n지식\n채팅\n회상";
                    readonly pt: "acao\nchat geral\nconhecimento\nconversa\nfalar\nfatos salvos\nferramenta\ngeral\nlembrar\nler\nnotas salvas\nresposta\nsolicitacao";
                    readonly tl: "aksyon\nalalahanin\nbasahin\ngeneral chat\nkaalaman\nkahilingan\nkasangkapan\nmakipag-usap\npangkalahatan\nsagot\nsaved facts\nsaved notes\nusap";
                    readonly vi: "chung\ncong cu\ncông cụ\ndoc\nđọc\nghi chu da luu\nghi chú đã lưu\nhanh dong\nhành động\nkien thuc\nkiến thức\nnhớ lại\nnói chuyện\ntra loi\ntrả lời\ntro chuyen\ntrò chuyện\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "回复\n回忆\n回答\n对话\n工具\n已保存事实\n已保存笔记\n操作\n普通聊天\n知识\n语义搜索\n请求\n读取\n通用";
                };
            };
        };
        readonly recordTrustInteraction: {
            readonly request: {
                readonly base: "admin record trust interaction\naffecting\nagent internal record trust interaction\nagent_internal record trust interaction\nbetween\ndocument promise kept\ndocument_promise_kept\nentities\ninteraction\nlog trust interaction\nlog_trust_interaction\nmark helpful contribution\nmark_helpful_contribution\nnote trustworthy action\nnote_trustworthy_action\nrecord trust event\nrecord trust interaction\nrecord_trust_event\nrecord_trust_interaction\nrecords\nrecords trust\nreport suspicious activity\nreport_suspicious_activity\nsettings record trust interaction\ntrack behavior\ntrack_behavior\ntrust\ntrust affecting";
                readonly locales: {
                    readonly es: "accion\nactivar\nactividad\nadministrador\nadministrador confianza\nagente\nagente confianza\najustes\nconfianza\nconfiguracion\nconfiguracion confianza\ndocumento\ndueño\nestado interno\ngestion interna\nherramienta\ninterno del agente\nmodelo\npermisos\npolitica\npreferencias\nroles\nsolicitud";
                    readonly ko: "관리자\n관리자 신뢰\n구성\n권한\n내부 상태\n도구\n모델 설정\n문서\n설정\n설정 신뢰\n소유자\n신뢰\n에이전트\n에이전트 내부\n에이전트 신뢰\n역할\n요청\n자체 관리\n작업\n정책\n토글\n환경설정\n활동";
                    readonly pt: "acao\nadministrador\nadministrador confianca\nagente\nagente confianca\nalternar\natividade\nconfianca\nconfiguracao\nconfiguracoes\nconfiguracoes confianca\ndocumento\ndono\nestado interno\nferramenta\nfuncoes\ngestao interna\ninterno do agente\nmodelo\npermissoes\npolitica\npreferencias\nsolicitacao";
                    readonly tl: "admin\nadmin tiwala\nagent\nagent tiwala\naksyon\naktibidad\nconfiguration\ndokumento\ninternal ng agent\ninternal state\nkahilingan\nkasangkapan\nmay ari\nmodel settings\npahintulot\npatakaran\npreferences\nrole\nsariling pamamahala\nsettings\nsettings tiwala\ntiwala\ntoggle";
                    readonly vi: "cai dat\ncài đặt\ncài đặt tin cậy\ncấu hình\nchu so huu\nchủ sở hữu\ncong cu\ncông cụ\nhanh dong\nhành động\nhoat dong\nhoạt động\nnoi bo tac tu\nnội bộ tác tử\nquan tri\nquản trị\nquản trị tin cậy\nquyen\nquyền\ntac tu\ntác tử\ntác tử tin cậy\ntai lieu\ntài liệu\ntin cay\ntin cậy\ntu quan ly\ntự quản lý\ntuy chon\ntùy chọn\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "代理\n代理 信任\n代理内部\n信任\n偏好\n内部状态\n工具\n开关\n所有者\n操作\n文档\n智能体\n权限\n模型设置\n活动\n策略\n管理员\n管理员 信任\n自我管理\n角色\n设置\n设置 信任\n请求\n配置";
                };
            };
        };
        readonly reflection: {
            readonly request: {
                readonly base: "actually\nagent\nagent actually\nassess situation\nassess_situation\ncall\ncall runs\ncompletion\ndetails\ndetails platform\nevaluate interaction\nevaluate_interaction\nextract facts\nextract_facts\nextracts\nextracts facts\nfact classifier\nfact ops\nfact_classifier\nfact_ops\nfacts\nidentities\nidentities task\nonly\nonly agent\nplatform\npost\npost response\nreflect\nreflection\nreflection extracts\nrelationship\nrelationship details\nresponded\nresponse\nresponse reflection\nruns\nruns only\nself reflect\nself_reflect\nsemantic\nsingle\nsingle call\ntask\ntask completion";
                readonly locales: {
                    readonly es: "accion\nagente\ndetalles\nejecutar\nextraer\nherramienta\nllamada\nllamar\nllamar ejecutar\npublicacion\npublicar\nreflexion\nreflexion extraer\nsolicitud\ntarea";
                    readonly ko: "게시\n게시물\n도구\n성찰\n성찰 추출\n세부정보\n실행\n에이전트\n요청\n작업\n전화\n추출\n통화\n통화 실행";
                    readonly pt: "acao\nagente\nchamada\ndetalhes\nexecutar\nextrair\nferramenta\nligar\nligar executar\npostagem\npublicar\nreflexao\nreflexao extrair\nsolicitacao\ntarefa";
                    readonly tl: "agent\naksyon\ndetalye\ngawain\nkahilingan\nkasangkapan\nkunin\npagninilay\npagninilay kunin\npatakbuhin\npost\ntawag\ntawag patakbuhin";
                    readonly vi: "bai dang\nbài đăng\nchay\nchạy\nchi tiet\nchi tiết\ncong cu\ncông cụ\ngoi\ngọi\ngọi chạy\nhanh dong\nhành động\nnhiem vu\nnhiệm vụ\nphan anh\nphản ánh\nphản ánh trích xuất\ntac tu\ntác tử\ntrich xuat\ntrích xuất\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "代理\n任务\n反思\n反思 提取\n发布\n工具\n帖子\n拨打\n提取\n操作\n智能体\n详情\n请求\n运行\n通话\n通话 运行";
                };
            };
        };
        readonly relationship: {
            readonly request: {
                readonly base: "add\nadd contact\nadd contacts\nadd_contact\nask\nask long\nbelong\ncadence\ncadence follow\ncalendar relationship\ncall\ncomplete\ncomplete follow\ncontact\ncontact even\ncontact missing\ncontacts\ncontacts interactions\ncontacts relationship\ncontacts rolodex\ncreate\ncreate complete\ndated\ndays\ndays since\ndays_since\ndone\neven\neven contact\nfollow\nfollow days\nfollow list\nfollow relationship\nfollow tracker\nfollow tune\nfollow ups\nfollow_ups\nfollowup\nfollowups\ngraph\ngraph list\ninteraction\ninteractions\ninteractions ask\nlife\nlist\nlist add\nlist overdue\nlog interaction\nlog_interaction\nlong\nmark\nmark followup done\nmark_followup_done\nmemory relationship\nmessaging relationship\nmissing\nonly\nonly contacts\noverdue\noverdue follow\noverdue followups\noverdue_followups\nowner\npeople\nrelationship\nreminders\nrolodex\nrolodex follow\nsince\nsince contact\nsomeone\nsomeone create\nsubactions\ntalked\ntasks relationship\ntext\nthreshold\ntracker\ntune";
                readonly locales: {
                    readonly es: "accion\nagregar\nagregar contacto\namigo\nanadir\ncalendario\ncolega\ncompletar\ncompletar seguir\ncontacto\ncontactos\ncrear\ncrear completar\nfecha limite\ngente\nguardar memoria\nherramienta\nlistar\nlistar agregar\nllamada\nllamar\nmemoria\nmostrar\npendiente\npersona\npreguntar\nrecordar\nrecordatorio\nrecuerdo\nrelacion\nseguimiento\nseguir\nseguir listar\nsolicitud\ntarea\ntareas\nterminar";
                    readonly ko: "관계\n기억\n기억해\n도구\n동료\n리마인더\n마감일\n목록\n목록 추가\n사람\n생성\n생성 완료\n알림\n연락처\n완료\n완료 팔로우\n요청\n일정\n작업\n장기 기억\n전화\n질문\n추가\n추가 연락처\n친구\n캘린더\n통화\n팔로우\n팔로우 목록\n할 일\n회상\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nadicionar\nadicionar contato\nafazer\namigo\ncalendario\nchamada\ncolega\ncompletar\nconcluir\nconcluir seguir\ncontato\ncontatos\ncriar\ncriar concluir\nferramenta\nlembrar\nlembrete\nligar\nlistar\nlistar adicionar\nmemoria\nmostrar\nperguntar\npessoa\npessoas\nprazo\nrecordar\nrelacao\nsalvar memoria\nseguir\nseguir listar\nsolicitacao\ntarefa\ntarefas";
                    readonly tl: "aksyon\nalaala\nalalahanin\ncontact\ncontacts\ndeadline\nfollow up\ngumawa\ngumawa tapusin\nidagdag\nidagdag contact\nilista\nilista idagdag\nkahilingan\nkaibigan\nkalendaryo\nkasamahan\nkasangkapan\nlong term memory\nmagtanong\nmemory\npaalala\nrelasyon\nsundan\nsundan ilista\ntandaan\ntao\ntapusin\ntapusin sundan\ntask\ntawag\ntodo";
                    readonly vi: "cong cu\ncông cụ\nghi nho\nghi nhớ\ngoi\ngọi\nhanh dong\nhành động\nhoan thanh\nhoàn thành\nhoàn thành theo dõi\nhoi\nhỏi\nky uc\nký ức\nlich\nlịch\nlien he\nliên hệ\nliet ke\nliệt kê\nliệt kê thêm\nnguoi\nngười\nnhac nho\nnhắc nhở\nnho\nnhớ\nquan he\nquan hệ\ntac vu\ntác vụ\ntao\ntạo\ntạo hoàn thành\nthem\nthêm\nthêm liên hệ\ntheo doi\ntheo dõi\ntheo dõi liệt kê\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "人物\n任务\n关注\n关注 列出\n关系\n列出\n列出 添加\n创建\n创建 完成\n同事\n回忆\n完成\n完成 关注\n工具\n待办\n截止日期\n拨打\n提醒\n操作\n日历\n朋友\n添加\n添加 联系人\n联系人\n记住\n记忆\n询问\n请求\n跟进\n通话\n长期记忆";
                };
            };
        };
        readonly releaseBlock: {
            readonly request: {
                readonly base: "block\nblock rule\nbypass block rule\nbypass_block_rule\nconfirmation\nend block rule\nend_block_rule\nrelease\nrelease block\nrelease website\nrelease website block\nrelease_block\nrelease_website_block\nrequires\nrule\nrule requires\nwebsite\nwebsite block";
                readonly locales: {
                    readonly es: "accion\nbloquear\nbloquear regla\nherramienta\nregla\nsitio web\nsitio web bloquear\nsolicitud";
                    readonly ko: "규칙\n도구\n요청\n웹사이트\n웹사이트 차단\n작업\n차단\n차단 규칙";
                    readonly pt: "acao\nbloquear\nbloquear regra\nferramenta\nregra\nsite\nsite bloquear\nsolicitacao";
                    readonly tl: "aksyon\ni-block\ni-block panuntunan\nkahilingan\nkasangkapan\npanuntunan\nwebsite\nwebsite i-block";
                    readonly vi: "chan\nchặn\nchặn quy tắc\ncong cu\ncông cụ\nhanh dong\nhành động\nquy tac\nquy tắc\ntrang web\ntrang web chặn\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "工具\n操作\n网站\n网站 阻止\n规则\n请求\n阻止\n阻止 规则";
                };
            };
        };
        readonly requestElevation: {
            readonly request: {
                readonly base: "action\nadmin request elevation\nagent internal request elevation\nagent_internal request elevation\nelevate my permissions\nelevate_my_permissions\nelevation\ngrant me access\ngrant_me_access\nneed admin permission\nneed special access\nneed temporary access\nneed_admin_permission\nneed_special_access\nneed_temporary_access\npermissions\nrequest\nrequest elevated permissions\nrequest elevation\nrequest higher privileges\nrequest temporary\nrequest_elevated_permissions\nrequest_elevation\nrequest_higher_privileges\nsettings request elevation\nspecific\nspecific action\ntemporary\ntemporary permission request\ntemporary_permission_request";
                readonly locales: {
                    readonly es: "accion\nactivar\nadministrador\nadministrador solicitud\nagente\nagente solicitud\najustes\nconfiguracion\nconfiguracion solicitud\ndueño\nestado interno\ngestion interna\nherramienta\ninterno del agente\nmodelo\npedir\npermisos\npolitica\npreferencias\nroles\nsolicitud";
                    readonly ko: "관리자\n관리자 요청\n구성\n권한\n내부 상태\n도구\n모델 설정\n설정\n설정 요청\n소유자\n에이전트\n에이전트 내부\n에이전트 요청\n역할\n요청\n자체 관리\n작업\n정책\n토글\n환경설정";
                    readonly pt: "acao\nadministrador\nadministrador solicitacao\nagente\nagente solicitacao\nalternar\nconfiguracao\nconfiguracoes\nconfiguracoes solicitacao\ndono\nestado interno\nferramenta\nfuncoes\ngestao interna\ninterno do agente\nmodelo\npedir\npermissoes\npolitica\npreferencias\nsolicitacao";
                    readonly tl: "admin\nadmin kahilingan\nagent\nagent kahilingan\naksyon\nconfiguration\nhiling\ninternal ng agent\ninternal state\nkahilingan\nkasangkapan\nmay ari\nmodel settings\npahintulot\npatakaran\npreferences\nrole\nsariling pamamahala\nsettings\nsettings kahilingan\ntoggle";
                    readonly vi: "cai dat\ncài đặt\ncài đặt yêu cầu\ncấu hình\nchu so huu\nchủ sở hữu\ncong cu\ncông cụ\nhanh dong\nhành động\nnoi bo tac tu\nnội bộ tác tử\nquan tri\nquản trị\nquản trị yêu cầu\nquyen\nquyền\ntac tu\ntác tử\ntác tử yêu cầu\ntu quan ly\ntự quản lý\ntuy chon\ntùy chọn\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "代理\n代理 请求\n代理内部\n偏好\n内部状态\n工具\n开关\n所有者\n操作\n智能体\n权限\n模型设置\n策略\n管理员\n管理员 请求\n自我管理\n角色\n设置\n设置 请求\n请求\n配置";
                };
            };
        };
        readonly requestSecret: {
            readonly request: {
                readonly base: "administrator\nask for secret\nask_for_secret\nconnectors request secret\nmissing\nmissing secret\nmissing_secret\nneed secret\nneed_secret\nrequest\nrequest missing\nrequest secret\nrequest_secret\nrequire secret\nrequire_secret\nsecret\nsecret user\nsecrets request secret\nsettings request secret\nuser\nuser administrator";
                readonly locales: {
                    readonly es: "accion\nactivar\najustes\nclave api\nclave secreta\nconector\nconector solicitud secreto\nconfiguracion\nconfiguracion solicitud secreto\ncontraseña\ncredencial\ncuenta conectada\nherramienta\nintegracion\nmcp\nmodelo\noauth\npedir\npreferencias\npreguntar\npreguntar secreto\nsecreto\nsecreto solicitud secreto\nsecreto usuario\nsecretos\nsolicitud\nsolicitud secreto\ntoken\nusuario";
                    readonly ko: "api 키\n계정 연결\n구성\n도구\n모델 설정\n비밀\n비밀 사용자\n비밀 요청 비밀\n비밀번호\n사용자\n설정\n설정 요청 비밀\n시크릿\n오어스\n요청\n요청 비밀\n자격 증명\n작업\n질문\n질문 비밀\n커넥터\n커넥터 요청 비밀\n토글\n토큰\n통합\n환경설정";
                    readonly pt: "acao\nalternar\nchave api\nconector\nconector solicitacao segredo\nconfiguracao\nconfiguracoes\nconfiguracoes solicitacao segredo\nconta conectada\ncredencial\nferramenta\nintegracao\nmcp\nmodelo\noauth\npedir\nperguntar\nperguntar segredo\npreferencias\nsegredo\nsegredo solicitacao segredo\nsegredo usuario\nsegredos\nsenha\nsolicitacao\nsolicitacao segredo\ntoken\nusuario";
                    readonly tl: "account connection\naksyon\napi key\nconfiguration\nconnector\nconnector kahilingan secret\ncredential\ngumagamit\nhiling\nintegration\nkahilingan\nkahilingan secret\nkasangkapan\nmagtanong\nmagtanong secret\nmodel settings\noauth\npassword\npreferences\nsecret\nsecret kahilingan secret\nsecret user\nsettings\nsettings kahilingan secret\ntoggle\ntoken\nuser";
                    readonly vi: "bi mat\nbí mật\nbí mật người dùng\nbí mật yêu cầu bí mật\ncai dat\ncài đặt\ncài đặt yêu cầu bí mật\ncấu hình\ncong cu\ncông cụ\nhanh dong\nhành động\nhoi\nhỏi\nhỏi bí mật\nket noi\nkết nối\nkết nối yêu cầu bí mật\nkhoa api\nkhóa api\nmật khẩu\nnguoi dung\nngười dùng\noauth\ntài khoản\ntich hop\ntích hợp\ntoken\ntuy chon\ntùy chọn\nyeu cau\nyêu cầu\nyêu cầu bí mật";
                    readonly "zh-CN": "API 密钥\n令牌\n偏好\n凭据\n密码\n密钥\n密钥 用户\n密钥 请求 密钥\n工具\n开关\n授权\n操作\n模型设置\n用户\n秘密\n设置\n设置 请求 密钥\n询问\n询问 密钥\n请求\n请求 密钥\n账号连接\n连接器\n连接器 请求 密钥\n配置\n集成";
                };
            };
        };
        readonly role: {
            readonly request: {
                readonly base: "admin role\nrole\nsettings role";
                readonly locales: {
                    readonly es: "accion\nactivar\nadministrador\nadministrador rol\najustes\nconfiguracion\nconfiguracion rol\ndueño\nherramienta\nmodelo\npermisos\npolitica\npreferencias\nrol\nroles\nsolicitud";
                    readonly ko: "관리자\n관리자 역할\n구성\n권한\n도구\n모델 설정\n설정\n설정 역할\n소유자\n역할\n요청\n작업\n정책\n토글\n환경설정";
                    readonly pt: "acao\nadministrador\nadministrador funcao\nalternar\nconfiguracao\nconfiguracoes\nconfiguracoes funcao\ndono\nferramenta\nfuncao\nfuncoes\nmodelo\npapel\npermissoes\npolitica\npreferencias\nsolicitacao";
                    readonly tl: "admin\nadmin role\naksyon\nconfiguration\nkahilingan\nkasangkapan\nmay ari\nmodel settings\npahintulot\npatakaran\npreferences\nrole\nsettings\nsettings role\ntoggle";
                    readonly vi: "cai dat\ncài đặt\ncài đặt vai trò\ncấu hình\nchu so huu\nchủ sở hữu\ncong cu\ncông cụ\nhanh dong\nhành động\nquan tri\nquản trị\nquản trị vai trò\nquyen\nquyền\ntuy chon\ntùy chọn\nvai tro\nvai trò\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "偏好\n工具\n开关\n所有者\n操作\n权限\n模型设置\n策略\n管理员\n管理员 角色\n角色\n设置\n设置 角色\n请求\n配置";
                };
            };
        };
        readonly room: {
            readonly request: {
                readonly base: "auto\nauto unmute\nautomatic\nautomatic unmute\nchat\nchat name\nchat platform\nchat thread\nchat_thread\nconnector\nconnector chat\ncontacts room\ndefaults\ndefaults room\nduration\nfollow\nfollow channel\nfollow chat\nfollow room\nfollow thread\nfollow unfollow\nfollow_channel\nfollow_chat\nfollow_room\nfollow_thread\nhint\njoin room\njoin_room\nleave room\nleave_room\nmessaging room\nminutes\nminutes mute\nmute\nmute auto\nmute chat\nmute discord\nmute duration\nmute room\nmute telegram\nmute unmute\nmute_chat\nmute_discord\nmute_room\nmute_telegram\nname\nname room\noptional\noptional room\nplatform\nplatform chat\nreturns\nroom\nroom defaults\nroom platform\nroom subscription\nroom supplied\nroom targets\nscheduling\nsettings room\nsilence group chat\nsilence_group_chat\nspecific\nspecific connector\nstate\nstate mute\nsubscription\nsupplied\nsupplied mute\ntargets\nunfollow\nunfollow chat\nunfollow optional\nunfollow room\nunfollow thread\nunfollow_chat\nunfollow_room\nunfollow_thread\nunmute\nunmute chat\nunmute follow\nunmute hint\nunmute room\nunmute_chat\nunmute_room";
                readonly locales: {
                    readonly es: "accion\nactivar\najustes\namigo\nchat\ncolega\nconector\nconector chat\nconfiguracion\nconfiguracion sala\ncontacto\ncontacto sala\ncontactos\nconversacion\ndejar de seguir\ndejar de seguir chat\ndejar de seguir sala\ngente\nherramienta\nmodelo\npersona\npreferencias\nquitar silencio\nquitar silencio chat\nquitar silencio sala\nquitar silencio seguir\nrelacion\nsala\nseguir\nseguir chat\nseguir dejar de seguir\nseguir sala\nsilenciar\nsilenciar chat\nsilenciar discord\nsilenciar quitar silencio\nsilenciar sala\nsilenciar telegram\nsolicitud";
                    readonly ko: "관계\n구성\n대화\n도구\n동료\n모델 설정\n방\n사람\n설정\n설정 방\n연락처\n연락처 방\n요청\n음소거\n음소거 discord\n음소거 telegram\n음소거 방\n음소거 음소거 해제\n음소거 채팅\n음소거 해제\n음소거 해제 방\n음소거 해제 채팅\n음소거 해제 팔로우\n작업\n채팅\n채팅방\n친구\n커넥터\n커넥터 채팅\n토글\n팔로우\n팔로우 방\n팔로우 채팅\n팔로우 팔로우 해제\n팔로우 해제\n팔로우 해제 방\n팔로우 해제 채팅\n환경설정";
                    readonly pt: "acao\nalternar\namigo\nativar som\nativar som chat\nativar som sala\nativar som seguir\nchat\ncolega\nconector\nconector chat\nconfiguracao\nconfiguracoes\nconfiguracoes sala\ncontato\ncontato sala\ncontatos\nconversa\ndeixar de seguir\ndeixar de seguir chat\ndeixar de seguir sala\nferramenta\nmodelo\npessoa\npessoas\npreferencias\nrelacao\nsala\nseguir\nseguir chat\nseguir deixar de seguir\nseguir sala\nsilenciar\nsilenciar ativar som\nsilenciar chat\nsilenciar discord\nsilenciar sala\nsilenciar telegram\nsolicitacao";
                    readonly tl: "aksyon\nchat\nconfiguration\nconnector\nconnector chat\ncontact\ncontact room\ncontacts\ni-mute\ni-mute chat\ni-mute discord\ni-mute i-unmute\ni-mute room\ni-mute telegram\ni-unfollow\ni-unfollow chat\ni-unfollow room\ni-unmute\ni-unmute chat\ni-unmute room\ni-unmute sundan\nkahilingan\nkaibigan\nkasamahan\nkasangkapan\nkuwarto\nmodel settings\npreferences\nrelasyon\nroom\nsettings\nsettings room\nsundan\nsundan chat\nsundan i-unfollow\nsundan room\ntao\ntoggle\nusap";
                    readonly vi: "bat tieng\nbật tiếng\nbật tiếng phòng\nbật tiếng theo dõi\nbật tiếng trò chuyện\nbo theo doi\nbỏ theo dõi\nbỏ theo dõi phòng\nbỏ theo dõi trò chuyện\ncai dat\ncài đặt\ncài đặt phòng\ncấu hình\ncong cu\ncông cụ\nhanh dong\nhành động\nket noi\nkết nối\nkết nối trò chuyện\nlien he\nliên hệ\nliên hệ phòng\nnguoi\nngười\nphong\nphòng\nquan he\nquan hệ\ntat tieng\ntắt tiếng\ntắt tiếng bật tiếng\ntắt tiếng discord\ntắt tiếng phòng\ntắt tiếng telegram\ntắt tiếng trò chuyện\ntheo doi\ntheo dõi\ntheo dõi bỏ theo dõi\ntheo dõi phòng\ntheo dõi trò chuyện\ntro chuyen\ntrò chuyện\ntuy chon\ntùy chọn\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "人物\n偏好\n关注\n关注 取消关注\n关注 房间\n关注 聊天\n关系\n取消关注\n取消关注 房间\n取消关注 聊天\n取消静音\n取消静音 关注\n取消静音 房间\n取消静音 聊天\n同事\n工具\n开关\n房间\n操作\n朋友\n模型设置\n聊天\n聊天室\n联系人\n联系人 房间\n设置\n设置 房间\n请求\n连接器\n连接器 聊天\n配置\n静音\n静音 discord\n静音 telegram\n静音 取消静音\n静音 房间\n静音 聊天";
                };
            };
        };
        readonly runtime: {
            readonly request: {
                readonly base: "actions\nactions reload\nadmin runtime\nagent status runtime\nagent_internal runtime\nagent_status_runtime\napplies\navailable actions\navailable_actions\nawareness\nbounce runtime\nbounce_runtime\nbounces\ncheck self\ncheck status\ncloud\nconfig\nconnectors\nconnectors runtime\ncontrol\ncontrol status\ndescribe\ndescribe actions\ndescribe registered actions\ndescribe_registered_actions\ndetail\neliza\nfeatures\nfields\nfiltered\ngeneral runtime\nget runtime status\nget self status\nget_runtime_status\nget_self_status\nhandler\nhealth\njson\nlayer\nlist actions\nlist_actions\nlists\nmodule\nmy status\noptionally\npermissions\npermissions wallet\nplugin\npolymorphic\nprocess\nprovider\nproviders\nreboot\nreboot agent\nreboot_agent\nrefresh\nrefresh config\nrefresh_config\nregistered\nregistered actions\nregistered_actions\nreload\nreload agent\nreload config\nreload runtime\nreload runtime config\nreload_config\nreload_runtime\nreload_runtime_config\nreloadable\nrespawn\nrestart\nrestart agent\nrestart process\nrestart runtime\nrestart self\nrestart_agent\nrestart_process\nrestart_runtime\nreturns\nruntime\nruntime control\nruntime snapshot\nruntime status\nself\nself status\nservices\nsettings runtime\nsnapshots\nstatus\nstatus describe\nstatus self\nstatus snapshots\nsystem status\nwallet\nwallet runtime";
                readonly locales: {
                    readonly es: "accion\nactivar\nadministrador\nagente\nagente estado\najustes\nbilletera\nchat general\ncomprobar\nconector\nconfiguracion\ncontrolar\ncontrolar estado\nconversacion\ncuenta conectada\ndescribir\ndescribir accion\ndireccion\ndueño\nestado\nestado describir\nestado interno\nfirmar transaccion\ngeneral\ngestion interna\nhablar\nintegracion\ninterno del agente\nlistar\nlistar accion\nmcp\nmodelo\nmostrar\noauth\nobtener\nobtener estado\npermisos\nplugin\npolitica\npreferencias\nrespuesta\nrevisar\nrevisar estado\nroles\nsaldo\nsalud\ntransferir\nwallet";
                    readonly ko: "가져오기\n가져오기 상태\n거래 서명\n건강\n계정 연결\n관리자\n구성\n권한\n내부 상태\n답변\n도구\n말하기\n모델 설정\n목록\n목록 작업\n상태\n상태 설명\n설명\n설명 작업\n설정\n소유자\n에이전트\n에이전트 내부\n에이전트 상태\n역할\n오어스\n요청\n일반\n일반 대화\n자체 관리\n작업\n잔액\n전송\n정책\n제어\n제어 상태\n주소\n지갑\n채팅\n커넥터\n토글\n통합\n포트폴리오\n플러그인\n확인\n확인 상태\n환경설정";
                    readonly pt: "acao\nadministrador\nagente\nagente status\nalternar\nassinar transacao\ncarteira\nchat geral\nconector\nconfiguracao\nconfiguracoes\nconta conectada\ncontrolar\ncontrolar status\nconversa\ndescrever\ndescrever acao\ndono\nendereco\nestado\nestado interno\nfalar\nfuncoes\ngeral\ngestao interna\nintegracao\ninterno do agente\nlistar\nlistar acao\nmcp\nmodelo\nmostrar\noauth\nobter\nobter status\npermissoes\nplugin\npolitica\npreferencias\nresposta\nsaldo\nsaude\nstatus\nstatus descrever\ntransferir\nverificar\nverificar status\nwallet";
                    readonly tl: "account connection\naddress\nadmin\nagent\nagent status\naksyon\nbalance\nconfiguration\nconnector\ngeneral chat\nilarawan\nilarawan aksyon\nilista\nilista aksyon\nintegration\ninternal ng agent\ninternal state\nkahilingan\nkalusugan\nkasangkapan\nkontrol\nkontrol status\nkunin\nkunin status\nmakipag-usap\nmay ari\nmodel settings\noauth\npahintulot\npangkalahatan\npatakaran\nplugin\npreferences\nrole\nsagot\nsariling pamamahala\nsettings\nsign transaction\nstatus\nstatus ilarawan\nsuriin\nsuriin status\ntoggle\ntransfer\nusap\nwallet";
                    readonly vi: "cai dat\ncài đặt\ncấu hình\nchu so huu\nchủ sở hữu\ndieu khien\nđiều khiển\nđiều khiển trạng thái\nhanh dong\nhành động\nket noi\nkết nối\nkiem tra\nkiểm tra\nkiểm tra trạng thái\nký giao dịch\nlấy trạng thái\nliet ke\nliệt kê\nliệt kê hành động\nmo ta\nmô tả\nmô tả hành động\nnoi bo tac tu\nnội bộ tác tử\nnói chuyện\nquan tri\nquản trị\nso du\nsố dư\nsuc khoe\nsức khỏe\ntac tu\ntác tử\ntác tử trạng thái\ntài khoản\ntich hop\ntích hợp\ntra loi\ntrả lời\ntrang thai\ntrạng thái\ntro chuyen\ntrò chuyện\ntu quan ly\ntự quản lý\ntuy chon\ntùy chọn";
                    readonly "zh-CN": "代理\n代理 状态\n代理内部\n余额\n偏好\n健康\n内部状态\n列出\n列出 操作\n回复\n回答\n地址\n对话\n工具\n开关\n所有者\n投资组合\n授权\n控制\n控制 状态\n描述\n描述 操作\n插件\n操作\n普通聊天\n智能体\n权限\n检查\n检查 状态\n模型设置\n状态\n状态 描述\n策略\n签名交易\n管理员\n自我管理\n获取\n获取 状态\n角色\n设置\n请求\n账号连接\n转账\n连接器\n通用\n配置\n钱包\n集成";
                };
            };
        };
        readonly schedule: {
            readonly request: {
                readonly base: "activity\nactivity screen\ncalendar schedule\nevidence\nhealth\nhealth schedule\nhealth summary\ninference\ninference activity\ninspect\nmeal inference\nmeal_inference\nmeals\npassive\npassive schedule\nschedule\nschedule inference\nscreen\nscreen time\nscreen time schedule\nscreen_time schedule\nsleep\nsleep inference\nsleep_inference\nsummary\ntasks schedule\ntime\ntime health\nwindows";
                readonly locales: {
                    readonly es: "accion\nactividad\nactividad pantalla\nagendar\nbienestar\ncalendario\ncalendario programar\nejercicio\nenfoque\nfecha limite\nherramienta\nlimites de apps\nmedicina\npantalla\npantalla programar\npendiente\nprogramar\nrecordatorio\nsalud\nsalud programar\nseguimiento\nsintoma\nsolicitud\nsueño\ntarea\ntarea programar\ntareas\ntiempo de pantalla\nuso del dispositivo";
                    readonly ko: "건강\n건강 예약\n기기 사용\n도구\n리마인더\n마감일\n사용 보고서\n수면\n스크린 타임\n앱 제한\n약\n예약\n요청\n운동\n웰니스\n일정\n작업\n작업 예약\n증상\n집중\n캘린더\n캘린더 예약\n할 일\n화면\n화면 예약\n활동\n활동 화면\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\nagendar\natividade\natividade tela\nbem-estar\ncalendario\ncalendario agendar\nexercicio\nferramenta\nfoco\nlembrete\nlimites de app\nprazo\nremedio\nsaude\nsaude agendar\nsintoma\nsolicitacao\nsono\ntarefa\ntarefa agendar\ntarefas\ntela\ntela agendar\ntempo de tela\nuso do dispositivo";
                    readonly tl: "aksyon\naktibidad\naktibidad screen\napp limits\ndeadline\nehersisyo\nfocus\nfollow up\ngamit ng device\ngamot\ngawain\ngawain i-schedule\ni-schedule\nkahilingan\nkalendaryo\nkalendaryo i-schedule\nkalusugan\nkalusugan i-schedule\nkasangkapan\npaalala\nscreen\nscreen i-schedule\nscreen time\nsintomas\ntask\ntodo\ntulog\nwellness";
                    readonly vi: "cong cu\ncông cụ\ngiới hạn ứng dụng\nhanh dong\nhành động\nhoat dong\nhoạt động\nhoạt động màn hình\nlen lich\nlên lịch\nlich\nlịch\nlịch lên lịch\nman hinh\nmàn hình\nmàn hình lên lịch\nngu\nngủ\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnhiệm vụ lên lịch\nsuc khoe\nsức khỏe\nsức khỏe lên lịch\ntac vu\ntác vụ\ntập luyện\nthoi gian man hinh\nthời gian màn hình\ntrieu chung\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "专注\n任务\n任务 安排\n使用报告\n健康\n健康 安排\n安排\n屏幕\n屏幕 安排\n屏幕时间\n工具\n应用限制\n待办\n截止日期\n提醒\n操作\n日历\n日历 安排\n活动\n活动 屏幕\n症状\n睡眠\n药物\n设备使用\n请求\n跟进\n运动";
                };
            };
        };
        readonly scheduling: {
            readonly request: {
                readonly base: "calendar scheduling\ncancel\ncancel list\ncontacts scheduling\nfinalize\nfinalize scheduling negotiation\nfinalize_scheduling_negotiation\nlifecycle\nlist\nlist negotiations\nmanage scheduling negotiation\nmanage_scheduling_negotiation\nmessaging scheduling\nmulti\nmulti turn scheduling\nmulti_turn_scheduling\nnegotiate meeting\nnegotiate_meeting\nnegotiation\nnegotiations\nproposals\npropose\nrespond\nrespond to meeting proposal\nrespond_to_meeting_proposal\nscheduling\nstart\ntasks scheduling\nturn";
                readonly locales: {
                    readonly es: "accion\nadministrar\namigo\ncalendario\ncolega\ncontacto\ncontactos\nfecha limite\ngente\ngestionar\nherramienta\nlistar\nmostrar\npendiente\npersona\nrecordatorio\nrelacion\nseguimiento\nsolicitud\ntarea\ntareas";
                    readonly ko: "관계\n관리\n도구\n동료\n리마인더\n마감일\n목록\n사람\n연락처\n요청\n일정\n작업\n친구\n캘린더\n할 일\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\namigo\ncalendario\ncolega\ncontato\ncontatos\nferramenta\ngerenciar\nlembrete\nlistar\nmostrar\npessoa\npessoas\nprazo\nrelacao\nsolicitacao\ntarefa\ntarefas";
                    readonly tl: "aksyon\ncontact\ncontacts\ndeadline\nfollow up\ngawain\nilista\nkahilingan\nkaibigan\nkalendaryo\nkasamahan\nkasangkapan\npaalala\npamahalaan\nrelasyon\ntao\ntask\ntodo";
                    readonly vi: "cong cu\ncông cụ\nhanh dong\nhành động\nlich\nlịch\nlien he\nliên hệ\nliet ke\nliệt kê\nnguoi\nngười\nnhắc nhở\nnhiem vu\nnhiệm vụ\nquan he\nquan hệ\nquan ly\nquản lý\ntac vu\ntác vụ\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "人物\n任务\n关系\n列出\n同事\n工具\n待办\n截止日期\n提醒\n操作\n日历\n朋友\n管理\n联系人\n请求\n跟进";
                };
            };
        };
        readonly searchLinearIssues: {
            readonly request: {
                readonly base: "connectors search linear issues\nfilter\nfilters\nfind linear issues\nfind_linear_issues\nfind-linear-issues\nissue\nissue linear\nissues\nissues linear\nknowledge search linear issues\nlinear\nlinear various\nlist linear issues\nlist_linear_issues\nlist-linear-issues\nquery linear issues\nquery_linear_issues\nquery-linear-issues\nsearch\nsearch issue\nsearch issues\nsearch linear issues\nsearch_linear_issues\nsearch-linear-issues\ntasks search linear issues\nvarious";
                readonly locales: {
                    readonly es: "accion\nbuscar\nbuscar incidencia\nbuscar linear incidencia\nconector\nconector buscar linear incidencia\nconocimiento\nconocimiento buscar linear incidencia\nconsulta\nconsulta linear incidencia\ncuenta conectada\nencontrar\nfecha limite\nhechos guardados\nherramienta\nincidencia\nincidencia linear\nintegracion\nlinear\nlistar\nlistar linear incidencia\nmcp\nmostrar\nnotas guardadas\noauth\npendiente\nrecordar\nrecordatorio\nseguimiento\nsolicitud\ntarea\ntarea buscar linear incidencia\ntareas";
                    readonly ko: "검색\n검색 리니어 이슈\n검색 이슈\n계정 연결\n도구\n리니어\n리마인더\n마감일\n목록\n목록 리니어 이슈\n오어스\n요청\n이슈\n이슈 리니어\n작업\n작업 검색 리니어 이슈\n저장된 노트\n저장된 사실\n지식\n지식 검색 리니어 이슈\n질의\n찾기\n찾기 리니어 이슈\n커넥터\n커넥터 검색 리니어 이슈\n쿼리\n쿼리 리니어 이슈\n통합\n할 일\n회상\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\nbuscar\nbuscar linear problema\nbuscar problema\nconector\nconector buscar linear problema\nconhecimento\nconhecimento buscar linear problema\nconsulta\nconsulta linear problema\nconta conectada\nencontrar\nencontrar linear problema\nfatos salvos\nferramenta\nintegracao\nissue\nlembrar\nlembrete\nlinear\nlistar\nlistar linear problema\nmcp\nmostrar\nnotas salvas\noauth\nprazo\nproblema\nproblema linear\nsolicitacao\ntarefa\ntarefa buscar linear problema\ntarefas";
                    readonly tl: "account connection\naksyon\nalalahanin\nconnector\nconnector maghanap linear isyu\ndeadline\nfollow up\ngawain\ngawain maghanap linear isyu\nhanapin\nhanapin linear isyu\nilista\nilista linear isyu\nintegration\nisyu\nisyu linear\nkaalaman\nkaalaman maghanap linear isyu\nkahilingan\nkasangkapan\nlinear\nmaghanap\nmaghanap isyu\nmaghanap linear isyu\noauth\npaalala\nquery\nquery linear isyu\nsaved facts\nsaved notes\ntask\ntodo";
                    readonly vi: "cong cu\ncông cụ\nghi chu da luu\nghi chú đã lưu\nhanh dong\nhành động\nket noi\nkết nối\nkết nối tìm kiếm linear vấn đề\nkien thuc\nkiến thức\nkiến thức tìm kiếm linear vấn đề\nliet ke\nliệt kê\nliệt kê linear vấn đề\nlinear\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnhiệm vụ tìm kiếm linear vấn đề\nnhớ lại\noauth\ntac vu\ntác vụ\ntài khoản\ntich hop\ntích hợp\ntim\ntìm\ntim kiem\ntìm kiếm\ntìm kiếm linear vấn đề\ntìm kiếm vấn đề\ntìm linear vấn đề\ntruy van\ntruy vấn\ntruy vấn linear vấn đề\nvan de\nvấn đề\nvấn đề linear\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "linear\n任务\n任务 搜索 linear 问题\n列出\n列出 linear 问题\n回忆\n工具\n已保存事实\n已保存笔记\n待办\n截止日期\n授权\n提醒\n搜索\n搜索 linear 问题\n搜索 问题\n操作\n查找\n查找 linear 问题\n查询\n查询 linear 问题\n知识\n知识 搜索 linear 问题\n语义搜索\n请求\n账号连接\n跟进\n连接器\n连接器 搜索 linear 问题\n问题\n问题 linear\n集成";
                };
            };
        };
        readonly secretsUpdateSettings: {
            readonly request: {
                readonly base: "admin\nconfiguration\nconfigure\nconnectors secrets update settings\nduring\nfirst-run\nowner\nowner admin\nprocess\nsave setting\nsave_setting\nsaves\nsecrets secrets update settings\nsecrets update settings\nsecrets_update_settings\nset configuration\nset_configuration\nsetting\nsettings secrets update settings\nupdate setting\nupdate_setting\nworld";
                readonly locales: {
                    readonly es: "accion\nactivar\nactualizar\nadministrador\najustes\nclave api\nclave secreta\nconector\nconector secreto actualizar configuracion\nconfiguracion\nconfiguracion secreto actualizar configuracion\nconfigurar\ncontraseña\ncredencial\ncuenta conectada\nherramienta\nintegracion\nmcp\nmodelo\noauth\npreferencias\nsecreto\nsecreto actualizar configuracion\nsecreto secreto actualizar configuracion\nsecretos\nsolicitud\ntoken";
                    readonly ko: "api 키\n계정 연결\n관리자\n구성\n도구\n모델 설정\n비밀\n비밀 비밀 업데이트 설정\n비밀 업데이트 설정\n비밀번호\n설정\n설정 비밀 업데이트 설정\n시크릿\n업데이트\n오어스\n요청\n자격 증명\n작업\n커넥터\n커넥터 비밀 업데이트 설정\n토글\n토큰\n통합\n환경설정";
                    readonly pt: "acao\nadministrador\nalternar\natualizar\nchave api\nconector\nconector segredo atualizar configuracoes\nconfiguracao\nconfiguracoes\nconfiguracoes segredo atualizar configuracoes\nconfigurar\nconta conectada\ncredencial\nferramenta\nintegracao\nmcp\nmodelo\noauth\npreferencias\nsegredo\nsegredo atualizar configuracoes\nsegredo segredo atualizar configuracoes\nsegredos\nsenha\nsolicitacao\ntoken";
                    readonly tl: "account connection\nadmin\naksyon\napi key\nconfiguration\nconnector\nconnector secret i-update settings\ncredential\ni-configure\ni-update\nintegration\nkahilingan\nkasangkapan\nmodel settings\noauth\npassword\npreferences\nsecret\nsecret i-update settings\nsecret secret i-update settings\nsettings\nsettings secret i-update settings\ntoggle\ntoken";
                    readonly vi: "bi mat\nbí mật\nbí mật bí mật cập nhật cài đặt\nbí mật cập nhật cài đặt\ncai dat\ncài đặt\ncài đặt bí mật cập nhật cài đặt\ncap nhat\ncập nhật\ncau hinh\ncấu hình\ncong cu\ncông cụ\nhanh dong\nhành động\nket noi\nkết nối\nkết nối bí mật cập nhật cài đặt\nkhoa api\nkhóa api\nmật khẩu\noauth\nquan tri\nquản trị\ntài khoản\ntich hop\ntích hợp\ntoken\ntuy chon\ntùy chọn\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "API 密钥\n令牌\n偏好\n凭据\n密码\n密钥\n密钥 密钥 更新 设置\n密钥 更新 设置\n工具\n开关\n授权\n操作\n更新\n模型设置\n秘密\n管理员\n设置\n设置 密钥 更新 设置\n请求\n账号连接\n连接器\n连接器 密钥 更新 设置\n配置\n集成";
                };
            };
        };
        readonly securityEvaluator: {
            readonly request: {
                readonly base: "security evaluator\nsecurity_evaluator\nsecurityevaluator";
                readonly locales: {
                    readonly es: "accion\nherramienta\nsolicitud";
                    readonly ko: "도구\n요청\n작업";
                    readonly pt: "acao\nferramenta\nsolicitacao";
                    readonly tl: "aksyon\nkahilingan\nkasangkapan";
                    readonly vi: "cong cu\ncông cụ\nhanh dong\nhành động\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "工具\n操作\n请求";
                };
            };
        };
        readonly sendToAdmin: {
            readonly request: {
                readonly base: "admin\nadmin send to admin\nadmin user\nagent internal send to admin\nagent_internal send to admin\nautonomous\ncontext\ndirectly\ndirectly admin\nmessage\nmessage directly\nmessaging send to admin\nsend\nsend message\nsend to admin\nsend_to_admin\nuser\nuser autonomous\ntell admin\nnotify admin\ninform admin\nupdate admin\nmessage admin\ncommunicate\nreport\nalert";
                readonly locales: {
                    readonly es: "accion\nadministrador\nadministrador enviar administrador\nadministrador usuario\nagente\nagente enviar administrador\ndueño\nenviar\nenviar administrador\nenviar mensaje\nestado interno\ngestion interna\nherramienta\ninterno del agente\nmensaje\npermisos\npolitica\nroles\nsolicitud\nusuario\navisa al administrador\ninforma al administrador\nmensaje al administrador\nenvía al administrador\nenvia al administrador\nalerta";
                    readonly ko: "관리자\n관리자 보내기 관리자\n관리자 사용자\n권한\n내부 상태\n도구\n메시지\n보내기\n보내기 관리자\n보내기 메시지\n사용자\n소유자\n에이전트\n에이전트 내부\n에이전트 보내기 관리자\n역할\n요청\n자체 관리\n작업\n정책\n관리자에게 알려\n관리자에게 통지\n관리자에게 보고\n관리자에게 메시지 보내\n경고";
                    readonly pt: "acao\nadministrador\nadministrador enviar administrador\nadministrador usuario\nagente\nagente enviar administrador\ndono\nenviar\nenviar administrador\nenviar mensagem\nestado interno\nferramenta\nfuncoes\ngestao interna\ninterno do agente\nmensagem\npermissoes\npolitica\nsolicitacao\nusuario\nusuário\navise o administrador\ninforme o administrador\nmensagem ao administrador\nenvie ao administrador\nalerta";
                    readonly tl: "admin\nadmin ipadala admin\nadmin user\nagent\nagent ipadala admin\naksyon\ngumagamit\ninternal ng agent\ninternal state\nipadala\nipadala admin\nipadala mensahe\nkahilingan\nkasangkapan\nmay ari\nmensahe\npahintulot\npatakaran\nrole\nsariling pamamahala\nuser\nsabihin sa admin\nipaalam sa admin\ni-message ang admin\niulat\nalerto";
                    readonly vi: "chu so huu\nchủ sở hữu\ncong cu\ncông cụ\ngui\ngửi\ngửi quản trị\ngửi tin nhắn\nhanh dong\nhành động\nnguoi dung\nngười dùng\nnoi bo tac tu\nnội bộ tác tử\nquan tri\nquản trị\nquản trị gửi quản trị\nquản trị người dùng\nquyen\nquyền\ntac tu\ntác tử\ntác tử gửi quản trị\ntin nhan\ntin nhắn\ntu quan ly\ntự quản lý\nyeu cau\nyêu cầu\nquản trị viên\nquan tri vien\nbáo quản trị viên\nbao quan tri vien\nnhắn quản trị viên\nnhan quan tri vien\ncảnh báo\ncanh bao";
                    readonly "zh-CN": "代理\n代理 发送 管理员\n代理内部\n内部状态\n发送\n发送 消息\n发送 管理员\n工具\n所有者\n操作\n智能体\n权限\n消息\n用户\n策略\n管理员\n管理员 发送 管理员\n管理员 用户\n自我管理\n角色\n请求\n告诉管理员\n通知管理员\n向管理员汇报\n给管理员发消息\n警报";
                };
            };
        };
        readonly setFollowupThreshold: {
            readonly request: {
                readonly base: "calendar set followup threshold\nchange followup interval\nchange_followup_interval\ncontacts set followup threshold\nfollowup rule\nfollowup_rule\nset contact frequency days\nset followup threshold\nset_contact_frequency_days\nset_followup_threshold\nsettings set followup threshold\ntasks set followup threshold";
                readonly locales: {
                    readonly es: "accion\nactivar\najustes\namigo\ncalendario\ncolega\nconfiguracion\ncontacto\ncontactos\nfecha limite\ngente\nherramienta\nmodelo\npendiente\npersona\npreferencias\nrecordatorio\nregla\nrelacion\nseguimiento\nsolicitud\ntarea\ntareas";
                    readonly ko: "관계\n구성\n규칙\n도구\n동료\n리마인더\n마감일\n모델 설정\n사람\n설정\n연락처\n요청\n일정\n작업\n친구\n캘린더\n토글\n할 일\n환경설정\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\nalternar\namigo\ncalendario\ncolega\nconfiguracao\nconfiguracoes\ncontato\ncontatos\nferramenta\nlembrete\nmodelo\npessoa\npessoas\nprazo\npreferencias\nregra\nrelacao\nsolicitacao\ntarefa\ntarefas";
                    readonly tl: "aksyon\nconfiguration\ncontact\ncontacts\ndeadline\nfollow up\ngawain\nkahilingan\nkaibigan\nkalendaryo\nkasamahan\nkasangkapan\nmodel settings\npaalala\npanuntunan\npreferences\nrelasyon\nsettings\ntao\ntask\ntodo\ntoggle";
                    readonly vi: "cai dat\ncài đặt\ncấu hình\ncong cu\ncông cụ\nhanh dong\nhành động\nlich\nlịch\nlien he\nliên hệ\nnguoi\nngười\nnhắc nhở\nnhiem vu\nnhiệm vụ\nquan he\nquan hệ\nquy tac\nquy tắc\ntac vu\ntác vụ\ntuy chon\ntùy chọn\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "人物\n任务\n偏好\n关系\n同事\n工具\n开关\n待办\n截止日期\n提醒\n操作\n日历\n朋友\n模型设置\n联系人\n规则\n设置\n请求\n跟进\n配置";
                };
            };
        };
        readonly setSecret: {
            readonly request: {
                readonly base: "agent\nconfigure secret\nconfigure_secret\nconnectors set secret\nkey\nkey token\npassword\npassword agent\nsave key\nsave secret\nsave_key\nsave_secret\nsecret\nsecret value\nsecrets set secret\nset api key\nset env var\nset secret\nset token\nset_api_key\nset_env_var\nset_secret\nset_token\nsettings set secret\nstore api key\nstore secret\nstore_api_key\nstore_secret\ntoken\ntoken password\nvalue\nvalue key";
                readonly locales: {
                    readonly es: "accion\nactivar\nagente\najustes\napi clave\nclave\nclave api\nclave secreta\nclave token\nconector\nconector secreto\nconfiguracion\nconfiguracion secreto\nconfigurar\nconfigurar secreto\ncontrasena\ncontraseña\ncontrasena agente\ncredencial\ncuenta conectada\nherramienta\nintegracion\nmcp\nmodelo\noauth\npreferencias\nsecreto\nsecreto secreto\nsecretos\nsolicitud\ntecla\ntienda\ntienda api clave\ntienda secreto\ntoken\ntoken contrasena";
                    readonly ko: "api 키\n계정 연결\n구성\n도구\n모델 설정\n비밀\n비밀 비밀\n비밀번호\n비밀번호 에이전트\n상점\n상점 api 키\n상점 비밀\n설정\n설정 비밀\n스토어\n시크릿\n에이전트\n오어스\n요청\n자격 증명\n작업\n커넥터\n커넥터 비밀\n키\n키 토큰\n토글\n토큰\n토큰 비밀번호\n통합\n환경설정";
                    readonly pt: "acao\nagente\nalternar\napi chave\nchave\nchave api\nchave token\nconector\nconector segredo\nconfiguracao\nconfiguracoes\nconfiguracoes segredo\nconfigurar\nconfigurar segredo\nconta conectada\ncredencial\nferramenta\nintegracao\nloja\nloja api chave\nloja segredo\nmcp\nmodelo\noauth\npreferencias\nsegredo\nsegredo segredo\nsegredos\nsenha\nsenha agente\nsolicitacao\ntecla\ntoken\ntoken senha";
                    readonly tl: "account connection\nagent\naksyon\napi key\nconfiguration\nconnector\nconnector secret\ncredential\ni-configure\ni-configure secret\nintegration\nkahilingan\nkasangkapan\nkey\nkey token\nmodel settings\noauth\npassword\npassword agent\npreferences\nsecret\nsecret secret\nsettings\nsettings secret\ntindahan\ntindahan api key\ntindahan secret\ntoggle\ntoken\ntoken password";
                    readonly vi: "api khóa\nbi mat\nbí mật\nbí mật bí mật\ncai dat\ncài đặt\ncài đặt bí mật\ncau hinh\ncấu hình\ncấu hình bí mật\ncong cu\ncông cụ\ncua hang\ncửa hàng\ncửa hàng api khóa\ncửa hàng bí mật\nhanh dong\nhành động\nket noi\nkết nối\nkết nối bí mật\nkhoa\nkhóa\nkhoa api\nkhóa api\nkhóa token\nmat khau\nmật khẩu\nmật khẩu tác tử\noauth\nphim\nphím\ntac tu\ntác tử\ntài khoản\ntich hop\ntích hợp\ntoken\ntoken mật khẩu\ntuy chon\ntùy chọn\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "API 密钥\napi 键\n代币\n代币 密码\n代理\n令牌\n偏好\n凭据\n商店\n商店 api 键\n商店 密钥\n密码\n密码 代理\n密钥\n密钥 密钥\n工具\n开关\n授权\n操作\n智能体\n模型设置\n秘密\n设置\n设置 密钥\n请求\n账号连接\n连接器\n连接器 密钥\n配置\n配置 密钥\n键\n键 代币\n集成";
                };
            };
        };
        readonly settings: {
            readonly request: {
                readonly base: "admin settings\nagent internal settings\napp permission\napp permissions\napply update\nask for camera\nask for microphone\nauto training\nautomatic training\nbackup agent\nchange accent\nchange permission\nchange permissions\nchange setting\nchange theme mode\nchange ui language\nchange update channel\nchange wallet rpc\ncheck for updates\nconfigure auto\ncreate agent backup\ndisable auto training\ndisable shell\ndisable shell access\ndispatch update\neliza cloud rpc\nenable auto training\nenable shell\nenable shell access\nfilesystem access\ngeneral settings\nget setting\ngrant app access\ngrant app permission\ngrant filesystem access\ngrant network access\ngrant permission\ngrant shell access\nhome time widget\nlist settings\nname write\nnetwork access\npolymorphic settings\nremember name\nrequest os permission\nrequest permission\nrestore agent backup\nrevoke app access\nrevoke app permission\nrevoke filesystem access\nrevoke network access\nrevoke permission\nrevoke shell access\nroute backend\nsave name\nset accent\nset backend\nset brain backend\nset coding backend\nset name\nset owner name\nset permission\nset theme mode\nset ui language\nset user name\nset wallet rpc\nsettings mutation\nsettings registry\nsettings settings\nsettings write\nshell access\nshell permission\nshell permissions\nshow backends\nsystem settings\ntoggle auto training\ntoggle capability\ntoggle configure\ntoggle permission\ntoggle setting\ntoggle shell access\nturn off shell\nturn off shell access\nupdate ai provider\nupdate owner name\nupdate provider\nupdate settings\nupdate status\nvoice continuous chat\nvoice end of turn\nvoice settings\nvoice vad settings\nwallet rpc\nwallet rpc provider\nworld settings\nwrite world";
                readonly locales: {
                    readonly es: "accion obtener\nactivar\nactualizar\nactualizar configuracion\nactualizar estado\nadministrador\nadministrador configuracion\nagente\nagente configuracion\najustes\naplicacion\napp\nchat general\nconfiguracion\nconfiguracion accion\nconfiguracion escribir\nconfiguracion obtener\nconfiguracion operacion\nconversacion\ncrear\ncrear agente\ndesactivar\ndiagnostico\ndueño\nejecutar configuracion\nescribir\nestado interno\ngeneral configuracion\ngestion interna\nhablar\ninterno del agente\nlistar\nlistar configuracion\nmodelo\nmostrar\nobtener\nobtener listar\noperacion\npermisos\npolitica\npreferencias\nproceso\nrespuesta\nrevisar actualizar\nroles\nruntime\nsistema\nusuario";
                    readonly ko: "가져오기\n가져오기 목록\n관리자\n관리자 설정\n구성\n권한\n내부 상태\n답변\n런타임\n말하기\n모델 설정\n목록\n목록 설정\n비활성화\n사용자\n생성\n생성 에이전트\n설정\n설정 가져오기\n설정 쓰기\n설정 작업\n소유자\n시스템\n실행 설정\n쓰기\n앱\n업데이트\n업데이트 상태\n업데이트 설정\n에이전트\n에이전트 내부\n에이전트 설정\n역할\n요청\n운영 명령\n일반 대화\n일반 설정\n자체 관리\n작업 가져오기\n정책\n진단\n질문\n채팅\n토글\n프로세스\n확인 업데이트\n환경설정\n활성화";
                    readonly pt: "acao obter\nadministrador\nadministrador configuracoes\nagente\nagente configuracoes\nalternar\naplicativo\nativar\natualizar\natualizar configuracoes\natualizar status\nchat geral\nconfiguracao\nconfiguracoes\nconfiguracoes acao\nconfiguracoes escrever\nconfiguracoes obter\nconfiguracoes operacao\nconversa\ncriar\ncriar agente\ndesativar\ndiagnostico\ndono\nescrever\nestado interno\nexecutar configuracoes\nfalar\nfuncoes\ngeral configuracoes\ngestao interna\ninterno do agente\nlistar\nlistar configuracoes\nmodelo\nmostrar\nobter\nobter listar\noperacao\npermissoes\npolitica\npreferencias\nprocesso\nresposta\nruntime\nsistema\nusuario\nverificar atualizar";
                    readonly tl: "admin\nadmin settings\nagent\nagent settings\naksyon kunin\napp\nconfiguration\ndiagnostics\ngeneral chat\ngumagamit\ngumawa\ngumawa agent\ni-disable\ni-enable\ni-update\ni-update settings\ni-update status\nilista\nilista settings\ninternal ng agent\ninternal state\nisulat\nkunin\nkunin ilista\nmakipag-usap\nmay ari\nmodel settings\noperation\npahintulot\npangkalahatan settings\npatakaran\npatakbuhin settings\npreferences\nprocess\nrole\nruntime\nsagot\nsariling pamamahala\nsettings\nsettings aksyon\nsettings isulat\nsettings kunin\nsettings operasyon\nsuriin i-update\nsystem\ntoggle\nusap\nuser";
                    readonly vi: "cai dat\ncài đặt\ncài đặt viết\ncap nhat\ncập nhật\ncập nhật cài đặt\ncập nhật trạng thái\ncau hinh\ncấu hình\nchan doan\nchẩn đoán\nchu so huu\nchủ sở hữu\nchung cài đặt\nhe thong\nhệ thống\nkiem tra\nkiểm tra\nkiểm tra cập nhật\nliet ke\nliệt kê\nliệt kê cài đặt\nnguoi dung\nngười dùng\nnoi bo tac tu\nnội bộ tác tử\nnói chuyện\nquan tri\nquản trị\nquản trị cài đặt\ntac tu\ntác tử\ntác tử cài đặt\ntạo tác tử\ntra loi\ntrả lời\ntrang thai\ntrạng thái\ntro chuyen\ntrò chuyện\ntu quan ly\ntự quản lý\ntuy chon\ntùy chọn\nung dung\nứng dụng\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "代理\n代理 设置\n代理内部\n偏好\n内部状态\n写入\n列出\n列出 设置\n创建\n创建 代理\n启用\n回复\n回答\n对话\n应用\n开关\n所有者\n操作 获取\n普通聊天\n智能体\n更新\n更新 状态\n更新 设置\n权限\n检查 更新\n模型设置\n用户\n禁用\n策略\n管理员\n管理员 设置\n系统\n自我管理\n获取\n获取 列出\n角色\n设置\n设置 写入\n设置 操作\n设置 获取\n诊断\n请求\n运维命令\n运行 设置\n运行时\n进程\n通用 设置\n配置";
                };
            };
        };
        readonly shopify: {
            readonly request: {
                readonly base: "adjust inventory\nadjust_inventory\nadjustments\nadjustments orders\nautomation shopify\nbrowsing\nbrowsing products\ncatalog\ncheck inventory\ncheck orders\ncheck stock\ncheck_inventory\ncheck_orders\ncheck_stock\nconnectors shopify\ncreate product\ncreate_product\ncrud\ncrud products\ncustomers\ncustomers products\nexplicitly\nfind customer\nfind_customer\nfulfill order\nfulfill_order\ninferred\ninferred message\ninventory\ninventory orders\ninventory stock\nknowledge shopify\nlist\nlist customers\nlist orders\nlist products\nlist update\nlist_customers\nlist_orders\nlist_products\nmanage\nmanage shopify\nmanage shopify customers\nmanage shopify inventory\nmanage shopify orders\nmanage shopify products\nmanage_shopify_customers\nmanage_shopify_inventory\nmanage_shopify_orders\nmanage_shopify_products\nmessage\nmessage text\nonly\noperations\noperations search\norder status\norder_status\norders\norders customers\norders list\npayments shopify\nproducts\nproducts crud\nproducts inventory\nproducts orders\nprovided\nread\nread only\nsearch\nsearch customers\nsearch products\nsearch read\nsearch_customers\nsearch_products\nshopify\nshopify search\nshopify store\nstock\nstock adjustments\nstore\nstore operations\ntext\nupdate\nupdate orders\nupdate product\nupdate stock\nupdate_product\nupdate_stock";
                readonly locales: {
                    readonly es: "actualizar producto\nactualizar stock\najustar inventario\nautomatizacion shopify\nbuscar cliente\nbuscar leer\nbuscar producto\ncheckout\ncliente producto\ncobro\nconector\nconector shopify\nconocimiento shopify\ncrear producto\ncuenta conectada\ncumplir pedido\nfactura\nflujo de trabajo\ngestionar shopify\ngestionar shopify cliente\ngestionar shopify inventario\ngestionar shopify pedido\ngestionar shopify producto\nhechos guardados\ninferido mensaje\nintegracion\ninventario pedido\ninventario stock\nlistar actualizar\nlistar cliente\nlistar pedido\nlistar producto\nnotas guardadas\noperacion buscar\npagar\npago\npago shopify\npedido cliente\npedido estado\npedido listar\nproducto inventario\nproducto pedido\nrevisar inventario\nrevisar pedido\nrevisar stock\nshopify buscar\nshopify tienda\ntienda operacion";
                    readonly ko: "검색 고객\n검색 상품\n검색 읽기\n결제\n결제 쇼피파이\n계정 연결\n고객 상품\n관리 쇼피파이\n관리 쇼피파이 고객\n관리 쇼피파이 상품\n관리 쇼피파이 재고\n관리 쇼피파이 주문\n목록 고객\n목록 상품\n목록 업데이트\n목록 주문\n상점 작업\n상품 재고\n상품 주문\n생성 상품\n쇼피파이 검색\n쇼피파이 상점\n업데이트 상품\n업데이트 재고\n오어스\n요금\n자동화 쇼피파이\n작업 검색\n재고 재고\n재고 주문\n저장된 노트\n저장된 사실\n조정 재고\n주문 고객\n주문 목록\n주문 상태\n지불\n지식 쇼피파이\n찾기 고객\n처리 주문\n청구서\n체크아웃\n추론 메시지\n커넥터\n커넥터 쇼피파이\n통합\n확인 재고\n확인 주문";
                    readonly pt: "ajustar inventario\natualizar estoque\natualizar produto\nautomacao shopify\nbuscar cliente\nbuscar ler\nbuscar produto\ncheckout\ncliente produto\ncobranca\nconector\nconector shopify\nconhecimento shopify\nconta conectada\ncriar produto\nencontrar cliente\nfatos salvos\nfatura\nfluxo de trabalho\ngerenciar shopify\ngerenciar shopify cliente\ngerenciar shopify inventario\ngerenciar shopify pedido\ngerenciar shopify produto\ninferido mensagem\ninventario estoque\ninventario pedido\nlistar atualizar\nlistar cliente\nlistar pedido\nlistar produto\nloja operacao\nnotas salvas\noperacao buscar\npagamento\npagamento shopify\npagar\npedido cliente\npedido listar\npedido status\nprocessar pedido\nproduto inventario\nproduto pedido\nshopify buscar\nshopify loja\nverificar estoque\nverificar inventario\nverificar pedido";
                    readonly tl: "account connection\nautomation shopify\nayusin imbentaryo\nbayad\nbayad shopify\nbilling\ncheckout\nconnector\nconnector shopify\ncustomer produkto\ngumawa produkto\nhanapin customer\nhinula mensahe\ni-update produkto\ni-update stock\nilista customer\nilista i-update\nilista order\nilista produkto\nimbentaryo order\nimbentaryo stock\nintegration\ninvoice\nkaalaman shopify\nmagbayad\nmaghanap basahin\nmaghanap customer\nmaghanap produkto\noperasyon maghanap\norder customer\norder ilista\norder status\npamahalaan shopify\npamahalaan shopify customer\npamahalaan shopify imbentaryo\npamahalaan shopify order\npamahalaan shopify produkto\nprodukto imbentaryo\nprodukto order\nsaved facts\nsaved notes\nshopify maghanap\nshopify tindahan\nsuriin imbentaryo\nsuriin order\nsuriin stock\ntindahan operasyon\ntuparin order";
                    readonly vi: "cap nhat\ncập nhật\ncập nhật sản phẩm\ncua hang\ncửa hàng\ndon hang\nđơn hàng\nghi chu da luu\nghi chú đã lưu\nhang ton kho\nhàng tồn kho\nhoa don\nhóa đơn\nket noi\nkết nối\nkhach hang\nkhách hàng\nkich hoat\nkiểm tra\nkiểm tra hàng tồn kho\nkien thuc\nkiến thức\nliet ke\nliệt kê\nliệt kê sản phẩm\nnhớ lại\nquan ly\nquản lý\nquản lý shopify đơn hàng\nquản lý shopify hàng tồn kho\nquản lý shopify khách hàng\nquản lý shopify sản phẩm\nquy trinh\nquy trình\nsan pham\nsản phẩm\ntài khoản\ntạo sản phẩm\nthanh toan\nthanh toán\ntich hop\ntích hợp\ntim kiem\ntìm kiếm\ntìm kiếm sản phẩm\ntính tiền\ntu dong hoa\ntự động hóa";
                    readonly "zh-CN": "shopify 商店\nshopify 搜索\n产品 库存\n产品 订单\n付款\n付款 shopify\n列出 产品\n列出 客户\n列出 更新\n列出 订单\n创建 产品\n发票\n商店 操作\n客户 产品\n履约 订单\n工作流\n库存 库存\n库存 订单\n授权\n推断 消息\n搜索 产品\n搜索 客户\n搜索 读取\n操作 搜索\n支付\n更新 产品\n更新 库存\n查找 客户\n检查 库存\n检查 订单\n知识 shopify\n管理 shopify\n管理 shopify 产品\n管理 shopify 客户\n管理 shopify 库存\n管理 shopify 订单\n结账\n自动化\n自动化 shopify\n订单 列出\n订单 客户\n订单 状态\n调整 库存\n账单\n账号连接\n连接器\n连接器 shopify\n集成";
                };
            };
        };
        readonly skill: {
            readonly request: {
                readonly base: "action\naction chips\nactivation\nautomation skill\navailable\navailable skills\nbefore\nbrowse\nbrowse skills\nbundled\nbundled skill\ncatalog\ncatalog operations\ncatalog search\ncategory\nchips\nchips enable\nclaw\nconnectors skill\ncopy\ncopy details\ndetailed\ndetails\ndetails info\ndetails sync\ndisable\ndisable install\ndisable installed\ndisable skill\ndiscover skills\neach\nenable\nenable disable\nenable skill\nenabled\nfind skills\nget\nget detailed\nget skill\nincluding\ninfo\ninformation\ninstall\ninstall copy\ninstall install\ninstall registry\ninstall skill\ninstall uninstall\ninstalled\ninstalled skill\ninstead\ninvoking\nkeyword\nknowledge skill\nlist skills\nmanage\nmanage skill\noperations\noperations search\nowner\nrefresh\nregistry\nremove\nremove bundled\nresult\nresult action\nreturns\nreturns action\nscanned\nsearch\nsearch browse\nsearch details\nsearch skill\nsecurity\nsettings skill\nskill\nskill catalog\nskill claw\nskill details\nskill disable\nskill enable\nskill including\nskill info\nskill install\nskill registry\nskill sync\nskill version\nskills\nskills details\nskills keyword\nspecific\nspecific skill\nstats\nsync skill\ntoggle enable\ntoggle install";
                readonly locales: {
                    readonly es: "accion\nactivar\nactivar desactivar\nactivar habilidad\najustes\nautomatizacion\nautomatizacion habilidad\nbuscar\nbuscar detalles\nbuscar habilidad\nconector\nconector habilidad\nconfiguracion\nconocimiento\nconocimiento habilidad\ncron\ncuenta conectada\ndesactivar\ndesactivar habilidad\ndesactivar instalar\ndetalles\ndisparador\nencontrar\nflujo de trabajo\ngestionar habilidad\nhabilidad\nhabilidad activar\nhabilidad desactivar\nhabilidad detalles\nhabilidad instalar\nhechos guardados\ninstalar habilidad\ninstalar instalar\nintegracion\nlistar\nlistar habilidad\nmcp\nmodelo\nmonitor\nmostrar\nnotas guardadas\noauth\nobtener habilidad\noperacion\noperacion buscar\npreferencias\nrecordar\nskill";
                    readonly ko: "가져오기\n가져오기 스킬\n검색\n검색 세부정보\n검색 스킬\n계정 연결\n관리 스킬\n구성\n모니터\n모델 설정\n목록\n목록 스킬\n비활성화\n비활성화 설치\n비활성화 스킬\n설정\n설치\n설치 설치\n설치 스킬\n세부정보\n스킬\n스킬 비활성화\n스킬 설치\n스킬 세부정보\n스킬 활성화\n오어스\n워크플로\n자동화\n자동화 스킬\n작업\n작업 검색\n저장된 노트\n저장된 사실\n지식\n지식 스킬\n찾기\n찾기 스킬\n커넥터\n커넥터 스킬\n크론\n토글\n통합\n트리거\n환경설정\n활성화\n활성화 비활성화\n활성화 스킬\n회상";
                    readonly pt: "acao\nalternar\nativar desativar\nativar habilidade\nautomacao\nautomacao habilidade\nbuscar\nbuscar detalhes\nbuscar habilidade\nconector\nconector habilidade\nconfiguracao\nconfiguracoes\nconhecimento\nconhecimento habilidade\nconta conectada\ncron\ndesativar habilidade\ndesativar instalar\ndetalhes\nencontrar\nencontrar habilidade\nfatos salvos\nfluxo de trabalho\ngatilho\ngerenciar habilidade\nhabilidade\nhabilidade ativar\nhabilidade desativar\nhabilidade detalhes\nhabilidade instalar\ninstalar habilidade\ninstalar instalar\nintegracao\nlembrar\nlistar\nlistar habilidade\nmcp\nmodelo\nmonitor\nmostrar\nnotas salvas\noauth\nobter habilidade\noperacao\noperacao buscar\npreferencias\nskill";
                    readonly tl: "account connection\naksyon\nalalahanin\nautomation\nautomation skill\nconfiguration\nconnector\nconnector skill\ncron\ndetalye\nhanapin\nhanapin skill\ni-disable\ni-disable i-install\ni-disable skill\ni-enable\ni-enable i-disable\ni-enable skill\ni-install i-install\ni-install skill\nilista\nilista skill\nintegration\nkaalaman\nkaalaman skill\nkasanayan\nkunin skill\nmaghanap\nmaghanap detalye\nmaghanap skill\nmodel settings\nmonitor\noauth\noperasyon\noperasyon maghanap\npamahalaan skill\npreferences\nsaved facts\nsaved notes\nsettings\nskill\nskill detalye\nskill i-disable\nskill i-enable\nskill i-install\ntoggle\ntrigger\nworkflow";
                    readonly vi: "bật kỹ năng\nbật tắt\ncai dat\ncài đặt\ncài đặt cài đặt\ncài đặt kỹ năng\ncấu hình\nchi tiet\nchi tiết\nghi chu da luu\nghi chú đã lưu\nhanh dong\nhành động\nket noi\nkết nối\nkết nối kỹ năng\nkich hoat\nkien thuc\nkiến thức\nkiến thức kỹ năng\nky nang\nkỹ năng\nkỹ năng chi tiết\nlấy kỹ năng\nliet ke\nliệt kê\nliệt kê kỹ năng\nnhớ lại\nquan ly\nquản lý\nquản lý kỹ năng\nquy trinh\nquy trình\ntài khoản\ntắt cài đặt\ntắt kỹ năng\nthao tac\nthao tác\ntich hop\ntích hợp\ntim kiem\ntìm kiếm\ntìm kỹ năng\ntu dong hoa\ntự động hóa\ntự động hóa kỹ năng\ntuy chon\ntùy chọn";
                    readonly "zh-CN": "偏好\n列出\n列出 技能\n启用\n启用 技能\n启用 禁用\n回忆\n安装\n安装 安装\n安装 技能\n定时\n工作流\n已保存事实\n已保存笔记\n开关\n技能\n技能 启用\n技能 安装\n技能 禁用\n技能 详情\n授权\n搜索\n搜索 技能\n搜索 详情\n操作\n操作 搜索\n查找\n查找 技能\n模型设置\n监控\n知识\n知识 技能\n禁用\n禁用 安装\n禁用 技能\n管理 技能\n自动化\n自动化 技能\n获取 技能\n触发器\n设置\n详情\n语义搜索\n账号连接\n连接器\n连接器 技能\n配置\n集成";
                };
            };
        };
        readonly skillCommand: {
            readonly request: {
                readonly base: "/skill\nadmin skill command\nagent internal skill command\nagent_internal skill command\nautomation skill command\ncommand\ncommand install\ncommand installed\ncontextual\ndispatch\nguidance\ninstall\ninstall skill\ninstalled\ninstalled skill\ninstruction\ninstructions\nload\nload skill\nloads\nloads skill\nrespond\nresponds\nskill\nskill command\nskill instruction\nskill instructions\nskill load\nskill loads\nskill_command\nslash\nslash command";
                readonly locales: {
                    readonly es: "accion\nadministrador\nadministrador habilidad comando\nagente\nagente habilidad comando\nautomatizacion\nautomatizacion habilidad comando\ncomando\ncomando instalar\ncron\ndisparador\ndueño\nestado interno\nflujo de trabajo\ngestion interna\nhabilidad\nhabilidad comando\nherramienta\ninstalar\ninstalar habilidad\ninterno del agente\nmonitor\npermisos\npolitica\nroles\nskill\nsolicitud";
                    readonly ko: "관리자\n관리자 스킬 명령\n권한\n내부 상태\n도구\n명령\n명령 설치\n모니터\n설치\n설치 스킬\n소유자\n스킬\n스킬 명령\n에이전트\n에이전트 내부\n에이전트 스킬 명령\n역할\n요청\n워크플로\n자동화\n자동화 스킬 명령\n자체 관리\n작업\n정책\n크론\n트리거";
                    readonly pt: "acao\nadministrador\nadministrador habilidade comando\nagente\nagente habilidade comando\nautomacao\nautomacao habilidade comando\ncomando\ncomando instalar\ncron\ndono\nestado interno\nferramenta\nfluxo de trabalho\nfuncoes\ngatilho\ngestao interna\nhabilidade\nhabilidade comando\ninstalar\ninstalar habilidade\ninterno do agente\nmonitor\npermissoes\npolitica\nskill\nsolicitacao";
                    readonly tl: "admin\nadmin skill command\nagent\nagent skill command\naksyon\nautomation\nautomation skill command\ncommand\ncommand i-install\ncron\ni-install\ni-install skill\ninternal ng agent\ninternal state\nkahilingan\nkasanayan\nkasangkapan\nmay ari\nmonitor\npahintulot\npatakaran\nrole\nsariling pamamahala\nskill\nskill command\ntrigger\nworkflow";
                    readonly vi: "cai dat\ncài đặt\ncài đặt kỹ năng\nchu so huu\nchủ sở hữu\ncong cu\ncông cụ\nhanh dong\nhành động\nkich hoat\nky nang\nkỹ năng\nkỹ năng lệnh\nlenh\nlệnh\nlệnh cài đặt\nnoi bo tac tu\nnội bộ tác tử\nquan tri\nquản trị\nquản trị kỹ năng lệnh\nquy trinh\nquy trình\nquyen\nquyền\ntac tu\ntác tử\ntác tử kỹ năng lệnh\ntu dong hoa\ntự động hóa\ntự động hóa kỹ năng lệnh\ntu quan ly\ntự quản lý\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "代理\n代理 技能 命令\n代理内部\n内部状态\n命令\n命令 安装\n安装\n安装 技能\n定时\n工作流\n工具\n所有者\n技能\n技能 命令\n操作\n智能体\n权限\n监控\n策略\n管理员\n管理员 技能 命令\n自动化\n自动化 技能 命令\n自我管理\n角色\n触发器\n请求";
                };
            };
        };
        readonly stream: {
            readonly request: {
                readonly base: "automation stream\ncalls\ncalls dashboard\nconnectors stream\ncontrol\ncontrol local\ndashboard\ndashboard stream\ndispatches\nget stream status\nget_stream_status\ngo live\ngo offline\ngo_live\ngo_offline\nis live\nis_live\nlocal\nmedia stream\npipeline\nplatform\nplatforms\npumpfun\nrtmp\nstart\nstart stop\nstart stream\nstart_stream\nstatus\nstatus calls\nstatus platforms\nstop\nstop status\nstop stream\nstop_stream\nstream\nstream start\nstream status\nstream twitch\nstream_status\nstreaming\ntarget\ntwitch\nyoutube";
                readonly locales: {
                    readonly es: "accion\naudio\nautomatizacion\nautomatizacion transmitir\ncaptura\nconector\nconector transmitir\ncontrolar\ncron\ncuenta conectada\ndetener\ndetener estado\ndetener transmitir\ndisparador\nestado\nestado llamar\nflujo de trabajo\nherramienta\nimagen\nintegracion\nllamada\nllamar\nmcp\nmonitor\nmultimedia\nmultimedia transmitir\noauth\nobtener\nobtener transmitir estado\nparar\nsolicitud\nstream\ntranscripcion\ntransmitir\ntransmitir estado\nvideo";
                    readonly ko: "가져오기\n가져오기 스트림 상태\n계정 연결\n도구\n모니터\n미디어\n미디어 스트림\n방송\n비디오\n상태\n상태 통화\n스크린샷\n스트림\n스트림 상태\n오디오\n오어스\n요청\n워크플로\n이미지\n자동화\n자동화 스트림\n작업\n전사\n전화\n제어\n중지\n중지 상태\n중지 스트림\n커넥터\n커넥터 스트림\n크론\n통합\n통화\n트리거";
                    readonly pt: "acao\naudio\nautomacao\nautomacao transmitir\ncaptura\nchamada\nconector\nconector transmitir\nconta conectada\ncontrolar\ncron\nestado\nferramenta\nfluxo de trabalho\ngatilho\nimagem\nintegracao\nligar\nmcp\nmidia\nmidia transmitir\nmonitor\noauth\nobter\nobter transmitir status\nparar\nparar status\nparar transmitir\nsolicitacao\nstatus\nstatus ligar\nstream\ntranscricao\ntransmitir\ntransmitir status\nvideo";
                    readonly tl: "account connection\naksyon\naudio\nautomation\nautomation stream\nconnector\nconnector stream\ncron\nintegration\nitigil\nitigil status\nitigil stream\nkahilingan\nkasangkapan\nkontrol\nkunin\nkunin stream status\nlarawan\nmedia\nmedia stream\nmonitor\noauth\nscreenshot\nstatus\nstatus tawag\nstream\nstream status\ntawag\ntranscript\ntrigger\nvideo\nworkflow";
                    readonly vi: "âm thanh\ncong cu\ncông cụ\nda phuong tien\nđa phương tiện\nđa phương tiện phát trực tiếp\ndieu khien\nđiều khiển\ndung\ndừng\ndừng phát trực tiếp\ndừng trạng thái\ngoi\ngọi\nhanh dong\nhành động\nhinh anh\nhình ảnh\nket noi\nkết nối\nkết nối phát trực tiếp\nkich hoat\nlay\nlấy\nlấy phát trực tiếp trạng thái\noauth\nphat truc tiep\nphát trực tiếp\nphát trực tiếp trạng thái\nquy trinh\nquy trình\ntài khoản\ntich hop\ntích hợp\ntrang thai\ntrạng thái\ntrạng thái gọi\ntu dong hoa\ntự động hóa\ntự động hóa phát trực tiếp\nvideo\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "停止\n停止 状态\n停止 直播\n图片\n媒体\n媒体 直播\n定时\n工作流\n工具\n截图\n拨打\n授权\n控制\n操作\n状态\n状态 通话\n监控\n直播\n直播 状态\n视频\n自动化\n自动化 直播\n获取\n获取 直播 状态\n触发器\n请求\n账号连接\n转录\n连接器\n连接器 直播\n通话\n集成\n音频";
                };
            };
        };
        readonly tailscale: {
            readonly request: {
                readonly base: "active\nactive tunnel\nadmin tailscale\nclose\nclose active\ncome\nconnectors tailscale\nlocal\nopen\nopen tunnel\noperations\noperations start\nport\nport stop\nprovider\nreads\nreads come\nrouter\nrouter operations\nsettings tailscale\nstart\nstart open\nstart tunnel\nstatus\nstatus provider\nstatus reads\nstop\nstop close\nstop tunnel\ntailscale\ntailscale status\ntailscale tunnel\ntunnel\ntunnel local\ntunnel router\ntunnel status\ntunnel stop";
                readonly locales: {
                    readonly es: "abrir\nabrir tunel\naccion\nactivar\nactivo\nactivo tunel\nadministrador\najustes\nconector\nconfiguracion\ncuenta conectada\ndetener\ndetener tunel\ndueño\nestado\nestado leer\nherramienta\nintegracion\nleer\nmcp\nmodelo\noauth\noperacion\nparar\npermisos\npolitica\npreferencias\nroles\nsolicitud\ntunel\ntunel detener\ntunel estado";
                    readonly ko: "계정 연결\n관리자\n구성\n권한\n도구\n모델 설정\n상태\n상태 읽기\n설정\n소유자\n역할\n열기\n열기 터널\n오어스\n요청\n읽기\n작업\n정책\n중지\n중지 터널\n커넥터\n터널\n터널 상태\n터널 중지\n토글\n통합\n환경설정\n활성\n활성 터널";
                    readonly pt: "abrir\nabrir tunel\nacao\nadministrador\nalternar\nativo\nativo tunel\nconector\nconfiguracao\nconfiguracoes\nconta conectada\ndono\nestado\nferramenta\nfuncoes\nintegracao\nler\nmcp\nmodelo\noauth\noperacao\nparar\nparar tunel\npermissoes\npolitica\npreferencias\nsolicitacao\nstatus\nstatus ler\ntunel\ntunel parar\ntunel status";
                    readonly tl: "account connection\nadmin\naksyon\naktibo\naktibo tunnel\nbasahin\nbuksan\nbuksan tunnel\nconfiguration\nconnector\nintegration\nitigil\nitigil tunnel\nkahilingan\nkasangkapan\nmay ari\nmodel settings\noauth\noperasyon\npahintulot\npatakaran\npreferences\nrole\nsettings\nstatus\nstatus basahin\ntoggle\ntunnel\ntunnel itigil\ntunnel status";
                    readonly vi: "cai dat\ncài đặt\ncấu hình\nchu so huu\nchủ sở hữu\ncong cu\ncông cụ\ndang hoat dong\nđang hoạt động\nđang hoạt động đường hầm\ndoc\nđọc\ndung\ndừng\ndừng đường hầm\nduong ham\nđường hầm\nđường hầm dừng\nđường hầm trạng thái\nhanh dong\nhành động\nket noi\nkết nối\nmo\nmở\nmở đường hầm\noauth\nquan tri\nquản trị\nquyen\nquyền\ntài khoản\nthao tac\nthao tác\ntich hop\ntích hợp\ntrang thai\ntrạng thái\ntrạng thái đọc\ntuy chon\ntùy chọn\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "偏好\n停止\n停止 隧道\n工具\n开关\n所有者\n打开\n打开 隧道\n授权\n操作\n权限\n模型设置\n活跃\n活跃 隧道\n状态\n状态 读取\n策略\n管理员\n角色\n设置\n请求\n读取\n账号连接\n连接器\n配置\n隧道\n隧道 停止\n隧道 状态\n集成";
                };
            };
        };
        readonly tasks: {
            readonly request: {
                readonly base: "abort task\narchive coding task\narchive task\narchive task thread\nautomation tasks\ncan i see it\ncancel agent\ncancel task\ncancel task agent\nclone repo\nclose coding task\nclose issue\ncode tasks\ncode this\ncomment issue\ncommit and pr\ncontinue task\ncontrol task\ncount tasks\ncreate agent\ncreate agent task\ncreate coding agent\ncreate issue\ncreate pr\ncreate subtask\ncreate task\ncreate workspace\nend coding session\nfinalize workspace\nfinish workspace\nget active agents\nget issue\nget task history\ninput to agent\nkill coding agent\nkill task\nlaunch coding agent\nlaunch coding task\nlaunch task\nlist agents\nlist coding agents\nlist issues\nlist sessions\nlist sub agents\nlist task history\nmanage issues\nmessage agent\nmessage coding agent\npause task\nprepare workspace\nprovision workspace\npull it up\nreopen coding task\nreopen task\nrespond to agent\nresume coding task\nresume task\nrun coding agent\nrun coding task\nsend to agent\nsend to coding agent\nsetup workspace\nshare task result\nshow coding agents\nshow coding sessions\nshow task agents\nshow task artifact\nshow task status\nshow tasks\nspawn agent\nspawn and provision\nspawn coder\nspawn coding agent\nspawn sub agent\nstart agent task\nstart coding agent\nstart coding task\nstart task agent\nstop agent\nstop coding agent\nstop sub agent\nstop subtask\nstop task\nsubmit changes\nsubmit workspace\ntask control\ntask history\ntask share\ntask status history\ntasks tasks\ntell coding agent\ntell task agent\nterminate agent\nunarchive coding task\nupdate issue\nview task output";
                readonly locales: {
                    readonly es: "actualizar incidencia\nagente enviar\nagente listar\nagente tarea\narchivar tarea\nautomatizacion tarea\ncodigo tarea\ncomentario incidencia\ncontrolar tarea\ncrear agente\ncrear agente tarea\ncrear espacio de trabajo\ncrear incidencia\ncrear pr\ncrear tarea\ncuenta conectada\ndetener agente\ndetener tarea\nejecutar agente\nejecutar tarea\nenviar agente\nenviar detener\nespacio de trabajo\nespacio de trabajo gestionar\nestado interno\nfecha limite\nfinalizar espacio de trabajo\nflujo de trabajo\ngestion interna\ngestionar incidencia\nhistorial controlar\nincidencia archivar\ninterno del agente\nlistar agente\nlistar incidencia\nlistar tarea historial\nmensaje agente\nobtener activo agente\nobtener incidencia\nobtener tarea historial\ntarea\ntarea agente\ntarea controlar\ntarea crear\ntarea estado\ntarea estado historial\ntarea historial\ntareas";
                    readonly ko: "가져오기 이슈\n가져오기 작업 기록\n가져오기 활성 에이전트\n계정 연결\n관리 이슈\n기록 제어\n내부 상태\n댓글 이슈\n리마인더\n마감일\n메시지 에이전트\n목록 에이전트\n목록 이슈\n목록 작업 기록\n보관 작업\n보내기 에이전트\n보내기 중지\n생성 pr\n생성 에이전트\n생성 에이전트 작업\n생성 이슈\n생성 작업\n생성 작업공간\n실행 에이전트\n실행 작업\n업데이트 이슈\n에이전트 내부\n에이전트 목록\n에이전트 보내기\n에이전트 작업\n완료 작업공간\n이슈 보관\n자동화 작업\n자체 관리\n작업\n작업 기록\n작업 상태\n작업 상태 기록\n작업 생성\n작업 에이전트\n작업 제어\n작업공간 관리\n제어 작업\n중지 에이전트\n중지 작업\n코드 작업\n할 일\n후속 조치";
                    readonly pt: "afazer\nagente enviar\nagente listar\nagente tarefa\narquivar tarefa\natualizar problema\nautomacao tarefa\ncodigo tarefa\ncomentario problema\nconta conectada\ncontrolar tarefa\ncriar agente\ncriar agente tarefa\ncriar pr\ncriar problema\ncriar tarefa\ncriar workspace\nenviar agente\nenviar parar\nespaco de trabalho\nestado interno\nexecutar agente\nexecutar tarefa\nfinalizar workspace\nfluxo de trabalho\ngerenciar problema\ngestao interna\nhistorico controlar\ninterno do agente\nlistar agente\nlistar problema\nlistar tarefa historico\nmensagem agente\nobter ativo agente\nobter problema\nobter tarefa historico\nparar agente\nparar tarefa\nproblema arquivar\ntarefa\ntarefa agente\ntarefa controlar\ntarefa criar\ntarefa historico\ntarefa status\ntarefa status historico\ntarefas\nworkspace gerenciar";
                    readonly tl: "account connection\nagent gawain\nagent ilista\nagent ipadala\nautomation gawain\ncode gawain\ndeadline\nfollow up\ngawain agent\ngawain gumawa\ngawain history\ngawain kontrol\ngawain status\ngawain status history\ngumawa agent\ngumawa agent gawain\ngumawa gawain\ngumawa isyu\ngumawa pr\ngumawa workspace\nhistory kontrol\ni-archive gawain\ni-update isyu\nilista agent\nilista gawain history\nilista isyu\ninternal ng agent\ninternal state\nipadala agent\nipadala itigil\nisyu i-archive\nitigil agent\nitigil gawain\nkomento isyu\nkontrol gawain\nkunin aktibo agent\nkunin gawain history\nkunin isyu\nmensahe agent\npaalala\npamahalaan isyu\npatakbuhin agent\npatakbuhin gawain\nsariling pamamahala\ntapusin workspace\ntask\ntodo\nworkspace pamahalaan";
                    readonly vi: "chạy nhiệm vụ\nchạy tác tử\ndang hoat dong\nđang hoạt động\ndừng tác tử\ngửi tác tử\nket noi\nkết nối\nkho ma\nkho mã\nkich hoat\nkiểm thử\nlap trinh\nlập trình\nlấy đang hoạt động tác tử\nliet ke\nliệt kê\nliệt kê tác tử\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnhiệm vụ tác tử\nnhiệm vụ trạng thái\nnoi bo tac tu\nnội bộ tác tử\nquy trinh\nquy trình\ntac tu\ntác tử\ntác tử nhiệm vụ\ntac vu\ntác vụ\ntài khoản\ntạo nhiệm vụ\ntạo tác tử\ntạo tác tử nhiệm vụ\ntich hop\ntích hợp\ntin nhan\ntin nhắn\ntin nhắn tác tử\ntrạng thái\ntu dong hoa\ntự động hóa\ntu quan ly\ntự quản lý\nviec can lam\nviệc cần làm";
                    readonly "zh-CN": "仓库\n代理 任务\n代理 列出\n代理 发送\n代码\n代码 任务\n任务\n任务 代理\n任务 创建\n任务 历史\n任务 控制\n任务 状态\n任务 状态 历史\n停止 代理\n停止 任务\n列出 代理\n列出 任务 历史\n列出 问题\n创建 pr\n创建 代理\n创建 代理 任务\n创建 任务\n创建 工作区\n创建 问题\n历史 控制\n发送 代理\n发送 停止\n实现\n工作区 管理\n归档 任务\n待办\n截止日期\n控制 任务\n提醒\n更新 问题\n消息 代理\n管理 问题\n结束 工作区\n编程\n自动化 任务\n获取 任务 历史\n获取 活跃 代理\n获取 问题\n评论 问题\n跟进\n运行 代理\n运行 任务\n问题 归档";
                };
            };
        };
        readonly todo: {
            readonly request: {
                readonly base: "agent internal todo\nagent_internal todo\nautomation todo\ncancel\ncancel delete\ncancel todo\ncancel_todo\nclear\nclear todos\nclear user\nclear_todos\ncomplete\ncomplete cancel\ncomplete list\ncomplete todo\ncomplete_todo\ncreate\ncreate complete\ncreate todo\ncreate update\ncreate_todo\ndelete\ndelete list\ndelete todo\ndelete_todo\nedit\nedit delete\nentity\nfinish todo\nfinish_todo\nget todos\nget_todos\nlist\nlist clear\nlist edit\nlist requests\nlist todos\nlist write\nlist_todos\nmanage\nmanage list\noperation\nremove todo\nremove_todo\nrequests\nrequests user\nroute\nroute todo\nscoped\nset todos\nset_todos\nshow todos\nshow_todos\ntask\ntasks\ntasks todo\ntodo\ntodo cancel\ntodo clear\ntodo complete\ntodo create\ntodo delete\ntodo list\ntodo manage\ntodo operation\ntodo update\ntodo write\ntodo_cancel\ntodo_clear\ntodo_complete\ntodo_create\ntodo_delete\ntodo_list\ntodo_update\ntodo_write\ntodos\ntodos todo\nupdate\nupdate complete\nupdate todo\nupdate todos\nupdate_todo\nupdate_todos\nuser\nuser create\nuser scoped\nwrite\nwrite create\nwrite todos\nwrite_todos";
                readonly locales: {
                    readonly es: "actualizar completar\nactualizar todo\nagente todo\nautomatizacion todo\nborrar tarea\ncompletar listar\ncompletar tarea\ncompletar todo\ncrear actualizar\ncrear completar\ncrear todo\neditar eliminar\neliminar listar\neliminar todo\nescribir crear\nescribir todo\nestado interno\nfecha limite\nfinalizar todo\nflujo de trabajo\ngestion interna\ngestionar listar\ninterno del agente\nlimpiar todo\nlimpiar usuario\nlista de tareas\nlistar editar\nlistar escribir\nlistar limpiar\nlistar solicitud\nlistar todo\nobtener todo\npendiente\npendientes\nsolicitud usuario\ntarea\ntarea todo\ntareas\ntodo actualizar\ntodo completar\ntodo crear\ntodo eliminar\ntodo escribir\ntodo gestionar\ntodo limpiar\ntodo listar\ntodo operacion\nusuario crear";
                    readonly ko: "가져오기 할일\n관리 목록\n내부 상태\n리마인더\n마감일\n목록 쓰기\n목록 요청\n목록 지우기\n목록 편집\n목록 할일\n사용자 생성\n삭제 목록\n삭제 할일\n생성 업데이트\n생성 완료\n생성 할일\n쓰기 생성\n쓰기 할일\n업데이트 완료\n업데이트 할일\n에이전트 내부\n에이전트 할일\n완료 목록\n완료 할일\n요청 사용자\n자동화 할일\n자체 관리\n작업\n작업 목록\n작업 삭제\n작업 완료\n작업 할일\n제거 할일\n지우기 사용자\n지우기 할일\n편집 삭제\n할 일\n할일 관리\n할일 목록\n할일 삭제\n할일 생성\n할일 쓰기\n할일 업데이트\n할일 완료\n할일 작업\n할일 지우기\n활성 작업\n후속 조치";
                    readonly pt: "afazer\nafazeres\nagente todo\napagar tarefa\natualizar concluir\natualizar todo\nautomacao todo\nconcluir listar\nconcluir tarefa\nconcluir todo\ncriar atualizar\ncriar concluir\ncriar todo\neditar excluir\nescrever criar\nescrever todo\nestado interno\nexcluir listar\nexcluir todo\nfinalizar todo\nfluxo de trabalho\ngerenciar listar\ngestao interna\ninterno do agente\nlimpar todo\nlimpar usuario\nlista de tarefas\nlistar editar\nlistar escrever\nlistar limpar\nlistar solicitacao\nlistar todo\nobter todo\nremover todo\nsolicitacao usuario\ntarefa\ntarefa todo\ntarefas\ntodo atualizar\ntodo concluir\ntodo criar\ntodo escrever\ntodo excluir\ntodo gerenciar\ntodo limpar\ntodo listar\ntodo operacao\nusuario criar";
                    readonly tl: "agent todo\nalisin todo\nautomation\nautomation todo\nburahin ilista\nburahin task\nburahin todo\ndeadline\nfollow up\ngawain todo\ngumawa i-update\ngumawa tapusin\ngumawa todo\ni-edit burahin\ni-update tapusin\ni-update todo\nilista i-edit\nilista isulat\nilista kahilingan\nilista linisin\nilista todo\ninternal ng agent\ninternal state\nisulat gumawa\nisulat todo\nkahilingan user\nkumpletuhin task\nkunin todo\nlinisin todo\nlinisin user\npaalala\npamahalaan ilista\nsariling pamamahala\ntapusin ilista\ntapusin todo\ntask\ntask list\ntodo\ntodo burahin\ntodo gumawa\ntodo i-update\ntodo ilista\ntodo isulat\ntodo linisin\ntodo operasyon\ntodo pamahalaan\ntodo tapusin\nuser gumawa";
                    readonly vi: "cap nhat\ncập nhật\ncập nhật việc cần làm\ndanh sách tác vụ\ngỡ việc cần làm\nhoan thanh\nhoàn thành\nhoàn thành tác vụ\nhoàn thành việc cần làm\nket thuc\nkết thúc\nkết thúc việc cần làm\nkich hoat\nlấy việc cần làm\nliet ke\nliệt kê\nliệt kê việc cần làm\nnguoi dung\nngười dùng\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnoi bo tac tu\nnội bộ tác tử\nquy trinh\nquy trình\ntac tu\ntác tử\ntác tử việc cần làm\ntac vu\ntác vụ\ntạo việc cần làm\ntu dong hoa\ntự động hóa\ntự động hóa việc cần làm\ntu quan ly\ntự quản lý\nviec can lam\nviệc cần làm\nviệc cần làm cập nhật\nviệc cần làm hoàn thành\nviệc cần làm liệt kê\nviệc cần làm tạo\nviệc cần làm viết\nviệc cần làm xóa\nviết việc cần làm\nxóa người dùng\nxóa việc cần làm";
                    readonly "zh-CN": "代理 待办\n代理内部\n任务\n任务 待办\n任务列表\n内部状态\n写入 创建\n写入 待办\n列出 写入\n列出 待办\n列出 清除\n列出 编辑\n列出 请求\n创建 完成\n创建 待办\n创建 更新\n删除 列出\n删除 待办\n删除任务\n完成 列出\n完成 待办\n完成任务\n待办\n待办 写入\n待办 列出\n待办 创建\n待办 删除\n待办 完成\n待办 操作\n待办 更新\n待办 清除\n待办 管理\n提醒\n更新 完成\n更新 待办\n活动任务\n清除 待办\n清除 用户\n用户 创建\n移除 待办\n管理 列出\n结束 待办\n编辑 删除\n自动化 待办\n自我管理\n获取 待办\n请求 用户\n跟进";
                };
            };
        };
        readonly tokenInfo: {
            readonly request: {
                readonly base: "birdeye\nbirdeye lookup\nbirdeye token search\nbirdeye_lookup\nbirdeye_token_search\nboosted\nboosted profiles\nchain\ncoingecko\ncrypto\ncrypto token\ndexscreener\ndexscreener boosted tokens\ndexscreener chain pairs\ndexscreener new pairs\ndexscreener search\ndexscreener token info\ndexscreener token profiles\ndexscreener trending\ndexscreener_boosted_tokens\ndexscreener_chain_pairs\ndexscreener_new_pairs\ndexscreener_search\ndexscreener_token_info\ndexscreener_token_profiles\ndexscreener_trending\nfetch\nfetch crypto\ninfo\ninformation\nmarket\npairs\nprofiles\nprofiles wallet\nprovider\nproviders\nregistered\nregistry\nsearch\nsearch token\nselects\nselects search\nsubaction\nsubaction search\ntarget\ntoken\ntoken info\ntoken lookup\ntoken market\ntoken price\ntoken search\ntoken trending\ntoken_info\ntoken_lookup\ntoken_price\ntoken_search\ntrending\nwallet";
                readonly locales: {
                    readonly es: "accion\nbilletera\nbuscar\nbuscar token\ncripto\ncripto token\nherramienta\nperfil\nperfil billetera\nsolicitud\ntoken\ntoken buscar\ntoken perfil\nwallet";
                    readonly ko: "검색\n검색 토큰\n도구\n암호화폐\n암호화폐 토큰\n요청\n작업\n지갑\n토큰\n토큰 검색\n토큰 프로필\n프로필\n프로필 지갑";
                    readonly pt: "acao\nbuscar\nbuscar token\ncarteira\ncripto\ncripto token\nferramenta\nperfil\nperfil carteira\nsolicitacao\ntoken\ntoken buscar\ntoken perfil\nwallet";
                    readonly tl: "aksyon\ncrypto\ncrypto token\nkahilingan\nkasangkapan\nmaghanap\nmaghanap token\nprofile\nprofile wallet\ntoken\ntoken maghanap\ntoken profile\nwallet";
                    readonly vi: "cong cu\ncông cụ\nhanh dong\nhành động\nho so\nhồ sơ\nhồ sơ ví\ntien ma hoa\ntiền mã hóa\ntiền mã hóa token\ntim kiem\ntìm kiếm\ntìm kiếm token\ntoken\ntoken hồ sơ\ntoken tìm kiếm\nvi\nví\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "代币\n代币 搜索\n代币 资料\n令牌\n加密货币\n加密货币 代币\n工具\n搜索\n搜索 代币\n操作\n请求\n资料\n资料 钱包\n钱包";
                };
            };
        };
        readonly trustUpdateRole: {
            readonly request: {
                readonly base: "admin\nadmin owner\nadmin trust update role\nassign role\nassign_role\nassigns\nassigns role\nchange role\nchange_role\nchannel\nlist\nlist users\nmake admin\nmake_admin\nnone\nnone user\nowner\nrole\nrole admin\nset permissions\nset_permissions\nsettings trust update role\ntrust update role\ntrust_update_role\nuser\nuser list\nusers\nusers channel";
                readonly locales: {
                    readonly es: "accion\nactivar\nactualizar\nadministrador\nadministrador confianza actualizar rol\najustes\nconfianza\nconfianza actualizar rol\nconfiguracion\nconfiguracion confianza actualizar rol\ndueño\nherramienta\nlistar\nlistar usuario\nmodelo\nmostrar\npermisos\npolitica\npreferencias\nrol\nrol administrador\nroles\nsolicitud\nusuario\nusuario listar";
                    readonly ko: "관리자\n관리자 신뢰 업데이트 역할\n구성\n권한\n도구\n모델 설정\n목록\n목록 사용자\n사용자\n사용자 목록\n설정\n설정 신뢰 업데이트 역할\n소유자\n신뢰\n신뢰 업데이트 역할\n업데이트\n역할\n역할 관리자\n요청\n작업\n정책\n토글\n환경설정";
                    readonly pt: "acao\nadministrador\nadministrador confianca atualizar funcao\nalternar\natualizar\nconfianca\nconfianca atualizar funcao\nconfiguracao\nconfiguracoes\nconfiguracoes confianca atualizar funcao\ndono\nferramenta\nfuncao\nfuncao administrador\nfuncoes\nlistar\nlistar usuario\nmodelo\nmostrar\npapel\npermissoes\npolitica\npreferencias\nsolicitacao\nusuario\nusuario listar";
                    readonly tl: "admin\nadmin tiwala i-update role\naksyon\nconfiguration\ngumagamit\ni-update\nilista\nilista user\nkahilingan\nkasangkapan\nmay ari\nmodel settings\npahintulot\npatakaran\npreferences\nrole\nrole admin\nsettings\nsettings tiwala i-update role\ntiwala\ntiwala i-update role\ntoggle\nuser\nuser ilista";
                    readonly vi: "cai dat\ncài đặt\ncài đặt tin cậy cập nhật vai trò\ncap nhat\ncập nhật\ncấu hình\nchu so huu\nchủ sở hữu\ncong cu\ncông cụ\nhanh dong\nhành động\nliet ke\nliệt kê\nliệt kê người dùng\nnguoi dung\nngười dùng\nngười dùng liệt kê\nquan tri\nquản trị\nquản trị tin cậy cập nhật vai trò\nquyen\nquyền\ntin cay\ntin cậy\ntin cậy cập nhật vai trò\ntuy chon\ntùy chọn\nvai tro\nvai trò\nvai trò quản trị\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "信任\n信任 更新 角色\n偏好\n列出\n列出 用户\n工具\n开关\n所有者\n操作\n更新\n权限\n模型设置\n用户\n用户 列出\n策略\n管理员\n管理员 信任 更新 角色\n角色\n角色 管理员\n设置\n设置 信任 更新 角色\n请求\n配置";
                };
            };
        };
        readonly updateLinearIssue: {
            readonly request: {
                readonly base: "assignee\nassignee status\nautomation update linear issue\nconnectors update linear issue\nedit linear issue\nedit_linear_issue\nedit-linear-issue\nexisting\nexisting linear\nissue\nissue title\nlabels\nlinear\nlinear issue\nmodify linear issue\nmodify_linear_issue\nmodify-linear-issue\npriority\nstatus\nstatus labels\ntasks update linear issue\nteam\ntitle\nupdate\nupdate existing\nupdate linear\nupdate linear issue\nupdate_linear_issue\nupdate-linear-issue";
                readonly locales: {
                    readonly es: "accion\nactualizar\nactualizar linear\nactualizar linear incidencia\nautomatizacion\nautomatizacion actualizar linear incidencia\nconector\nconector actualizar linear incidencia\ncron\ncuenta conectada\ndisparador\neditar\neditar linear incidencia\nestado\nfecha limite\nflujo de trabajo\nherramienta\nincidencia\nintegracion\nlinear\nlinear incidencia\nmcp\nmonitor\noauth\npendiente\nrecordatorio\nseguimiento\nsolicitud\ntarea\ntarea actualizar linear incidencia\ntareas";
                    readonly ko: "계정 연결\n도구\n리니어\n리니어 이슈\n리마인더\n마감일\n모니터\n상태\n업데이트\n업데이트 리니어\n업데이트 리니어 이슈\n오어스\n요청\n워크플로\n이슈\n자동화\n자동화 업데이트 리니어 이슈\n작업\n작업 업데이트 리니어 이슈\n커넥터\n커넥터 업데이트 리니어 이슈\n크론\n통합\n트리거\n편집\n편집 리니어 이슈\n할 일\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\natualizar\natualizar linear\natualizar linear problema\nautomacao\nautomacao atualizar linear problema\nconector\nconector atualizar linear problema\nconta conectada\ncron\neditar\neditar linear problema\nestado\nferramenta\nfluxo de trabalho\ngatilho\nintegracao\nissue\nlembrete\nlinear\nlinear problema\nmcp\nmonitor\noauth\nprazo\nproblema\nsolicitacao\nstatus\ntarefa\ntarefa atualizar linear problema\ntarefas";
                    readonly tl: "account connection\naksyon\nautomation\nautomation i-update linear isyu\nconnector\nconnector i-update linear isyu\ncron\ndeadline\nfollow up\ngawain\ngawain i-update linear isyu\ni-edit\ni-edit linear isyu\ni-update\ni-update linear\ni-update linear isyu\nintegration\nisyu\nkahilingan\nkasangkapan\nlinear\nlinear isyu\nmonitor\noauth\npaalala\nstatus\ntask\ntodo\ntrigger\nworkflow";
                    readonly vi: "cap nhat\ncập nhật\ncập nhật linear\ncập nhật linear vấn đề\nchinh sua\nchỉnh sửa\nchỉnh sửa linear vấn đề\ncong cu\ncông cụ\nhanh dong\nhành động\nket noi\nkết nối\nkết nối cập nhật linear vấn đề\nkich hoat\nlinear\nlinear vấn đề\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnhiệm vụ cập nhật linear vấn đề\noauth\nquy trinh\nquy trình\ntac vu\ntác vụ\ntài khoản\ntich hop\ntích hợp\ntrang thai\ntrạng thái\ntu dong hoa\ntự động hóa\ntự động hóa cập nhật linear vấn đề\nvan de\nvấn đề\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "linear\nlinear 问题\n任务\n任务 更新 linear 问题\n定时\n工作流\n工具\n待办\n截止日期\n授权\n提醒\n操作\n更新\n更新 linear\n更新 linear 问题\n状态\n监控\n编辑\n编辑 linear 问题\n自动化\n自动化 更新 linear 问题\n触发器\n请求\n账号连接\n跟进\n连接器\n连接器 更新 linear 问题\n问题\n集成";
                };
            };
        };
        readonly updateMeetingPreferences: {
            readonly request: {
                readonly base: "blackout\nbuffer\ncalendar update meeting preferences\ncontacts update meeting preferences\ndefault\nduration\nduration travel\nhours\nmeeting\nno call hours\nno_call_hours\nowner\npersist\npreferences\npreferred\nprotect sleep\nprotect_sleep\nsave meeting preferences\nsave_meeting_preferences\nset blackout windows\nset meeting preferences\nset preferred times\nset_blackout_windows\nset_meeting_preferences\nset_preferred_times\nsettings update meeting preferences\nsleep window\nsleep_window\ntasks update meeting preferences\ntravel\ntravel buffer\nupdate meeting preferences\nupdate_meeting_preferences\nwindows";
                readonly locales: {
                    readonly es: "accion\nactivar\nactualizar\najustes\namigo\ncalendario\ncalendario actualizar\ncolega\nconfiguracion\nconfiguracion actualizar\ncontacto\ncontacto actualizar\ncontactos\nfecha limite\ngente\nherramienta\nllamada\nllamar\nmodelo\npendiente\npersona\npreferencias\nrecordatorio\nrelacion\nseguimiento\nsolicitud\ntarea\ntarea actualizar\ntareas\nviaje";
                    readonly ko: "관계\n구성\n도구\n동료\n리마인더\n마감일\n모델 설정\n사람\n설정\n설정 업데이트\n업데이트\n여행\n연락처\n연락처 업데이트\n요청\n일정\n작업\n작업 업데이트\n전화\n친구\n캘린더\n캘린더 업데이트\n토글\n통화\n할 일\n환경설정\n후속 조치";
                    readonly pt: "acao\nacompanhamento\nafazer\nalternar\namigo\natualizar\ncalendario\ncalendario atualizar\nchamada\ncolega\nconfiguracao\nconfiguracoes\nconfiguracoes atualizar\ncontato\ncontato atualizar\ncontatos\nferramenta\nlembrete\nligar\nmodelo\npessoa\npessoas\nprazo\npreferencias\nrelacao\nsolicitacao\ntarefa\ntarefa atualizar\ntarefas\nviagem";
                    readonly tl: "aksyon\nbiyahe\nconfiguration\ncontact\ncontact i-update\ncontacts\ndeadline\nfollow up\ngawain\ngawain i-update\ni-update\nkahilingan\nkaibigan\nkalendaryo\nkalendaryo i-update\nkasamahan\nkasangkapan\nmodel settings\npaalala\npreferences\nrelasyon\nsettings\nsettings i-update\ntao\ntask\ntawag\ntodo\ntoggle";
                    readonly vi: "cai dat\ncài đặt\ncài đặt cập nhật\ncap nhat\ncập nhật\ncấu hình\ncong cu\ncông cụ\ndu lich\ndu lịch\ngoi\ngọi\nhanh dong\nhành động\nlich\nlịch\nlịch cập nhật\nlien he\nliên hệ\nliên hệ cập nhật\nnguoi\nngười\nnhắc nhở\nnhiem vu\nnhiệm vụ\nnhiệm vụ cập nhật\nquan he\nquan hệ\ntac vu\ntác vụ\ntuy chon\ntùy chọn\nviec can lam\nviệc cần làm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "人物\n任务\n任务 更新\n偏好\n关系\n同事\n工具\n开关\n待办\n截止日期\n拨打\n提醒\n操作\n旅行\n日历\n日历 更新\n更新\n朋友\n模型设置\n联系人\n联系人 更新\n设置\n设置 更新\n请求\n跟进\n通话\n配置";
                };
            };
        };
        readonly useSkill: {
            readonly request: {
                readonly base: "automation use skill\nconnectors use skill\nconversation\nenabled\nenabled skill\ninstructions\ninvoke\nknowledge use skill\nresult\nreturns\nrun\nrun result\nscript\nscript run\nskill\nskill instructions\nskill slug\nslug\nslug skill\nuse skill\nuse_skill";
                readonly locales: {
                    readonly es: "accion\nautomatizacion\nautomatizacion habilidad\nconector\nconector habilidad\nconocimiento\nconocimiento habilidad\ncron\ncuenta conectada\ndisparador\nejecutar\nflujo de trabajo\nhabilidad\nhechos guardados\nherramienta\nintegracion\nmcp\nmonitor\nnotas guardadas\noauth\nrecordar\nskill\nsolicitud";
                    readonly ko: "검색\n계정 연결\n도구\n모니터\n스킬\n실행\n오어스\n요청\n워크플로\n자동화\n자동화 스킬\n작업\n저장된 노트\n저장된 사실\n지식\n지식 스킬\n커넥터\n커넥터 스킬\n크론\n통합\n트리거\n회상";
                    readonly pt: "acao\nautomacao\nautomacao habilidade\nconector\nconector habilidade\nconhecimento\nconhecimento habilidade\nconta conectada\ncron\nexecutar\nfatos salvos\nferramenta\nfluxo de trabalho\ngatilho\nhabilidade\nintegracao\nlembrar\nmcp\nmonitor\nnotas salvas\noauth\nskill\nsolicitacao";
                    readonly tl: "account connection\naksyon\nalalahanin\nautomation\nautomation skill\nconnector\nconnector skill\ncron\nintegration\nkaalaman\nkaalaman skill\nkahilingan\nkasanayan\nkasangkapan\nmonitor\noauth\npatakbuhin\nsaved facts\nsaved notes\nskill\ntrigger\nworkflow";
                    readonly vi: "chay\nchạy\ncong cu\ncông cụ\nghi chu da luu\nghi chú đã lưu\nhanh dong\nhành động\nket noi\nkết nối\nkết nối kỹ năng\nkich hoat\nkien thuc\nkiến thức\nkiến thức kỹ năng\nky nang\nkỹ năng\nnhớ lại\noauth\nquy trinh\nquy trình\ntài khoản\ntich hop\ntích hợp\ntu dong hoa\ntự động hóa\ntự động hóa kỹ năng\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "回忆\n定时\n工作流\n工具\n已保存事实\n已保存笔记\n技能\n授权\n操作\n监控\n知识\n知识 技能\n自动化\n自动化 技能\n触发器\n语义搜索\n请求\n账号连接\n运行\n连接器\n连接器 技能\n集成";
                };
            };
        };
        readonly vision: {
            readonly request: {
                readonly base: "analyze scene\nanalyze_scene\nboth\ncamera\ncamera screen\ncapture\ncapture frame\ncapture image\ncapture mode\ncapture_frame\ncapture_image\ndescribe\ndescribe capture\ndescribe scene\ndescribe_scene\nentity\nentity identify\nentity inferred\nexplicitly\nidentify\nidentify person\nidentify_person\nimage\nimage switch\ninferred\ninferred message\nlook around\nlook_around\nmessage\nmessage text\nmode\nname\nname entity\nname_entity\nperson\nprovided\nscene\nscene capture\nscreen\nscreen both\nscreen vision\nscreenshot\nset vision mode\nset_vision_mode\nstart\nswitch\nswitch vision\ntake photo\ntake picture\ntake_photo\ntake_picture\ntext\ntrack\ntrack entity\ntrack_entity\ntracking\nvisible\nvision\nvision check\nvision describe\nvision mode\nvision_check\nwhat do you see\nwhat_do_you_see";
                readonly locales: {
                    readonly es: "accion\nanalizar\ncaptura de pantalla\ncapturar\ncapturar imagen\ncomprobar\ndescribir\ndescribir capturar\nfoto\nherramienta\nidentificar\nimagen\ninferido\ninferido mensaje\nmensaje\npantalla\npantalla vision\nrevisar\nsolicitud\nvision\nvision describir\nvision revisar";
                    readonly ko: "도구\n메시지\n분석\n비전\n비전 설명\n비전 확인\n사진\n설명\n설명 캡처\n스크린샷\n식별\n요청\n이미지\n작업\n추론\n추론 메시지\n캡처\n캡처 이미지\n화면\n화면 비전\n확인";
                    readonly pt: "acao\nanalisar\ncaptura de tela\ncapturar\ncapturar imagem\ndescrever\ndescrever capturar\nferramenta\nfoto\nidentificar\nimagem\ninferido\ninferido mensagem\nmensagem\nsolicitacao\ntela\ntela visao\nverificar\nvisao\nvisao descrever\nvisao verificar";
                    readonly tl: "aksyon\nhinula\nhinula mensahe\nilarawan\nilarawan kuha\nkahilingan\nkasangkapan\nkuha\nkuha larawan\nlarawan\nmensahe\nscreen\nscreen vision\nscreenshot\nsuriin\ntukuyin\nvision\nvision ilarawan\nvision suriin";
                    readonly vi: "anh\nảnh\nanh chup man hinh\nảnh chụp màn hình\nchup\nchụp\nchụp hình ảnh\ncong cu\ncông cụ\nhanh dong\nhành động\nhinh anh\nhình ảnh\nkiem tra\nkiểm tra\nman hinh\nmàn hình\nmàn hình thị giác\nmo ta\nmô tả\nmô tả chụp\nnhan dang\nnhận dạng\nphan tich\nphân tích\nsuy luan\nsuy luận\nsuy luận tin nhắn\nthi giac\nthị giác\nthị giác kiểm tra\nthị giác mô tả\ntin nhan\ntin nhắn\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "分析\n图像\n图片\n屏幕\n屏幕 视觉\n工具\n截图\n捕获\n捕获 图片\n推断\n推断 消息\n描述\n描述 捕获\n操作\n检查\n消息\n视觉\n视觉 描述\n视觉 检查\n识别\n请求";
                };
            };
        };
        readonly wallet: {
            readonly request: {
                readonly base: "amount\nbridge\nchain\nchain token\ncross chain transfer\ncross_chain_transfer\ncrypto wallet\ndestination\nfinance wallet\nhandler\nhandlers\nmode\nmode run\nomit\nonly\noperations\noperations through\nparams\nprepare transfer\nprepare_transfer\nrecipient\nregistered\nregistry\nroute\nroute wallet\nrun\nrun bridge\nslippage\nsource\nsubaction\nsupports\nswap\nswap solana\nswap_solana\nthrough\ntoken\ntoken amount\ntoken operations\ntoken token\ntransfer\ntransfer token\ntransfer_token\nuniform\nuses\nwallet\nwallet action\nwallet gov\nwallet swap\nwallet token\nwallet transfer\nwallet wallet\nwallet_action\nwallet_gov\nwallet_swap\nwallet_transfer";
                readonly locales: {
                    readonly es: "accion\nbilletera\nbilletera accion\nbilletera billetera\nbilletera token\ncadena\ncripto\ncripto billetera\ncuenta\ndefi\ndinero\ndireccion\nejecutar\nfactura\nfinanzas\nfirmar transaccion\nherramienta\nintercambio\nliquidez\noperacion\nportafolio\nsaldo\nsolicitud\ntoken\ntoken operacion\ntoken token\ntransferir\nwallet";
                    readonly ko: "거래 서명\n계정\n금융\n도구\n돈\n디파이\n스왑\n실행\n암호화폐\n암호화폐 지갑\n온체인\n요청\n유동성\n작업\n잔액\n전송\n주소\n지갑\n지갑 작업\n지갑 지갑\n지갑 토큰\n청구서\n토큰\n토큰 작업\n토큰 토큰\n포트폴리오";
                    readonly pt: "acao\nassinar transacao\ncarteira\ncarteira acao\ncarteira carteira\ncarteira token\nconta\ncripto\ncripto carteira\ndefi\ndinheiro\nendereco\nexecutar\nfatura\nferramenta\nfinancas\nliquidez\nonchain\noperacao\nportfolio\nsaldo\nsolicitacao\ntoken\ntoken operacao\ntoken token\ntransferir\ntroca\nwallet";
                    readonly tl: "account\naddress\naksyon\nbalance\ncrypto\ncrypto wallet\ndefi\nfinance\ninvoice\nkahilingan\nkasangkapan\nliquidity\noperasyon\npatakbuhin\npera\nportfolio\nsign transaction\nswap\ntoken\ntoken operasyon\ntoken token\ntransfer\nwallet\nwallet aksyon\nwallet token\nwallet wallet";
                    readonly vi: "chay\nchạy\nchuyen\nchuyển\ncong cu\ncông cụ\ncrypto\ndefi\nhanh dong\nhành động\nký giao dịch\nso du\nsố dư\ntai chinh\ntài chính\nthanh khoản\nthao tac\nthao tác\ntien\ntiền\ntien ma hoa\ntiền mã hóa\ntiền mã hóa ví\ntoken\ntoken thao tác\ntoken token\nvi\nví\nví hành động\nví token\nví ví\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "交换\n代币\n代币 代币\n代币 操作\n令牌\n余额\n加密货币\n加密货币 钱包\n发票\n地址\n工具\n投资组合\n操作\n流动性\n签名交易\n请求\n财务\n账户\n转账\n运行\n钱\n钱包\n钱包 代币\n钱包 操作\n钱包 钱包\n链上";
                };
            };
        };
        readonly webFetch: {
            readonly request: {
                readonly base: "50000\naddresses\nallow\nautomation web fetch\nblocked\nblog\nblog posts\nbody\ncapped\nchars\ncode web fetch\ncoding\ncoding tools\ncollapsed\ndefault\ndocumentation\ndownload page\ndownload_page\nfetch\nfetch url\nfetch_url\nget url\nget_url\nhtml\nhttp\nlocalhost\nloopback\npasting\npasting user\npermit\nplain\nposts\nposts pasting\nreading\nreferenced\nresponses\nreturn\nsingle\nstripped\ntags\nterminal web fetch\ntext\nthem\ntools\ntools web\nuser\nuser referenced\nweb\nweb fetch\nweb_fetch";
                readonly locales: {
                    readonly es: "accion\nautomatizacion\nautomatizacion web\nbash\ncodigo\ncodigo web\ncron\ndepurar\ndescargar\ndescargar pagina\ndisparador\nflujo de trabajo\nherramienta\nherramienta web\nimplementar\nlinea de comandos\nmonitor\nobtener\nobtener url\npagina\nproceso\nprogramacion\nprueba\npublicacion\npublicar\nrepositorio\nshell\nsolicitud\nterminal\nterminal web\nusuario\nweb";
                    readonly ko: "가져오기\n가져오기 url\n게시\n게시물\n구현\n다운로드\n다운로드 페이지\n도구\n도구 웹\n디버그\n명령줄\n모니터\n배시\n사용자\n셸\n요청\n워크플로\n웹\n자동화\n자동화 웹\n작업\n저장소\n코드\n코드 웹\n크론\n터미널\n터미널 웹\n테스트\n트리거\n페이지\n프로그래밍\n프로세스";
                    readonly pt: "acao\nautomacao\nautomacao web\nbaixar\nbaixar pagina\nbash\ncodigo\ncodigo web\ncron\ndepurar\nferramenta\nferramenta web\nfluxo de trabalho\ngatilho\nimplementar\nlinha de comando\nmonitor\nobter\nobter url\npagina\npostagem\nprocesso\nprogramacao\npublicar\nrepositorio\nshell\nsolicitacao\nterminal\nterminal web\nteste\nusuario\nweb";
                    readonly tl: "aksyon\nautomation\nautomation web\nbash\ncode\ncode web\ncommand line\ncron\ndebug\ngumagamit\ni-download\ni-download pahina\nipatupad\nkahilingan\nkasangkapan\nkunin\nkunin url\nmonitor\npahina\npost\nprocess\nprogramming\nrepo\nshell\nterminal\nterminal web\ntest\ntool\ntool web\ntrigger\nuser\nweb\nworkflow";
                    readonly vi: "bai dang\nbài đăng\nbash\ncong cu\ncông cụ\ncông cụ web\ndong lenh\ndòng lệnh\nhanh dong\nhành động\nkho ma\nkho mã\nkich hoat\nkiểm thử\nlap trinh\nlập trình\nlay\nlấy\nlấy url\nma\nmã\nmã web\nnguoi dung\nngười dùng\nquy trinh\nquy trình\nshell\ntai xuong\ntải xuống\ntải xuống trang\nterminal\nterminal web\ntiến trình\ntrang\ntu dong hoa\ntự động hóa\ntự động hóa web\nweb\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "Bash\n下载\n下载 页面\n仓库\n代码\n代码 网页\n发布\n命令行\n定时\n实现\n工作流\n工具\n工具 网页\n帖子\n操作\n标准输出\n测试\n用户\n监控\n终端\n终端 网页\n编程\n网页\n自动化\n自动化 网页\n获取\n获取 url\n触发器\n请求\n调试\n进程\n页面";
                };
            };
        };
        readonly webSearch: {
            readonly request: {
                readonly base: "crypto web search\ndocuments web search\nfinance web search\nfind information\nfind online\nfind_information\nfind_online\ninternet search\ninternet_search\nlookup\nonline search\nonline_search\nquery web\nquery_web\nsearch engine\nsearch web\nsearch_engine\nsearch_web\nweb lookup\nweb search\nweb web search\nweb_lookup\nweb_search";
                readonly locales: {
                    readonly es: "abrir url\naccion\narchivo\nbuscar\nbuscar web\ncadena\nconsulta\nconsulta web\ncripto\ncripto web buscar\ncuenta\ndefi\ndinero\ndocumento\ndocumento web buscar\ndocumentos\nencontrar\nfactura\nfinanzas\nguardar notas\nherramienta\ninformacion actual\nintercambio\ninternet\nliquidez\nnotas\nportafolio\nsaldo\nsolicitud\ntoken\nultimo\nweb\nweb buscar\nweb web buscar";
                    readonly ko: "url 열기\n검색\n검색 웹\n계정\n금융\n노트\n도구\n돈\n디파이\n문서\n문서 웹 검색\n스왑\n암호화폐\n암호화폐 웹 검색\n온체인\n요청\n웹\n웹 검색\n웹 웹 검색\n유동성\n인터넷\n작업\n잔액\n저장\n질의\n찾기\n청구서\n최신\n최신 정보\n쿼리\n쿼리 웹\n토큰\n파일 내용\n포트폴리오";
                    readonly pt: "abrir url\nacao\narquivo\nbuscar\nbuscar na web\nbuscar web\nconsulta\nconsulta web\nconta\ncripto\ncripto web buscar\ndefi\ndinheiro\ndocumento\ndocumento web buscar\ndocumentos\nencontrar\nfatura\nferramenta\nfinancas\ninformacao atual\ninternet\nliquidez\nnotas\nonchain\nportfolio\nsaldo\nsalvar notas\nsolicitacao\ntoken\ntroca\nweb\nweb buscar\nweb web buscar";
                    readonly tl: "account\naksyon\nbalance\ncrypto\ncrypto web maghanap\ndefi\ndokumento\ndokumento web maghanap\nfinance\nhanapin\ni-save\ninternet\ninvoice\nkahilingan\nkasalukuyang impormasyon\nkasangkapan\nliquidity\nmaghanap\nmaghanap web\nnilalaman ng file\nnotes\nopen url\npera\nportfolio\nquery\nquery web\nsearch web\nswap\ntoken\nweb\nweb maghanap\nweb web maghanap";
                    readonly vi: "cong cu\ncông cụ\ncrypto\ndefi\nghi chu\nghi chú\nhanh dong\nhành động\ninternet\nlưu ghi chú\nso du\nsố dư\ntai chinh\ntài chính\ntai lieu\ntài liệu\ntài liệu web tìm kiếm\nthanh khoản\nthong tin hien tai\nthông tin hiện tại\ntien\ntiền\ntien ma hoa\ntiền mã hóa\ntiền mã hóa web tìm kiếm\ntim\ntìm\ntim kiem\ntìm kiếm\ntìm kiếm web\ntìm web\ntoken\ntruy van\ntruy vấn\ntruy vấn web\nweb\nweb tìm kiếm\nweb web tìm kiếm\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "互联网\n交换\n代币\n余额\n保存笔记\n最新信息\n加密货币\n加密货币 网页 搜索\n发票\n工具\n打开网址\n投资组合\n搜索\n搜索 网页\n操作\n文件内容\n文档\n文档 网页 搜索\n查找\n查询\n查询 网页\n流动性\n笔记\n网络\n网页\n网页 搜索\n网页 网页 搜索\n网页搜索\n请求\n财务\n账户\n钱\n链上";
                };
            };
        };
        readonly write: {
            readonly request: {
                readonly base: "absolute\nautomation write\navoid\nbeen\nbeen read\nclobbering\ncode write\ncontents\ncontents file\ncreate file\ncreate_file\ncreated\ncreates\ncreates parents\ndirectory\nedits\nexisting\nexisting contents\nexisting file\nexisting files\nexternal\nexternal edits\nfile\nfile absolute\nfile parent\nfile read\nfiles\nfiles must\nfirst\nhave\nmissing\nmust\notherwise\notherwise write\nparent\nparents\npath\npath creates\nread\nread first\nread session\nrejected\nrejects\nreplacing\nsession\nterminal write\nwrite\nwrite file\nwrite rejected\nwrite_file";
                readonly locales: {
                    readonly es: "accion\narchivo\narchivo leer\nautomatizacion\nautomatizacion escribir\nbash\ncodigo\ncodigo escribir\ncontenido\ncontenido archivo\ncrear\ncrear archivo\ncron\ndepurar\ndisparador\neditar\nescribir\nescribir archivo\nflujo de trabajo\nherramienta\nimplementar\nleer\nlinea de comandos\nmonitor\nproceso\nprogramacion\nprueba\nrepositorio\nshell\nsolicitud\nterminal\nterminal escribir";
                    readonly ko: "구현\n내용\n도구\n디버그\n명령줄\n모니터\n배시\n생성\n생성 파일\n셸\n쓰기\n쓰기 파일\n요청\n워크플로\n읽기\n자동화\n자동화 쓰기\n작업\n저장소\n코드\n코드 쓰기\n콘텐츠\n콘텐츠 파일\n크론\n터미널\n터미널 쓰기\n테스트\n트리거\n파일\n파일 읽기\n편집\n프로그래밍\n프로세스";
                    readonly pt: "acao\narquivo\narquivo ler\nautomacao\nautomacao escrever\nbash\ncodigo\ncodigo escrever\nconteudo\nconteudo arquivo\ncriar\ncriar arquivo\ncron\ndepurar\neditar\nescrever\nescrever arquivo\nferramenta\nfluxo de trabalho\ngatilho\nimplementar\nler\nlinha de comando\nmonitor\nprocesso\nprogramacao\nrepositorio\nshell\nsolicitacao\nterminal\nterminal escrever\nteste";
                    readonly tl: "aksyon\nautomation\nautomation isulat\nbasahin\nbash\ncode\ncode isulat\ncommand line\ncron\ndebug\nfile\nfile basahin\ngumawa\ngumawa file\ni-edit\nipatupad\nisulat\nisulat file\nkahilingan\nkasangkapan\nmonitor\nnilalaman\nnilalaman file\nprocess\nprogramming\nrepo\nshell\nterminal\nterminal isulat\ntest\ntrigger\nworkflow";
                    readonly vi: "bash\nchinh sua\nchỉnh sửa\ncong cu\ncông cụ\ndoc\nđọc\ndong lenh\ndòng lệnh\nhanh dong\nhành động\nkho ma\nkho mã\nkich hoat\nkiểm thử\nlap trinh\nlập trình\nma\nmã\nmã viết\nnoi dung\nnội dung\nnội dung tệp\nquy trinh\nquy trình\nshell\ntao\ntạo\ntạo tệp\ntep\ntệp\ntệp đọc\nterminal\nterminal viết\ntiến trình\ntu dong hoa\ntự động hóa\ntự động hóa viết\nviet\nviết\nviết tệp\nyeu cau\nyêu cầu";
                    readonly "zh-CN": "Bash\n仓库\n代码\n代码 写入\n内容\n内容 文件\n写入\n写入 文件\n创建\n创建 文件\n命令行\n定时\n实现\n工作流\n工具\n操作\n文件\n文件 读取\n标准输出\n测试\n监控\n终端\n终端 写入\n编程\n编辑\n自动化\n自动化 写入\n触发器\n请求\n读取\n调试\n进程";
                };
            };
        };
        readonly restart: {
            readonly request: {
                readonly base: "restart\nreboot\nreload\nrefresh\nrespawn";
                readonly locales: {
                    readonly "zh-CN": "重启\n重开\n重新加载\n刷新";
                    readonly ko: "재시작\n다시 시작\n재부팅\n다시 불러와\n새로고침";
                    readonly es: "reinicia\nreiniciar\nreinicio\nrecarga\nrecargar\nrefresca\nrefrescar";
                    readonly pt: "reinicia\nreiniciar\nreinício\nreinicio\nrecarrega\nrecarregar\natualiza\natualizar";
                    readonly vi: "khởi động lại\nkhoi dong lai\ntải lại\ntai lai\nlàm mới\nlam moi";
                    readonly tl: "i-restart\nrestart\ni-reboot\ni-reload\ni-refresh";
                };
            };
        };
        readonly setUserName: {
            readonly recentContext: {
                readonly base: "name\nmy name is\nmy name\ni'm\ni am\ncall me\ncall me by\nchange my name\nrename me";
                readonly locales: {
                    readonly "zh-CN": "名字\n我的名字\n我叫\n我是\n叫我\n称呼我\n改名字";
                    readonly ko: "이름\n내 이름\n제 이름은\n나는\n불러줘\n라고 불러\n이름 바꿔";
                    readonly es: "nombre\nmi nombre\nmi nombre es\nme llamo\nllámame\nllamame\ncambia mi nombre";
                    readonly pt: "nome\nmeu nome\nmeu nome é\nmeu nome e\nme chamo\nme chama de\nchame-me\nmuda meu nome";
                    readonly vi: "tên\nten\ntên tôi\nten toi\ntôi là\ntoi la\ngọi tôi là\ngoi toi la\nđổi tên tôi\ndoi ten toi";
                    readonly tl: "pangalan\nang pangalan ko\nako si\ntawagin mo akong\npalitan ang pangalan ko";
                };
            };
        };
        readonly manageTasks: {
            readonly request: {
                readonly base: "create task\nadd task\nnew task\nmake task\ncomplete task\nfinish task\ndone with task\nmark task done\ndelete task\nremove task\nupdate task\nedit task\nchange task\nlist tasks\nshow tasks\nmy tasks\nwhat are my tasks\nadd a todo\nadd a to-do\ncreate a to do\ntask list\ncheck off";
                readonly locales: {
                    readonly "zh-CN": "创建任务\n添加任务\n新任务\n完成任务\n删除任务\n更新任务\n列出任务\n任务列表";
                    readonly ko: "작업 만들기\n작업 추가\n새 작업\n작업 완료\n작업 삭제\n작업 수정\n작업 목록";
                    readonly es: "crear tarea\nagregar tarea\nnueva tarea\ncompletar tarea\neliminar tarea\nactualizar tarea\nlistar tareas\nmis tareas\nlista de tareas";
                    readonly pt: "criar tarefa\nadicionar tarefa\nnova tarefa\nconcluir tarefa\nremover tarefa\natualizar tarefa\nlistar tarefas\nminhas tarefas\nlista de tarefas";
                    readonly vi: "tạo nhiệm vụ\ntao nhiem vu\nthêm nhiệm vụ\nthem nhiem vu\nhoàn thành nhiệm vụ\nhoan thanh nhiem vu\nxóa nhiệm vụ\nxoa nhiem vu\ncập nhật nhiệm vụ\ncap nhat nhiem vu\ndanh sách nhiệm vụ\ndanh sach nhiem vu";
                    readonly tl: "gumawa ng task\nmagdagdag ng task\nbagong task\ntapusin ang task\nburahin ang task\ni-update ang task\nlistahan ng task\nmga task ko";
                };
            };
        };
        readonly background: {
            readonly request: {
                readonly base: "background\nwallpaper\nbackdrop\nbackground color\nbackground image\nbackground shader\nanimated background\nbackground change\nwallpaper change\nchange the background\nset the background\nundo the background\nundo that background\nredo the background\nreset the background\nrevert the background\nrevert the wallpaper\nrestore the background\ndefault background\nput the background back";
                readonly locales: {
                    readonly "zh-CN": "背景\n壁纸\n背景颜色\n恢复背景\n撤销背景\n重置背景";
                    readonly ko: "배경\n배경화면\n배경 색\n배경 되돌리기\n배경 초기화";
                    readonly es: "fondo\nfondo de pantalla\ncolor de fondo\ndeshacer el fondo\nrestablecer el fondo";
                    readonly pt: "fundo\npapel de parede\nplano de fundo\ncor de fundo\ndesfazer o fundo\nredefinir o fundo";
                    readonly vi: "hình nền\nhinh nen\nnền\nmàu nền\nmau nen\nhoàn tác hình nền\nđặt lại hình nền";
                    readonly tl: "background\nwallpaper\nkulay ng background\nibalik ang background\ni-reset ang background";
                };
            };
        };
        readonly appControl: {
            readonly launchVerb: {
                readonly base: "launch\nopen\nstart\nrun\nshow";
                readonly locales: {
                    readonly "zh-CN": "启动\n打开\n运行\n开启\n显示";
                    readonly ko: "실행\n열어\n시작\n켜\n보여줘";
                    readonly es: "abre\nabrir\ninicia\niniciar\nejecuta\nmostrar";
                    readonly pt: "abre\nabrir\ninicia\niniciar\nexecuta\nmostrar";
                    readonly vi: "mở\nmo\nkhởi chạy\nkhoi chay\nchạy\nchay\nbắt đầu\nbat dau";
                    readonly tl: "buksan\nsimulan\npatakbuhin\nipakita";
                };
            };
            readonly stopVerb: {
                readonly base: "stop\nclose\nshut down\nkill\nquit\nexit";
                readonly locales: {
                    readonly "zh-CN": "停止\n关闭\n关掉\n退出";
                    readonly ko: "중지\n멈춰\n종료\n닫아\n끄기";
                    readonly es: "detén\ndetener\ncierra\ncerrar\napaga\nsalir";
                    readonly pt: "parar\npare\nfechar\nfecha\ndesliga\nsair";
                    readonly vi: "dừng\ndung\ntắt\ntat\nđóng\ndong\nthoát\nthoat";
                    readonly tl: "ihinto\nitigil\nisara\npatayin\nlumabas";
                };
            };
            readonly genericTarget: {
                readonly base: "app\napplication";
                readonly locales: {
                    readonly "zh-CN": "应用\n应用程序\n程序";
                    readonly ko: "앱\n애플리케이션";
                    readonly es: "app\naplicación\naplicacion\nprograma";
                    readonly pt: "app\naplicativo\naplicação\naplicacao\nprograma";
                    readonly vi: "ứng dụng\nung dung";
                    readonly tl: "app\naplikasyon\nprograma";
                };
            };
            readonly knownApp: {
                readonly base: "shopify\ncompanion\nfeed";
                readonly locales: {
                    readonly "zh-CN": "shopify\ncompanion\nfeed";
                    readonly ko: "shopify\ncompanion\nfeed";
                    readonly es: "shopify\ncompanion\nfeed";
                    readonly pt: "shopify\ncompanion\nfeed";
                    readonly vi: "shopify\ncompanion\nfeed";
                    readonly tl: "shopify\ncompanion\nfeed";
                };
            };
        };
        readonly terminal: {
            readonly commandVerb: {
                readonly base: "run\nexecute\nstart\ndo";
                readonly locales: {
                    readonly "zh-CN": "运行\n执行\n开始";
                    readonly ko: "실행\n돌려\n시작\n해줘";
                    readonly es: "ejecuta\nejecutar\ncorre\ncorrer\ninicia";
                    readonly pt: "executa\nexecutar\nroda\nrodar\ninicia";
                    readonly vi: "chạy\nchay\nthực hiện\nthuc hien\nbắt đầu\nbat dau";
                    readonly tl: "patakbuhin\nisagawa\nsimulan\ngawin";
                };
            };
            readonly commandFiller: {
                readonly base: "command\nshell command\nterminal command";
                readonly locales: {
                    readonly "zh-CN": "命令\n终端命令\nshell 命令";
                    readonly ko: "명령\n명령어\n터미널 명령";
                    readonly es: "comando\ncomando de terminal";
                    readonly pt: "comando\ncomando do terminal";
                    readonly vi: "lệnh\nlenh\nlệnh terminal\nlenh terminal";
                    readonly tl: "utos\ncommand\nutos sa terminal";
                };
            };
            readonly utility: {
                readonly base: "price\nworth\ncost\nbalance\nstatus\ncheck\ncurl\nfetch\ntail\nhead\nlog";
                readonly locales: {
                    readonly "zh-CN": "价格\n余额\n状态\n检查\n日志";
                    readonly ko: "가격\n잔액\n상태\n확인\n로그";
                    readonly es: "precio\ncosto\nbalance\nsaldo\nestado\nrevisar\nlog";
                    readonly pt: "preço\npreco\ncusto\nsaldo\nestado\nverificar\nlog";
                    readonly vi: "giá\ngia\nsố dư\nso du\ntrạng thái\ntrang thai\nkiểm tra\nkiem tra\nlog";
                    readonly tl: "presyo\nbalanse\nstatus\ncheck\nlog";
                };
            };
            readonly cryptoBitcoin: {
                readonly base: "bitcoin\nbtc";
                readonly locales: {
                    readonly "zh-CN": "比特币";
                    readonly ko: "비트코인";
                    readonly es: "bitcóin\nbitcoín\nbitcoin";
                    readonly pt: "bitcóin\nbitcoin";
                    readonly vi: "đồng bitcoin\ndong bitcoin\nbitcoin";
                    readonly tl: "bitcoin\nbarya ng bitcoin";
                };
            };
            readonly cryptoEthereum: {
                readonly base: "ethereum\neth";
                readonly locales: {
                    readonly "zh-CN": "以太坊";
                    readonly ko: "이더리움";
                    readonly es: "ethereum\netéreo\netereo";
                    readonly pt: "ethereum\nether";
                    readonly vi: "ethereum\nđồng ethereum\ndong ethereum";
                    readonly tl: "ethereum\nether";
                };
            };
            readonly cryptoSolana: {
                readonly base: "solana\nsol";
                readonly locales: {
                    readonly "zh-CN": "索拉纳";
                    readonly ko: "솔라나";
                    readonly es: "solana";
                    readonly pt: "solana";
                    readonly vi: "solana\nđồng solana\ndong solana";
                    readonly tl: "solana";
                };
            };
            readonly disk: {
                readonly base: "disk\nspace\nstorage\ndisk usage";
                readonly locales: {
                    readonly "zh-CN": "磁盘\n空间\n存储";
                    readonly ko: "디스크\n저장공간\n저장소";
                    readonly es: "disco\nespacio\nalmacenamiento";
                    readonly pt: "disco\nespaço\nespaco\narmazenamento";
                    readonly vi: "ổ đĩa\no dia\ndung lượng\ndung luong\nlưu trữ\nluu tru";
                    readonly tl: "disk\nespasyo\nstorage";
                };
            };
            readonly uptime: {
                readonly base: "uptime\nload";
                readonly locales: {
                    readonly "zh-CN": "运行时间\n负载";
                    readonly ko: "업타임\n부하";
                    readonly es: "tiempo activo\ncarga";
                    readonly pt: "uptime\ntempo ativo\ncarga";
                    readonly vi: "thời gian hoạt động\nthoi gian hoat dong\ntải\ntai";
                    readonly tl: "uptime\nload";
                };
            };
            readonly memory: {
                readonly base: "memory\nram";
                readonly locales: {
                    readonly "zh-CN": "内存";
                    readonly ko: "메모리\n램";
                    readonly es: "memoria\nram";
                    readonly pt: "memória\nmemoria\nram";
                    readonly vi: "bộ nhớ\nbo nho\nram";
                    readonly tl: "memory\nram";
                };
            };
            readonly process: {
                readonly base: "process\nprocesses\ntop\nmemory usage";
                readonly locales: {
                    readonly "zh-CN": "进程\n进程列表\n内存占用";
                    readonly ko: "프로세스\ntop\n메모리 사용";
                    readonly es: "proceso\nprocesos\ntop\nuso de memoria";
                    readonly pt: "processo\nprocessos\ntop\nuso de memória\nuso de memoria";
                    readonly vi: "tiến trình\ntien trinh\ntop\ndùng bộ nhớ\ndung bo nho";
                    readonly tl: "process\nmga proseso\ntop\ngamit ng memory";
                };
            };
        };
        readonly logLevel: {
            readonly command: {
                readonly base: "/loglevel\nlog level\nlogging level";
                readonly locales: {
                    readonly "zh-CN": "日志级别\n日志等级";
                    readonly ko: "로그 레벨\n로깅 레벨";
                    readonly es: "nivel de log\nnivel de registro";
                    readonly pt: "nível de log\nnivel de log\nnível de registro\nnivel de registro";
                    readonly vi: "mức log\nmuc log\nmức ghi log\nmuc ghi log";
                    readonly tl: "antas ng log\nantas ng pag-log";
                };
            };
            readonly setVerb: {
                readonly base: "set\nchange\nswitch";
                readonly locales: {
                    readonly "zh-CN": "设置\n调成\n改成\n切换";
                    readonly ko: "설정\n바꿔\n변경\n전환";
                    readonly es: "pon\nponer\ncambia\ncambiar\najusta";
                    readonly pt: "define\ndefinir\nmuda\nmudar\najusta";
                    readonly vi: "đặt\ndat\nđổi\ndoi\nchuyển\nchuyen";
                    readonly tl: "itakda\npalitan\nilipat";
                };
            };
            readonly domain: {
                readonly base: "log\nlogging\nverbosity";
                readonly locales: {
                    readonly "zh-CN": "日志\n详细程度";
                    readonly ko: "로그\n로깅\n상세도";
                    readonly es: "log\nregistro\nverbosidad";
                    readonly pt: "log\nregistro\nverbosidade";
                    readonly vi: "log\nghi log\nđộ chi tiết\ndo chi tiet";
                    readonly tl: "log\npag-log\nverbosity";
                };
            };
            readonly level: {
                readonly trace: {
                    readonly base: "trace";
                    readonly locales: {
                        readonly "zh-CN": "跟踪";
                        readonly ko: "추적";
                        readonly es: "rastreo";
                        readonly pt: "rastreamento";
                        readonly vi: "theo dõi\ntheo doi";
                        readonly tl: "bakas\ntrace";
                    };
                };
                readonly debug: {
                    readonly base: "debug";
                    readonly locales: {
                        readonly "zh-CN": "调试";
                        readonly ko: "디버그";
                        readonly es: "depuración\ndepuracion";
                        readonly pt: "depuração\ndepuracao";
                        readonly vi: "gỡ lỗi\ngo loi";
                        readonly tl: "debug\npag-debug";
                    };
                };
                readonly info: {
                    readonly base: "info\ninformation";
                    readonly locales: {
                        readonly "zh-CN": "信息";
                        readonly ko: "정보";
                        readonly es: "información\ninformacion";
                        readonly pt: "informação\ninformacao";
                        readonly vi: "thông tin\nthong tin";
                        readonly tl: "impormasyon";
                    };
                };
                readonly warn: {
                    readonly base: "warn\nwarning";
                    readonly locales: {
                        readonly "zh-CN": "警告";
                        readonly ko: "경고";
                        readonly es: "advertencia";
                        readonly pt: "aviso\nadvertência\nadvertencia";
                        readonly vi: "cảnh báo\ncanh bao";
                        readonly tl: "babala";
                    };
                };
                readonly error: {
                    readonly base: "error\nerrors";
                    readonly locales: {
                        readonly "zh-CN": "错误";
                        readonly ko: "오류";
                        readonly es: "error\nerrores";
                        readonly pt: "erro";
                        readonly vi: "lỗi\nloi";
                        readonly tl: "error\nmga error";
                    };
                };
            };
        };
        readonly updateRole: {
            readonly intent: {
                readonly base: "role\nassign role\nset role\nchange role\nupdate role\nboss\nmanager\nsupervisor\nsuperior\nlead\ncoworker\nco-worker\nteammate\ncolleague\npeer\nfriend\npartner\nadmin\nowner\nguest\nmember\nuser\nmod\nmoderator\npromote\ndemote\nrevoke\nremove role";
                readonly locales: {
                    readonly "zh-CN": "角色\n分配角色\n设置角色\n修改角色\n老板\n经理\n主管\n上级\n负责人\n同事\n队友\n伙伴\n管理员\n所有者\n主人\n访客\n成员\n用户\n版主\n提升\n升级\n降级\n撤销\n移除角色";
                    readonly ko: "역할\n역할 설정\n역할 변경\n상사\n매니저\n관리자\n감독자\n리더\n동료\n팀원\n친구\n파트너\n오너\n소유자\n게스트\n멤버\n사용자\n모더레이터\n승급\n강등\n철회";
                    readonly es: "rol\nasigna el rol\ncambiar el rol\njefe\njefa\ngerente\nsupervisor\nlíder\nlider\ncompañero\ncompanero\ncolega\namigo\nsocio\nadministrador\ndueño\ndueno\npropietario\ninvitado\nmiembro\nusuario\nmoderador\nasciende\npromociona\ndegrada\nrevoca\nquitar el rol";
                    readonly pt: "papel\nfunção\nfuncao\ncargo\natribuir papel\nmudar papel\nchefe\ngerente\nsupervisor\nlíder\nlider\ncolega\namigo\nparceiro\nadministrador\ndono\nproprietário\nproprietario\nconvidado\nmembro\nusuário\nusuario\nmoderador\npromover\nrebaixar\nrevogar\nremover papel";
                    readonly vi: "vai trò\nvai tro\ngán vai trò\ngan vai tro\nđổi vai trò\ndoi vai tro\nsếp\nsep\nquản lý\nquan ly\ngiám sát\ngiam sat\ntrưởng nhóm\ntruong nhom\nđồng nghiệp\ndong nghiep\nbạn bè\nban be\nđối tác\ndoi tac\nquản trị viên\nquan tri vien\nchủ sở hữu\nchu so huu\nkhách\nthành viên\nthanh vien\nngười dùng\nnguoi dung\nđiều hành viên\ndieu hanh vien\nthăng cấp\nthang cap\nhạ cấp\nha cap\nthu hồi\nthu hoi";
                    readonly tl: "role\ntungkulin\nitakda ang role\nbaguhin ang role\nboss\nmanager\nsupervisor\nlead\nkatrabaho\nkasamahan\nkaibigan\npartner\nadmin\nmay-ari\nguest\nmiyembro\nuser\nmod\nmoderador\ni-promote\ni-demote\nbawiin\nalisin ang role";
                };
            };
        };
        readonly triggerCreate: {
            readonly request: {
                readonly base: "schedule\nscheduled\ntrigger\nheartbeat\ncron\nrecurring\nrecur\nrepeat\nrepeating\nreminder\nremind\nautomate\nautomation\nautomatic\nperiodic\ninterval\nfollow up\ncheck in\nevery day\nevery week\nevery month\nevery hour\ndaily\nweekly\nmonthly\nhourly\nalarm\nwake me";
                readonly locales: {
                    readonly "zh-CN": "安排\n定时\n触发器\n心跳\ncron\n循环\n重复\n提醒\n提醒我\n自动化\n自动\n定期\n间隔\n跟进\n检查一下\n每天\n每周\n每月\n每小时\n闹钟\n叫醒我";
                    readonly ko: "예약\n예약해\n트리거\n하트비트\n크론\n반복\n반복적으로\n알림\n리마인더\n자동화\n자동\n주기적\n간격\n후속 확인\n매일\n매주\n매달\n매시간\n알람\n깨워줘";
                    readonly es: "programa\nprogramar\nrecordatorio\nrecordar\nrecurrente\nrepetir\nautomatiza\nautomatizar\nautomático\nautomatico\nperiódico\nperiodico\nintervalo\nseguimiento\ncada día\ncada dia\ncada semana\ncada mes\ncada hora\ndiario\nsemanal\nmensual\nalarma\ndespiértame\ndespiertame";
                    readonly pt: "programa\nprogramar\nlembrete\nlembrar\nrecorrente\nrepetir\nautomatiza\nautomatizar\nautomático\nautomatico\nperiódico\nperiodico\nintervalo\nacompanhamento\ncada dia\ncada semana\ncada mês\ncada mes\ncada hora\ndiário\ndiario\nsemanal\nmensal\nalarme\nme acorde";
                    readonly vi: "lên lịch\nlen lich\nlời nhắc\nloi nhac\nnhắc tôi\nnhac toi\nlặp lại\nlap lai\ntự động\ntu dong\ntự động hóa\ntu dong hoa\nđịnh kỳ\ndinh ky\nkhoảng cách\nkhoang cach\ntheo dõi\ntheo doi\nmỗi ngày\nmoi ngay\nmỗi tuần\nmoi tuan\nmỗi tháng\nmoi thang\nmỗi giờ\nmoi gio\nbáo thức\nbao thuc\nđánh thức tôi\ndanh thuc toi";
                    readonly tl: "iskedyul\npaalala\nipaalala\npaulit-ulit\nulitin\nawtomatiko\nawtomasyon\npana-panahon\npagitan\nfollow up\nkada araw\nkada linggo\nkada buwan\nkada oras\nalarm\ngisingin mo ako";
                };
            };
        };
        readonly createTask: {
            readonly request: {
                readonly base: "create task\ncreate trigger\ncreate a trigger\nset a trigger\nschedule a trigger\nschedule a task\nremind me\nreminder\nrecurring\nrepeat\nheartbeat\ncron\nrun every\nrun at\nevery day\nevery week\nevery month\nevery hour";
                readonly locales: {
                    readonly "zh-CN": "创建任务\n创建触发器\n设置触发器\n安排任务\n提醒我\n提醒\n重复\n循环\n心跳\n定时\n每天\n每周\n每月\n每小时";
                    readonly ko: "작업 만들기\n트리거 만들기\n트리거 설정\n작업 예약\n알림\n리마인더\n반복\n하트비트\n크론\n매일\n매주\n매달\n매시간";
                    readonly es: "crear tarea\ncrear disparador\nprograma una tarea\nprograma un disparador\nrecordatorio\nrecuérdame\nrecurrente\nrepetir\ncada día\ncada dia\ncada semana\ncada mes\ncada hora";
                    readonly pt: "criar tarefa\ncriar gatilho\nprogramar tarefa\nprogramar gatilho\nlembrete\nlembra-me\nrecorrente\nrepetir\ncada dia\ncada semana\ncada mês\ncada mes\ncada hora";
                    readonly vi: "tạo tác vụ\ntao tac vu\ntạo trình kích hoạt\ntao trinh kich hoat\nlên lịch tác vụ\nlen lich tac vu\nlời nhắc\nloi nhac\nnhắc tôi\nnhac toi\nlặp lại\nlap lai\nmỗi ngày\nmoi ngay\nmỗi tuần\nmoi tuan";
                    readonly tl: "gumawa ng task\ngumawa ng trigger\niskedyul ang task\niskedyul ang trigger\npaalala\nipaalala\npaulit-ulit\nkada araw\nkada linggo\nkada buwan\nkada oras";
                };
            };
        };
        readonly searchContacts: {
            readonly request: {
                readonly base: "list contacts\nshow contacts\nsearch contacts\nfind contacts\nwho do i know\nfriends\ncolleagues\nvip";
                readonly locales: {
                    readonly "zh-CN": "联系人列表\n显示联系人\n搜索联系人\n查找联系人\n我认识谁\n朋友\n同事\n贵宾";
                    readonly ko: "연락처 목록\n연락처 보여줘\n연락처 검색\n연락처 찾기\n내가 아는 사람\n친구\n동료\nVIP";
                    readonly es: "lista de contactos\nmuestra contactos\nbusca contactos\nencuentra contactos\na quién conozco\na quien conozco\namigos\ncolegas\nvip";
                    readonly pt: "lista de contatos\nmostrar contatos\nbuscar contatos\nencontrar contatos\nquem eu conheço\nquem eu conheco\namigos\ncolegas\nvip";
                    readonly vi: "danh sách liên hệ\ndanh sach lien he\nhiển thị liên hệ\nhien thi lien he\ntìm liên hệ\ntim lien he\ntôi quen ai\ntoi quen ai\nbạn bè\nban be\nđồng nghiệp\ndong nghiep";
                    readonly tl: "listahan ng contact\nipakita ang contact\nhanapin ang contact\nsino ang kilala ko\nkaibigan\nkasamahan\nvip";
                };
            };
        };
        readonly addContact: {
            readonly request: {
                readonly base: "add contact\nsave contact\nremember contact\ncategorize contact\nadd to relationships\nsave this person";
                readonly locales: {
                    readonly "zh-CN": "添加联系人\n保存联系人\n记住联系人\n给联系人分类\n加入关系\n保存这个人";
                    readonly ko: "연락처 추가\n연락처 저장\n연락처 기억해\n연락처 분류\n관계에 추가\n이 사람 저장";
                    readonly es: "agrega contacto\nagregar contacto\nguarda contacto\nrecuerda contacto\ncategoriza contacto\nagrega a relaciones\nguarda a esta persona";
                    readonly pt: "adicionar contato\nadiciona contato\nsalvar contato\nlembrar contato\ncategorizar contato\nadicionar aos relacionamentos\nsalvar esta pessoa";
                    readonly vi: "thêm liên hệ\nthem lien he\nlưu liên hệ\nluu lien he\nghi nhớ liên hệ\nghi nho lien he\nphân loại liên hệ\nphan loai lien he";
                    readonly tl: "magdagdag ng contact\ni-save ang contact\ntandaan ang contact\nikategorya ang contact\ni-save ang taong ito";
                };
            };
        };
        readonly updateContact: {
            readonly request: {
                readonly base: "update contact\nedit contact\nmodify contact\nchange contact\nupdate relationship\nedit relationship\nchange notes\nadd tag\nremove tag\nadd category\nremove category";
                readonly locales: {
                    readonly "zh-CN": "更新联系人\n编辑联系人\n修改联系人\n更新关系\n编辑关系\n修改备注\n添加标签\n移除标签\n添加分类\n移除分类";
                    readonly ko: "연락처 업데이트\n연락처 수정\n연락처 변경\n관계 업데이트\n메모 변경\n태그 추가\n태그 제거\n분류 추가\n분류 제거";
                    readonly es: "actualiza contacto\nactualizar contacto\nedita contacto\nmodifica contacto\ncambia contacto\nactualiza relación\nactualiza relacion\ncambia notas\nagrega etiqueta\nquita etiqueta\nagrega categoría\nagrega categoria\nquita categoría\nquita categoria";
                    readonly pt: "atualizar contato\natualiza contato\neditar contato\nmodificar contato\nmudar contato\natualizar relacionamento\nmudar notas\nadicionar etiqueta\nremover etiqueta\nadicionar categoria\nremover categoria";
                    readonly vi: "cập nhật liên hệ\ncap nhat lien he\nsửa liên hệ\nsua lien he\nthay đổi liên hệ\nthay doi lien he\ncập nhật quan hệ\ncap nhat quan he\nthêm thẻ\nthem the\nxóa thẻ\nxoa the";
                    readonly tl: "i-update ang contact\ni-edit ang contact\nbaguhin ang contact\ni-update ang relasyon\ndagdagan ng tag\nalisin ang tag\ndagdagan ng kategorya\nalisin ang kategorya";
                };
            };
        };
        readonly removeContact: {
            readonly request: {
                readonly base: "remove contact\ndelete contact\ndrop contact\nremove from relationships\nforget contact";
                readonly locales: {
                    readonly "zh-CN": "移除联系人\n删除联系人\n从关系中移除\n忘记联系人";
                    readonly ko: "연락처 제거\n연락처 삭제\n관계에서 제거\n연락처 잊어";
                    readonly es: "elimina contacto\neliminar contacto\nborra contacto\nquita de relaciones\nolvida contacto";
                    readonly pt: "remover contato\nexcluir contato\napagar contato\nremover dos relacionamentos\nesquecer contato";
                    readonly vi: "xóa liên hệ\nxoa lien he\ngỡ liên hệ\ngo lien he\nxóa khỏi quan hệ\nxoa khoi quan he";
                    readonly tl: "alisin ang contact\nburahin ang contact\ntanggalin sa relationships\nkalimutan ang contact";
                };
            };
        };
        readonly scheduleFollowUp: {
            readonly request: {
                readonly base: "follow up\nfollowup\nremind me\ncheck in\ncheck back\nreach out\nschedule follow-up\nschedule a reminder";
                readonly locales: {
                    readonly "zh-CN": "跟进\n提醒我\n回访\n联系一下\n安排提醒\n安排跟进";
                    readonly ko: "후속 조치\n팔로업\n알려줘\n체크인\n다시 연락\n후속 일정 잡아";
                    readonly es: "seguimiento\nhaz seguimiento\nrecuérdame\nrecuerdame\nvuelve a contactar\nrevisa de nuevo\nprograma seguimiento";
                    readonly pt: "acompanhamento\nfaça acompanhamento\nfaca acompanhamento\nlembra-me\nentre em contato de novo\nprograme acompanhamento";
                    readonly vi: "theo dõi\ntheo doi\nnhắc tôi\nnhac toi\nliên hệ lại\nlien he lai\nlên lịch theo dõi\nlen lich theo doi";
                    readonly tl: "follow up\npaalalahanan mo ako\ncheck in\nmakipag-ugnayan muli\niskedyul ang follow up";
                };
            };
        };
        readonly followRoom: {
            readonly request: {
                readonly base: "follow this room\nparticipate here\nengage here\nlisten to this room\njoin this room\ntake interest";
                readonly locales: {
                    readonly "zh-CN": "关注这个房间\n参与这里\n加入这个房间\n听这个房间";
                    readonly ko: "이 방을 팔로우해\n여기에 참여해\n이 방에 들어와\n이 방을 들어줘";
                    readonly es: "sigue esta sala\nparticipa aquí\nparticipa aqui\núnete a esta sala\nunete a esta sala\npresta atención aquí\npresta atencion aqui";
                    readonly pt: "siga esta sala\nparticipe aqui\nentre nesta sala\npreste atenção aqui\npreste atencao aqui";
                    readonly vi: "theo dõi phòng này\ntheo doi phong nay\ntham gia ở đây\ntham gia o day\nvào phòng này\nvao phong nay";
                    readonly tl: "i-follow ang room na ito\nsumali dito\nmakilahok dito\nmakinig sa room na ito";
                };
            };
        };
        readonly muteRoom: {
            readonly request: {
                readonly base: "mute\nsilence\nquiet\nshut up\nstop talking\nbe quiet\nhush\nshh\nno more";
                readonly locales: {
                    readonly "zh-CN": "静音\n安静\n闭嘴\n别说话\n不要再说了";
                    readonly ko: "음소거\n조용히\n입 다물어\n말하지 마\n그만 말해";
                    readonly es: "silencia\nponte en silencio\ncállate\ncallate\ndeja de hablar\nguarda silencio";
                    readonly pt: "silencia\nfique em silêncio\nfique em silencio\ncala a boca\npara de falar\nfique quieto";
                    readonly vi: "tắt tiếng\ntat tieng\nim lặng\nim lang\nđừng nói nữa\ndung noi nua";
                    readonly tl: "i-mute\ntumahimik\ntigilan ang pagsasalita\nwag ka nang magsalita";
                };
            };
        };
        readonly unmuteRoom: {
            readonly request: {
                readonly base: "unmute\nunsilence\nlisten again\nstart talking\ntalk again\nspeak again\nenable\nresume";
                readonly locales: {
                    readonly "zh-CN": "取消静音\n恢复说话\n再说话\n继续\n恢复";
                    readonly ko: "음소거 해제\n다시 말해\n다시 듣기\n재개";
                    readonly es: "activa el sonido\nquitar silencio\nvuelve a hablar\nreanuda\nescucha otra vez";
                    readonly pt: "tirar do silêncio\ntirar do silencio\nvolte a falar\nretomar\nouça de novo\nouca de novo";
                    readonly vi: "bỏ tắt tiếng\nbo tat tieng\nnói lại đi\nnoi lai di\ntiếp tục\ntiep tuc";
                    readonly tl: "i-unmute\nmagsalita ulit\nipagpatuloy\nmakinig ulit";
                };
            };
        };
        readonly processDocuments: {
            readonly request: {
                readonly base: "process knowledge\nadd to knowledge\nupload document\nadd document\nlearn this\nremember this\nstore this\ningest file\nknowledge base";
                readonly locales: {
                    readonly "zh-CN": "处理知识\n加入知识库\n上传文档\n添加文档\n记住这个\n存入知识库\n知识库";
                    readonly ko: "지식 처리\n지식에 추가\n문서 업로드\n문서 추가\n이걸 기억해\n저장해\n지식 베이스";
                    readonly es: "procesa conocimiento\nagrega al conocimiento\nsube documento\nañade documento\nanade documento\nrecuerda esto\nguarda esto\nbase de conocimiento";
                    readonly pt: "processar conhecimento\nadicionar ao conhecimento\nenviar documento\nadicionar documento\nlembre isto\nguarde isto\nbase de conhecimento";
                    readonly vi: "xử lý kiến thức\nxu ly kien thuc\nthêm vào kiến thức\nthem vao kien thuc\ntải tài liệu lên\ntai tai lieu len\nghi nhớ điều này\nghi nho dieu nay";
                    readonly tl: "iproseso ang kaalaman\nidagdag sa kaalaman\nmag-upload ng dokumento\ni-save ito\ntandaan ito\nknowledge base";
                };
            };
        };
        readonly searchDocuments: {
            readonly request: {
                readonly base: "search knowledge\nfind information\nlook up\nquery knowledge base\nsearch documents\nfind in knowledge\nwhat do you know about";
                readonly locales: {
                    readonly "zh-CN": "搜索知识\n查找信息\n查询知识库\n搜索文档\n你知道什么关于";
                    readonly ko: "지식 검색\n정보 찾기\n찾아봐\n지식 베이스 조회\n문서 검색\n무엇을 알고 있어";
                    readonly es: "busca conocimiento\nbuscar información\nbusca información\nbusca informacion\nconsulta la base de conocimiento\nbusca documentos\nqué sabes sobre\nque sabes sobre";
                    readonly pt: "busca conhecimento\nbuscar informação\nbuscar informacao\nprocure informação\nprocure informacao\nconsulte a base de conhecimento\no que você sabe sobre\no que voce sabe sobre";
                    readonly vi: "tìm kiến thức\ntim kien thuc\ntìm thông tin\ntim thong tin\ntra cứu kiến thức\ntra cuu kien thuc\nbạn biết gì về\nban biet gi ve";
                    readonly tl: "hanapin ang kaalaman\nhanapin ang impormasyon\ntingnan sa knowledge base\nano ang alam mo tungkol sa";
                };
            };
        };
        readonly generateImage: {
            readonly strong: {
                readonly base: "generate image\ncreate image\nmake image\ndraw\npaint\nillustration\ngenerate picture\ncreate picture\nmake picture\ngenerate art\ncreate art\nimage of\npicture of\nphoto of";
                readonly locales: {
                    readonly "zh-CN": "生成图片\n创建图片\n画\n绘制\n插画\n图片\n照片";
                    readonly ko: "이미지 생성\n그림 그려\n그려줘\n그림\n일러스트\n사진";
                    readonly es: "genera imagen\ncrear imagen\nhaz una imagen\ndibuja\npinta\nilustración\nilustracion\nfoto de";
                    readonly pt: "gerar imagem\ncriar imagem\nfaça uma imagem\nfaca uma imagem\ndesenhe\npinte\nilustração\nilustracao\nfoto de";
                    readonly vi: "tạo ảnh\ntao anh\nvẽ\nve\nminh họa\nminh hoa\nhình ảnh\nhinh anh";
                    readonly tl: "gumawa ng larawan\nlumikha ng larawan\ngumuhit\npinta\nlarawan ng\nphoto ng";
                };
            };
            readonly weak: {
                readonly base: "image\npicture\nvisual\nart\ngraphic\nrender\ngenerate\ncreate\ndesign\nsketch\nportrait";
                readonly locales: {
                    readonly "zh-CN": "图片\n图像\n视觉\n艺术\n设计\n素描\n肖像";
                    readonly ko: "이미지\n사진\n비주얼\n아트\n디자인\n스케치\n초상화";
                    readonly es: "imagen\nfoto\nvisual\narte\ngráfico\ngrafico\ndiseño\ndiseno\nboceto\nretrato";
                    readonly pt: "imagem\nfoto\nvisual\narte\ngráfico\ngrafico\ndesign\nesboço\nesboco\nretrato";
                    readonly vi: "ảnh\nanh\nhình\nhinh\nthị giác\nthi giac\nnghệ thuật\nnghe thuat\nthiết kế\nthiet ke";
                    readonly tl: "larawan\nbiswal\nsining\ndisenyo\nsketch\nretrato";
                };
            };
        };
        readonly generateMedia: {
            readonly request: {
                readonly base: "generate media\ncreate media\nmake media\ngenerate image\ncreate image\ngenerate video\ncreate video\nanimate\nanimation\ngenerate audio\ncreate audio\ngenerate music\nsound effect\ntext to speech\ntts\nvoiceover";
                readonly locales: {
                    readonly "zh-CN": "生成媒体\n创建媒体\n生成图片\n生成视频\n动画\n生成音频\n音乐\n文字转语音";
                    readonly ko: "미디어 생성\n이미지 생성\n비디오 생성\n영상 생성\n애니메이션\n오디오 생성\n음악 생성\n텍스트 음성 변환";
                    readonly es: "generar media\ncrear media\ngenerar imagen\ncrear imagen\ngenerar video\ncrear video\nanimar\ngenerar audio\ncrear audio\ntexto a voz";
                    readonly pt: "gerar mídia\ngerar midia\ncriar mídia\ncriar midia\ngerar imagem\ncriar imagem\ngerar vídeo\ngerar video\nanimar\ngerar áudio\ngerar audio\ntexto para fala";
                    readonly vi: "tạo media\ntao media\ntạo ảnh\ntao anh\ntạo video\ntao video\nhoạt hình\nhoat hinh\ntạo âm thanh\ntao am thanh\nvăn bản thành giọng nói";
                    readonly tl: "gumawa ng media\nlumikha ng media\ngumawa ng larawan\ngumawa ng video\ni-animate\ngumawa ng audio\ntext to speech";
                };
            };
        };
    };
    readonly contextSignal: {
        readonly admin: {
            readonly strong: {
                readonly base: "admin\nowner\npermissions\nroles\npolicy\nsystem control";
                readonly locales: {
                    readonly es: "administrador\ndueño\npermisos\nroles\npolitica";
                    readonly ko: "관리자\n소유자\n권한\n역할\n정책";
                    readonly pt: "administrador\ndono\npermissoes\nfuncoes\npolitica";
                    readonly tl: "admin\nmay ari\npahintulot\nrole\npatakaran";
                    readonly vi: "quản trị\nquan tri\nchủ sở hữu\nchu so huu\nquyền\nquyen";
                    readonly "zh-CN": "管理员\n所有者\n权限\n角色\n策略";
                };
            };
        };
        readonly agent_internal: {
            readonly strong: {
                readonly base: "agent internal\nself management\nautonomous task\ninternal state";
                readonly locales: {
                    readonly es: "interno del agente\ngestion interna\nestado interno";
                    readonly ko: "에이전트 내부\n자체 관리\n내부 상태";
                    readonly pt: "interno do agente\ngestao interna\nestado interno";
                    readonly tl: "internal ng agent\nsariling pamamahala\ninternal state";
                    readonly vi: "nội bộ tác tử\nnoi bo tac tu\ntự quản lý\ntu quan ly";
                    readonly "zh-CN": "代理内部\n自我管理\n内部状态";
                };
            };
        };
        readonly automation: {
            readonly strong: {
                readonly base: "automation\nworkflow\ntrigger\ncron\nmonitor\nscheduled job";
                readonly locales: {
                    readonly es: "automatizacion\nflujo de trabajo\ndisparador\ncron\nmonitor";
                    readonly ko: "자동화\n워크플로\n트리거\n크론\n모니터";
                    readonly pt: "automacao\nfluxo de trabalho\ngatilho\ncron\nmonitor";
                    readonly tl: "automation\nworkflow\ntrigger\ncron\nmonitor";
                    readonly vi: "tự động hóa\ntu dong hoa\nquy trình\nquy trinh\nkich hoat";
                    readonly "zh-CN": "自动化\n工作流\n触发器\n定时\n监控";
                };
            };
        };
        readonly browser: {
            readonly strong: {
                readonly base: "browser\nopen page\nclick\ntype on website\nbrowser session";
                readonly locales: {
                    readonly es: "navegador\nabrir pagina\nhacer clic\nsitio web";
                    readonly ko: "브라우저\n페이지 열기\n클릭\n웹사이트 입력";
                    readonly pt: "navegador\nabrir pagina\nclicar\nsite";
                    readonly tl: "browser\nbuksan ang pahina\nclick\nwebsite";
                    readonly vi: "trình duyệt\ntrinh duyet\nmở trang\nmo trang\nnhấp";
                    readonly "zh-CN": "浏览器\n打开页面\n点击\n网站输入";
                };
            };
        };
        readonly character: {
            readonly strong: {
                readonly base: "character\npersonality\nvoice\nstyle\nsystem prompt\nagent profile";
                readonly locales: {
                    readonly es: "personaje\npersonalidad\nvoz\nestilo\nperfil";
                    readonly ko: "캐릭터\n성격\n목소리\n스타일\n프로필";
                    readonly pt: "personagem\npersonalidade\nvoz\nestilo\nperfil";
                    readonly tl: "karakter\npersonalidad\nboses\nestilo\nprofile";
                    readonly vi: "nhân vật\nnhan vat\ntính cách\ntinh cach\ngiọng\ngiong";
                    readonly "zh-CN": "角色\n性格\n声音\n风格\n资料";
                };
            };
        };
        readonly code: {
            readonly strong: {
                readonly base: "code\nprogramming\nrepo\nrepository\nimplementation\ndebug\ntest";
                readonly locales: {
                    readonly es: "codigo\nprogramacion\nrepositorio\nimplementar\ndepurar\nprueba";
                    readonly ko: "코드\n프로그래밍\n저장소\n구현\n디버그\n테스트";
                    readonly pt: "codigo\nprogramacao\nrepositorio\nimplementar\ndepurar\nteste";
                    readonly tl: "code\nprogramming\nrepo\nipatupad\ndebug\ntest";
                    readonly vi: "mã\nma\nlập trình\nlap trinh\nkho mã\nkho ma\nkiểm thử";
                    readonly "zh-CN": "代码\n编程\n仓库\n实现\n调试\n测试";
                };
            };
        };
        readonly connectors: {
            readonly strong: {
                readonly base: "connector\nintegration\noauth\nmcp\naccount connection\napp auth";
                readonly locales: {
                    readonly es: "conector\nintegracion\noauth\nmcp\ncuenta conectada";
                    readonly ko: "커넥터\n통합\n오어스\n계정 연결";
                    readonly pt: "conector\nintegracao\noauth\nmcp\nconta conectada";
                    readonly tl: "connector\nintegration\noauth\naccount connection";
                    readonly vi: "kết nối\nket noi\ntích hợp\ntich hop\noauth\ntài khoản";
                    readonly "zh-CN": "连接器\n集成\n授权\n账号连接";
                };
            };
        };
        readonly contacts: {
            readonly strong: {
                readonly base: "contacts\nperson\npeople\nrelationship\nfriend\ncolleague";
                readonly locales: {
                    readonly es: "contactos\npersona\ngente\nrelacion\namigo\ncolega";
                    readonly ko: "연락처\n사람\n관계\n친구\n동료";
                    readonly pt: "contatos\npessoa\npessoas\nrelacao\namigo\ncolega";
                    readonly tl: "contacts\ntao\nrelasyon\nkaibigan\nkasamahan";
                    readonly vi: "liên hệ\nlien he\nngười\nnguoi\nquan hệ\nquan he";
                    readonly "zh-CN": "联系人\n人物\n关系\n朋友\n同事";
                };
            };
        };
        readonly crypto: {
            readonly strong: {
                readonly base: "crypto\ntoken\ndefi\non-chain\nswap\nbridge\nliquidity";
                readonly locales: {
                    readonly es: "cripto\ntoken\ndefi\ncadena\nintercambio\nliquidez";
                    readonly ko: "암호화폐\n토큰\n디파이\n온체인\n스왑\n유동성";
                    readonly pt: "cripto\ntoken\ndefi\nonchain\ntroca\nliquidez";
                    readonly tl: "crypto\ntoken\ndefi\nswap\nliquidity";
                    readonly vi: "crypto\ntiền mã hóa\ntien ma hoa\ntoken\ndefi\nthanh khoản";
                    readonly "zh-CN": "加密货币\n代币\n链上\n交换\n流动性";
                };
            };
        };
        readonly documents: {
            readonly strong: {
                readonly base: "document\ndocuments\nnotes\nfile content\nsave notes\nartifact";
                readonly locales: {
                    readonly es: "documento\ndocumentos\nnotas\nguardar notas\narchivo";
                    readonly ko: "문서\n노트\n파일 내용\n저장";
                    readonly pt: "documento\ndocumentos\nnotas\nsalvar notas\narquivo";
                    readonly tl: "dokumento\nnotes\nnilalaman ng file\ni-save";
                    readonly vi: "tài liệu\ntai lieu\nghi chú\nghi chu\nlưu ghi chú";
                    readonly "zh-CN": "文档\n笔记\n文件内容\n保存笔记";
                };
            };
        };
        readonly email: {
            readonly strong: {
                readonly base: "email account\nmail\ninbox\ndraft email\nsend email";
                readonly locales: {
                    readonly es: "correo\nbandeja\nredactar correo\nenviar correo";
                    readonly ko: "이메일\n메일함\n받은편지함\n메일 보내기";
                    readonly pt: "email\ncorreio\ncaixa de entrada\nenviar email";
                    readonly tl: "email\ninbox\ngumawa ng email\nmagpadala ng email";
                    readonly vi: "email\nthư\nthu\nhộp thư\nhop thu\ngửi email";
                    readonly "zh-CN": "邮件\n邮箱\n收件箱\n发送邮件";
                };
            };
        };
        readonly files: {
            readonly strong: {
                readonly base: "file\nfiles\nfolder\ndirectory\nread file\nwrite file";
                readonly locales: {
                    readonly es: "archivo\narchivos\ncarpeta\ndirectorio\nleer archivo";
                    readonly ko: "파일\n폴더\n디렉터리\n파일 읽기\n파일 쓰기";
                    readonly pt: "arquivo\narquivos\npasta\ndiretorio\nler arquivo";
                    readonly tl: "file\nfiles\nfolder\ndirectory\nbasahin file";
                    readonly vi: "tệp\ntep\nthư mục\nthu muc\nđọc tệp\ndoc tep";
                    readonly "zh-CN": "文件\n文件夹\n目录\n读取文件\n写文件";
                };
            };
        };
        readonly finance: {
            readonly strong: {
                readonly base: "finance\nmoney\nbalance\nportfolio\ninvoice\naccount";
                readonly locales: {
                    readonly es: "finanzas\ndinero\nsaldo\nportafolio\nfactura\ncuenta";
                    readonly ko: "금융\n돈\n잔액\n포트폴리오\n청구서\n계정";
                    readonly pt: "financas\ndinheiro\nsaldo\nportfolio\nfatura\nconta";
                    readonly tl: "finance\npera\nbalance\nportfolio\ninvoice\naccount";
                    readonly vi: "tài chính\ntai chinh\ntiền\ntien\nsố dư\nso du";
                    readonly "zh-CN": "财务\n钱\n余额\n投资组合\n发票\n账户";
                };
            };
        };
        readonly game: {
            readonly strong: {
                readonly base: "game\ngameplay\nmatch\nsimulation\nplayer\nturn";
                readonly locales: {
                    readonly es: "juego\npartida\nsimulacion\njugador\nturno";
                    readonly ko: "게임\n플레이\n매치\n시뮬레이션\n플레이어\n턴";
                    readonly pt: "jogo\npartida\nsimulacao\njogador\nturno";
                    readonly tl: "laro\ngameplay\nsimulation\nplayer\nturn";
                    readonly vi: "trò chơi\ntro choi\nmô phỏng\nmo phong\nngười chơi";
                    readonly "zh-CN": "游戏\n对局\n模拟\n玩家\n回合";
                };
            };
        };
        readonly general: {
            readonly strong: {
                readonly base: "general chat\nconversation\nreply\nanswer\ntalk";
                readonly locales: {
                    readonly es: "conversacion\nrespuesta\nhablar\nchat general";
                    readonly ko: "일반 대화\n답변\n말하기\n채팅";
                    readonly pt: "conversa\nresposta\nfalar\nchat geral";
                    readonly tl: "usap\nsagot\nmakipag-usap\ngeneral chat";
                    readonly vi: "trò chuyện\ntro chuyen\ntrả lời\ntra loi\nnói chuyện";
                    readonly "zh-CN": "普通聊天\n对话\n回复\n回答";
                };
            };
        };
        readonly health: {
            readonly strong: {
                readonly base: "health\nwellness\nsleep\nexercise\nmedicine\nsymptom";
                readonly locales: {
                    readonly es: "salud\nbienestar\nsueño\nejercicio\nmedicina\nsintoma";
                    readonly ko: "건강\n웰니스\n수면\n운동\n약\n증상";
                    readonly pt: "saude\nbem-estar\nsono\nexercicio\nremedio\nsintoma";
                    readonly tl: "kalusugan\nwellness\ntulog\nehersisyo\ngamot\nsintomas";
                    readonly vi: "sức khỏe\nsuc khoe\nngủ\nngu\ntập luyện\ntrieu chung";
                    readonly "zh-CN": "健康\n睡眠\n运动\n药物\n症状";
                };
            };
        };
        readonly knowledge: {
            readonly strong: {
                readonly base: "knowledge\nknown facts\nsaved notes\nrecall\nsemantic search";
                readonly locales: {
                    readonly es: "conocimiento\nhechos guardados\nnotas guardadas\nrecordar";
                    readonly ko: "지식\n저장된 사실\n저장된 노트\n회상\n검색";
                    readonly pt: "conhecimento\nfatos salvos\nnotas salvas\nlembrar";
                    readonly tl: "kaalaman\nsaved facts\nsaved notes\nalalahanin";
                    readonly vi: "kiến thức\nkien thuc\nghi chú đã lưu\nghi chu da luu\nnhớ lại";
                    readonly "zh-CN": "知识\n已保存事实\n已保存笔记\n回忆\n语义搜索";
                };
            };
        };
        readonly media: {
            readonly strong: {
                readonly base: "media\nimage\nvideo\naudio\nscreenshot\ntranscript";
                readonly locales: {
                    readonly es: "multimedia\nimagen\nvideo\naudio\ncaptura\ntranscripcion";
                    readonly ko: "미디어\n이미지\n비디오\n오디오\n스크린샷\n전사";
                    readonly pt: "midia\nimagem\nvideo\naudio\ncaptura\ntranscricao";
                    readonly tl: "media\nlarawan\nvideo\naudio\nscreenshot\ntranscript";
                    readonly vi: "đa phương tiện\nda phuong tien\nhình ảnh\nhinh anh\nvideo\nâm thanh";
                    readonly "zh-CN": "媒体\n图片\n视频\n音频\n截图\n转录";
                };
            };
        };
        readonly memory: {
            readonly strong: {
                readonly base: "memory\nremember\nrecall\nsave memory\nlong term memory";
                readonly locales: {
                    readonly es: "memoria\nrecordar\nrecuerdo\nguardar memoria";
                    readonly ko: "기억\n기억해\n회상\n장기 기억";
                    readonly pt: "memoria\nlembrar\nrecordar\nsalvar memoria";
                    readonly tl: "memory\ntandaan\nalalahanin\nlong term memory";
                    readonly vi: "ký ức\nky uc\nnhớ\nnho\nghi nhớ\nghi nho";
                    readonly "zh-CN": "记忆\n记住\n回忆\n长期记忆";
                };
            };
        };
        readonly payments: {
            readonly strong: {
                readonly base: "payment\npay\ninvoice\nbilling\ncheckout\nsubscription charge";
                readonly locales: {
                    readonly es: "pago\npagar\nfactura\ncobro\ncheckout";
                    readonly ko: "결제\n지불\n청구서\n요금\n체크아웃";
                    readonly pt: "pagamento\npagar\nfatura\ncobranca\ncheckout";
                    readonly tl: "bayad\nmagbayad\ninvoice\nbilling\ncheckout";
                    readonly vi: "thanh toán\nthanh toan\nhóa đơn\nhoa don\ntính tiền";
                    readonly "zh-CN": "付款\n支付\n发票\n账单\n结账";
                };
            };
        };
        readonly phone: {
            readonly strong: {
                readonly base: "phone\nsms\ntext message\ncall\ndial\niMessage";
                readonly locales: {
                    readonly es: "telefono\nsms\nmensaje\nllamada\nmarcar";
                    readonly ko: "전화\n문자\n메시지\n통화\n아이메시지";
                    readonly pt: "telefone\nsms\nmensagem\nligacao\ndiscar";
                    readonly tl: "telepono\nsms\ntext\ntawag\ndial";
                    readonly vi: "điện thoại\ndien thoai\nsms\ntin nhắn\ncuộc gọi";
                    readonly "zh-CN": "电话\n短信\n消息\n通话\n拨号";
                };
            };
        };
        readonly productivity: {
            readonly strong: {
                readonly base: "productivity\nplanning\npriorities\nwork planning\npersonal operations";
                readonly locales: {
                    readonly es: "productividad\nplanificacion\nprioridades\nplan de trabajo";
                    readonly ko: "생산성\n계획\n우선순위\n업무 계획";
                    readonly pt: "produtividade\nplanejamento\nprioridades\nplano de trabalho";
                    readonly tl: "productivity\npagpaplano\nprayoridad\nwork plan";
                    readonly vi: "năng suất\nnang suat\nlập kế hoạch\nlap ke hoach\nưu tiên";
                    readonly "zh-CN": "效率\n规划\n优先级\n工作计划";
                };
            };
        };
        readonly research: {
            readonly strong: {
                readonly base: "research\ninvestigate\ncompare sources\nfindings\ncitations\nsynthesis";
                readonly locales: {
                    readonly es: "investigacion\ninvestigar\ncomparar fuentes\nhallazgos\ncitas";
                    readonly ko: "조사\n연구\n출처 비교\n결과\n인용\n종합";
                    readonly pt: "pesquisa\ninvestigar\ncomparar fontes\nachados\ncitacoes";
                    readonly tl: "research\nimbestiga\nikumpara sources\nfindings\ncitations";
                    readonly vi: "nghiên cứu\nnghien cuu\nđiều tra\ndieu tra\ntrích dẫn";
                    readonly "zh-CN": "研究\n调查\n比较来源\n发现\n引用\n综合";
                };
            };
        };
        readonly screen_time: {
            readonly strong: {
                readonly base: "screen time\ndevice usage\napp limits\nusage report\nfocus";
                readonly locales: {
                    readonly es: "tiempo de pantalla\nuso del dispositivo\nlimites de apps\nenfoque";
                    readonly ko: "스크린 타임\n기기 사용\n앱 제한\n사용 보고서\n집중";
                    readonly pt: "tempo de tela\nuso do dispositivo\nlimites de app\nfoco";
                    readonly tl: "screen time\ngamit ng device\napp limits\nfocus";
                    readonly vi: "thời gian màn hình\nthoi gian man hinh\ngiới hạn ứng dụng";
                    readonly "zh-CN": "屏幕时间\n设备使用\n应用限制\n使用报告\n专注";
                };
            };
        };
        readonly secrets: {
            readonly strong: {
                readonly base: "secret\nsecrets\napi key\ntoken\ncredential\npassword";
                readonly locales: {
                    readonly es: "secreto\nsecretos\nclave api\ntoken\ncredencial\ncontraseña";
                    readonly ko: "비밀\n시크릿\napi 키\n토큰\n자격 증명\n비밀번호";
                    readonly pt: "segredo\nsegredos\nchave api\ntoken\ncredencial\nsenha";
                    readonly tl: "secret\napi key\ntoken\ncredential\npassword";
                    readonly vi: "bí mật\nbi mat\nkhóa api\nkhoa api\ntoken\nmật khẩu";
                    readonly "zh-CN": "密钥\n秘密\nAPI 密钥\n令牌\n凭据\n密码";
                };
            };
        };
        readonly settings: {
            readonly strong: {
                readonly base: "settings\npreferences\nconfiguration\nconfig\ntoggle\nmodel settings";
                readonly locales: {
                    readonly es: "ajustes\npreferencias\nconfiguracion\nactivar\nmodelo";
                    readonly ko: "설정\n환경설정\n구성\n토글\n모델 설정";
                    readonly pt: "configuracoes\npreferencias\nconfiguracao\nalternar\nmodelo";
                    readonly tl: "settings\npreferences\nconfiguration\ntoggle\nmodel settings";
                    readonly vi: "cài đặt\ncai dat\ntùy chọn\ntuy chon\ncấu hình";
                    readonly "zh-CN": "设置\n偏好\n配置\n开关\n模型设置";
                };
            };
        };
        readonly simple: {
            readonly strong: {
                readonly base: "simple answer\nno tools\ndirect reply\njust answer";
                readonly locales: {
                    readonly es: "respuesta simple\nsin herramientas\nrespuesta directa";
                    readonly ko: "간단한 답\n도구 없음\n직접 답변";
                    readonly pt: "resposta simples\nsem ferramentas\nresposta direta";
                    readonly tl: "simpleng sagot\nwalang tools\ndirektang sagot";
                    readonly vi: "trả lời đơn giản\ntra loi don gian\nkhông dùng công cụ";
                    readonly "zh-CN": "简单回答\n不用工具\n直接回复";
                };
            };
        };
        readonly social: {
            readonly strong: {
                readonly base: "social\nsocial media\nfeed\ntimeline\ndm\nreply";
                readonly locales: {
                    readonly es: "social\nredes sociales\nfeed\nlinea de tiempo\ndm\nresponder";
                    readonly ko: "소셜\n소셜 미디어\n피드\n타임라인\n디엠\n답글";
                    readonly pt: "social\nrede social\nfeed\nlinha do tempo\ndm\nresponder";
                    readonly tl: "social\nsocial media\nfeed\ntimeline\ndm\nreply";
                    readonly vi: "mạng xã hội\nmang xa hoi\nbảng tin\nbang tin\ntin nhắn riêng";
                    readonly "zh-CN": "社交\n社交媒体\n动态\n时间线\n私信\n回复";
                };
            };
        };
        readonly social_posting: {
            readonly strong: {
                readonly base: "post\npublish\ntweet\ntimeline\npublic reply\nfeed search";
                readonly locales: {
                    readonly es: "publicar\npost\ntuit\nlinea de tiempo\nrespuesta publica";
                    readonly ko: "게시\n발행\n트윗\n타임라인\n공개 답글";
                    readonly pt: "postar\npublicar\ntweet\nlinha do tempo\nresposta publica";
                    readonly tl: "mag-post\npublish\ntweet\ntimeline\npublic reply";
                    readonly vi: "đăng\ndang\nxuất bản\nxuat ban\ntweet\ndòng thời gian";
                    readonly "zh-CN": "发布\n帖子\n推文\n时间线\n公开回复";
                };
            };
        };
        readonly state: {
            readonly strong: {
                readonly base: "state\nstatus\ncurrent mode\nruntime state\nroom state";
                readonly locales: {
                    readonly es: "estado\nestatus\nmodo actual\nestado de runtime";
                    readonly ko: "상태\n현재 모드\n런타임 상태\n룸 상태";
                    readonly pt: "estado\nstatus\nmodo atual\nestado do runtime";
                    readonly tl: "state\nstatus\ncurrent mode\nruntime state";
                    readonly vi: "trạng thái\ntrang thai\nchế độ hiện tại\nche do hien tai";
                    readonly "zh-CN": "状态\n当前模式\n运行时状态\n房间状态";
                };
            };
        };
        readonly subscriptions: {
            readonly strong: {
                readonly base: "subscription\nrenewal\nrecurring service\nbilling cycle\nmembership";
                readonly locales: {
                    readonly es: "suscripcion\nrenovacion\nservicio recurrente\nciclo de cobro";
                    readonly ko: "구독\n갱신\n반복 서비스\n결제 주기\n멤버십";
                    readonly pt: "assinatura\nrenovacao\nservico recorrente\nciclo de cobranca";
                    readonly tl: "subscription\nrenewal\nrecurring service\nbilling cycle";
                    readonly vi: "đăng ký\ndang ky\ngia hạn\ngia han\nchu kỳ thanh toán";
                    readonly "zh-CN": "订阅\n续费\n周期服务\n账单周期\n会员";
                };
            };
        };
        readonly system: {
            readonly strong: {
                readonly base: "system\nruntime\ndiagnostics\nprocess\noperational command";
                readonly locales: {
                    readonly es: "sistema\nruntime\ndiagnostico\nproceso\noperacion";
                    readonly ko: "시스템\n런타임\n진단\n프로세스\n운영 명령";
                    readonly pt: "sistema\nruntime\ndiagnostico\nprocesso\noperacao";
                    readonly tl: "system\nruntime\ndiagnostics\nprocess\noperation";
                    readonly vi: "hệ thống\nhe thong\nruntime\nchẩn đoán\nchan doan";
                    readonly "zh-CN": "系统\n运行时\n诊断\n进程\n运维命令";
                };
            };
        };
        readonly tasks: {
            readonly strong: {
                readonly base: "task\ntasks\ntodo\nreminder\nfollow up\ndue date";
                readonly locales: {
                    readonly es: "tarea\ntareas\npendiente\nrecordatorio\nseguimiento\nfecha limite";
                    readonly ko: "작업\n할 일\n리마인더\n후속 조치\n마감일";
                    readonly pt: "tarefa\ntarefas\nafazer\nlembrete\nacompanhamento\nprazo";
                    readonly tl: "task\ntodo\npaalala\nfollow up\ndeadline";
                    readonly vi: "tác vụ\ntac vu\nviệc cần làm\nviec can lam\nnhắc nhở";
                    readonly "zh-CN": "任务\n待办\n提醒\n跟进\n截止日期";
                };
            };
        };
        readonly terminal: {
            readonly strong: {
                readonly base: "terminal\nshell\ncommand line\nbash\nprocess\nstdout";
                readonly locales: {
                    readonly es: "terminal\nshell\nlinea de comandos\nbash\nproceso";
                    readonly ko: "터미널\n셸\n명령줄\n배시\n프로세스";
                    readonly pt: "terminal\nshell\nlinha de comando\nbash\nprocesso";
                    readonly tl: "terminal\nshell\ncommand line\nbash\nprocess";
                    readonly vi: "terminal\nshell\ndòng lệnh\ndong lenh\nbash\ntiến trình";
                    readonly "zh-CN": "终端\n命令行\nBash\n进程\n标准输出";
                };
            };
        };
        readonly todos: {
            readonly strong: {
                readonly base: "todo\ntodos\ntask list\ncomplete task\ndelete task\nactive task";
                readonly locales: {
                    readonly es: "pendiente\npendientes\nlista de tareas\ncompletar tarea\nborrar tarea";
                    readonly ko: "할 일\n작업 목록\n작업 완료\n작업 삭제\n활성 작업";
                    readonly pt: "afazer\nafazeres\nlista de tarefas\nconcluir tarefa\napagar tarefa";
                    readonly tl: "todo\ntask list\nkumpletuhin task\nburahin task";
                    readonly vi: "việc cần làm\nviec can lam\ndanh sách tác vụ\nhoàn thành tác vụ";
                    readonly "zh-CN": "待办\n任务列表\n完成任务\n删除任务\n活动任务";
                };
            };
        };
        readonly wallet: {
            readonly strong: {
                readonly base: "wallet\nbalance\ntransfer\nsign transaction\naccount address\nportfolio";
                readonly locales: {
                    readonly es: "billetera\nsaldo\ntransferir\nfirmar transaccion\ndireccion";
                    readonly ko: "지갑\n잔액\n전송\n거래 서명\n주소\n포트폴리오";
                    readonly pt: "carteira\nsaldo\ntransferir\nassinar transacao\nendereco";
                    readonly tl: "wallet\nbalance\ntransfer\nsign transaction\naddress";
                    readonly vi: "ví\nvi\nsố dư\nso du\nchuyển\nchuyen\nký giao dịch";
                    readonly "zh-CN": "钱包\n余额\n转账\n签名交易\n地址\n投资组合";
                };
            };
        };
        readonly web: {
            readonly strong: {
                readonly base: "web\ninternet\ncurrent information\nsearch web\nopen url\nlatest\nprice\nworth\nhow much\nweather\nforecast\ntemperature\nexchange rate";
                readonly locales: {
                    readonly es: "web\ninternet\ninformacion actual\nbuscar web\nabrir url\nultimo";
                    readonly ko: "웹\n인터넷\n최신 정보\n웹 검색\nurl 열기\n최신";
                    readonly pt: "web\ninternet\ninformacao atual\nbuscar na web\nabrir url";
                    readonly tl: "web\ninternet\nkasalukuyang impormasyon\nsearch web\nopen url";
                    readonly vi: "web\ninternet\nthông tin hiện tại\nthong tin hien tai\ntìm web";
                    readonly "zh-CN": "网络\n互联网\n最新信息\n网页搜索\n打开网址";
                };
            };
        };
        readonly world: {
            readonly strong: {
                readonly base: "world\nserver\nroom\nchannel\nparticipants\nmembership";
                readonly locales: {
                    readonly es: "mundo\nservidor\nsala\ncanal\nparticipantes\nmiembros";
                    readonly ko: "월드\n서버\n방\n채널\n참가자\n멤버십";
                    readonly pt: "mundo\nservidor\nsala\ncanal\nparticipantes\nmembros";
                    readonly tl: "world\nserver\nroom\nchannel\nparticipants\nmembership";
                    readonly vi: "thế giới\nthe gioi\nmáy chủ\nmay chu\nphòng\nkenh";
                    readonly "zh-CN": "世界\n服务器\n房间\n频道\n参与者\n成员";
                };
            };
        };
        readonly gmail: {
            readonly strong: {
                readonly base: "email\nemails\ne-mail\ngmail\ninbox\nmailbox\ncompose\ndraft\ndrafts\nunread\nstarred\nmail\nmessage\nmessages\nrespond to\nreply to\ncheck my email\ncheck email\nnew mail\nshoot me an email";
                readonly locales: {
                    readonly "zh-CN": "邮件\n电子邮件\n邮箱\n收件箱\n消息";
                    readonly ko: "이메일\n메일\n지메일\n받은편지함\n메시지\n메세지";
                    readonly es: "correo\ncorreos\ncorreo electronico\ncorreo electrónico\nbandeja de entrada\nmensaje\nmensajes";
                    readonly pt: "correio\ncorreios\ncorreio eletronico\ncorreio eletrônico\ncaixa de entrada\nmensagem\nmensagens";
                    readonly vi: "thư điện tử\nthu dien tu\nhộp thư\nhop thu\ntin nhắn";
                    readonly tl: "koreo\nliham\nmensahe";
                };
            };
            readonly weak: {
                readonly base: "send\nreply\nrespond\nsender\nsubject\nattach\nattachment\ncc\nbcc\nfrom\nforward\nimportant";
                readonly locales: {
                    readonly "zh-CN": "发送\n回复\n发件人\n主题\n附件\n抄送\n转发\n重要";
                    readonly ko: "보내기\n답장\n보낸사람\n제목\n첨부\n참조\n전달\n중요";
                    readonly es: "enviar\nresponder\nremitente\nasunto\nadjunto\nadjuntar\nreenviar\nimportante";
                    readonly pt: "enviar\nresponder\nremetente\nassunto\nanexo\nanexar\nencaminhar\nimportante";
                    readonly vi: "gửi\ngui\ntrả lời\ntra loi\nngười gửi\nnguoi gui\nchủ đề\nchu de\nđính kèm\ndinh kem\nchuyển tiếp\nchuyen tiep";
                    readonly tl: "ipadala\nsagot\nnagpadala\npaksa\nkalakip\nipasa\nmahalaga";
                };
            };
        };
        readonly calendar: {
            readonly strong: {
                readonly base: "calendar\nevent\nevents\nflight\nflights\nmeeting\nmeetings\nappointment\nappointments\ntrip\ntravel\nitinerary\nagenda\nschedule\nhotel\nhotels";
                readonly locales: {
                    readonly "zh-CN": "日历\n行程\n事件\n活动\n航班\n会议\n约会\n旅行\n差旅\n酒店\n议程\n安排";
                    readonly ko: "캘린더\n일정\n이벤트\n항공편\n비행기\n미팅\n회의\n약속\n여행\n일정표\n호텔";
                    readonly es: "calendario\nevento\neventos\nvuelo\nvuelos\nreunion\nreunión\nreuniones\ncita\ncitas\nviaje\nitinerario\nagenda\nhorario\nhotel\nhoteles";
                    readonly pt: "calendario\nevento\neventos\nvoo\nvoos\nreuniao\nreunião\nreunioes\nreuniões\ncompromisso\ncompromissos\nviagem\nitinerario\nitinerário\nagenda\nhorario\nhorário\nhotel\nhoteis\nhotéis";
                    readonly vi: "lịch\nsự kiện\ncuộc họp\nchuyến bay\ndu lịch\nhành trình\nlịch trình\nkhách sạn";
                    readonly tl: "kalendaryo\nkaganapan\nlipad\npulong\nappointment\nbiyahe\nitinerary\niskedyul\nhotel";
                };
            };
            readonly weak: {
                readonly base: "time\nawake\nsleep\nearlier\nlater\nbook\nbooking\nbooked\ncheck\nfree\nbusy\nweek\nyesterday\ntoday\ntomorrow\ntonight\nmonth\nyear";
                readonly locales: {
                    readonly "zh-CN": "时间\n早点\n晚点\n预订\n查看\n空闲\n忙\n周\n昨天\n今天\n明天\n今晚\n月\n年";
                    readonly ko: "시간\n일찍\n늦게\n예약\n확인\n한가해\n바빠\n주\n어제\n오늘\n내일\n오늘밤\n달\n년";
                    readonly es: "hora\ntemprano\ntarde\nreservar\nreserva\nlibre\nocupado\nsemana\nayer\nhoy\nmanana\nmañana\nnoche\nmes\nano\naño";
                    readonly pt: "hora\ncedo\ntarde\nreservar\nreserva\nlivre\nocupado\nsemana\nontem\nhoje\namanha\namanhã\nnoite\nmes\nmês\nano";
                    readonly vi: "giờ\nsớm\nmuộn\nđặt\nrảnh\nbận\ntuần\nhôm qua\nhôm nay\nngày mai\ntối nay\ntháng\nnăm";
                    readonly tl: "oras\nmaaga\nmamaya\nreserba\nlibre\nabala\nlinggo\nkahapon\nngayon\nbukas\ngabi\nbuwan\ntaon";
                };
            };
        };
        readonly web_search: {
            readonly strong: {
                readonly base: "search\ngoogle\nlook up\nlook it up\nweb search\nsearch the web\nsearch online\nsearch for\nfind out\nbrowse for";
                readonly locales: {
                    readonly "zh-CN": "搜索\n查一下\n查一查\n上网查\n网页搜索\n谷歌\ngoogle\n百度";
                    readonly ko: "검색\n찾아봐\n찾아봐줘\n웹 검색\n구글\ngoogle";
                    readonly es: "buscar\nbusca\ngooglea\ngooglear\nbusca en la web\nbusca en internet\ninvestiga";
                    readonly pt: "buscar\npesquisa\npesquise\ngoogle\nprocura na web\nprocura online";
                    readonly vi: "tìm\ntìm kiếm\ntra cứu\ntra cuu\ngoogle\ntìm trên web";
                    readonly tl: "hanapin\nmaghanap\ni-google\ngoogle\nhanap sa web";
                };
            };
            readonly weak: {
                readonly base: "what is\nwho is\nwhen did\nlatest\nrecent\nnews\ncurrent\ntoday\nhow much\nprice of\nwhere is\nfind\nresearch\ncheck";
                readonly locales: {
                    readonly "zh-CN": "最新\n最近\n新闻\n当前\n今天\n价格\n研究\n查";
                    readonly ko: "최신\n최근\n뉴스\n현재\n오늘\n가격\n조사\n확인";
                    readonly es: "ultimo\núltima\nreciente\nnoticias\nactual\nhoy\nprecio\ninvestigar\nrevisar";
                    readonly pt: "ultimo\núltimo\nrecente\nnoticias\nnotícias\natual\nhoje\npreço\npreco\npesquisar\nconferir";
                    readonly vi: "mới nhất\ngần đây\ntin tức\nhiện tại\nhôm nay\ngiá\nnghiên cứu\nkiểm tra";
                    readonly tl: "pinakabago\nkamakailan\nbalita\nkasalukuyan\nngayon\npresyo\nresearch\ncheck";
                };
            };
        };
        readonly send_message: {
            readonly strong: {
                readonly base: "send message\nsend a message\ndm\ndirect message\nnotify\nalert\ntell them\nmessage them\nreach out\npost to\npost in";
                readonly locales: {
                    readonly "zh-CN": "发消息\n发送消息\n私信\n通知\n提醒";
                    readonly ko: "메시지 보내\n메세지 보내\n쪽지\n디엠\ndm\n알려줘\n전달해";
                    readonly es: "enviar mensaje\nmanda mensaje\nmensaje directo\ndm\nnotifica\navisa";
                    readonly pt: "enviar mensagem\nmanda mensagem\nmensagem direta\ndm\nnotifica\navisa";
                    readonly vi: "gửi tin nhắn\ngui tin nhan\nnhắn tin\ndm\nthông báo\nnhắc";
                    readonly tl: "magpadala ng mensahe\npadalhan ng mensahe\ndm\ndirektang mensahe\nabisuhan";
                };
            };
            readonly weak: {
                readonly base: "send\nmessage\ntell\nnotify\nalert\nadmin\nowner\nurgent\nescalate\nchannel\nroom";
                readonly locales: {
                    readonly "zh-CN": "发送\n消息\n通知\n提醒\n管理员\nowner\n紧急\n频道\n房间";
                    readonly ko: "보내\n메시지\n알림\n관리자\nowner\n긴급\n채널\n방";
                    readonly es: "enviar\nmensaje\navisar\nnotificar\nalerta\nadmin\nowner\nurgente\ncanal\nsala";
                    readonly pt: "enviar\nmensagem\navisar\nnotificar\nalerta\nadmin\nowner\nurgente\ncanal\nsala";
                    readonly vi: "gửi\ntin nhắn\nthông báo\nkhẩn cấp\nkênh\nphòng";
                    readonly tl: "padala\nmensahe\nabiso\nalerto\nadmin\nowner\nurgent\nchannel\nroom";
                };
            };
        };
        readonly send_admin_message: {
            readonly strong: {
                readonly base: "message admin\nnotify owner\nalert admin\ntell admin\ntell owner\nescalate";
                readonly locales: {
                    readonly "zh-CN": "通知管理员\n告诉管理员\n通知 owner\n升级处理";
                    readonly ko: "관리자에게 알려\n관리자한테 말해\nowner에게 알려\n에스컬레이션";
                    readonly es: "avisar al admin\navisar al owner\ndecirle al admin\nescalar";
                    readonly pt: "avisar o admin\navisar o owner\nfalar com o admin\nescalar";
                    readonly vi: "báo admin\nbao admin\nbáo owner\nleo thang";
                    readonly tl: "sabihan ang admin\nabisuhan ang owner\ni-escalate";
                };
            };
            readonly weak: {
                readonly base: "admin\nowner\nnotify\nalert\nurgent\nescalate\nimportant";
                readonly locales: {
                    readonly "zh-CN": "管理员\nowner\n通知\n提醒\n紧急\n升级\n重要";
                    readonly ko: "관리자\nowner\n알림\n긴급\n중요\n에스컬레이션";
                    readonly es: "admin\nowner\navisar\nalerta\nurgente\nescalar\nimportante";
                    readonly pt: "admin\nowner\navisar\nalerta\nurgente\nescalar\nimportante";
                    readonly vi: "admin\nowner\nbáo\nkhẩn cấp\nquan trọng";
                    readonly tl: "admin\nowner\nabiso\nurgent\nimportante\nescalate";
                };
            };
        };
        readonly search_conversations: {
            readonly strong: {
                readonly base: "search conversations\nsearch chats\nsearch messages\nfind messages\nfind conversation";
                readonly locales: {
                    readonly "zh-CN": "搜索对话\n搜索聊天\n搜索消息\n查找消息";
                    readonly ko: "대화 검색\n채팅 검색\n메시지 검색\n메시지 찾기";
                    readonly es: "buscar conversaciones\nbuscar chats\nbuscar mensajes\nencontrar mensajes";
                    readonly pt: "buscar conversas\nbuscar chats\nbuscar mensagens\nencontrar mensagens";
                    readonly vi: "tìm cuộc trò chuyện\ntìm tin nhắn\ntra cứu cuộc trò chuyện";
                    readonly tl: "hanapin ang usapan\nhanapin ang chat\nhanapin ang mensahe";
                };
            };
            readonly weak: {
                readonly base: "search\nfind\nrecall\nremember\nsaid\nmentioned\ntalked about\ndiscussed\nearlier\npreviously\nconversation";
                readonly locales: {
                    readonly "zh-CN": "搜索\n查找\n记得\n提到\n聊过\n之前\n对话";
                    readonly ko: "검색\n찾기\n기억\n말했\n언급\n이전\n대화";
                    readonly es: "buscar\nencontrar\nrecordar\ndijiste\nmencionaste\nantes\nconversación\nconversacion";
                    readonly pt: "buscar\nencontrar\nlembrar\nfalou\nmencionou\nantes\nconversa";
                    readonly vi: "tìm\nnhớ\nnói\nnhắc\ntrước đó\ncuộc trò chuyện";
                    readonly tl: "hanap\ntandaan\nsinabi\nnabanggit\ndati\nusapan";
                };
            };
        };
        readonly read_channel: {
            readonly strong: {
                readonly base: "read channel\nread chat\nread messages\nchannel history\nchat history\nchat log\nmessage history\nscroll back\nread room";
                readonly locales: {
                    readonly "zh-CN": "读取频道\n查看聊天\n查看消息记录\n频道历史\n聊天记录";
                    readonly ko: "채널 읽기\n채팅 읽기\n메시지 기록\n채널 기록\n채팅 기록";
                    readonly es: "leer canal\nleer chat\nhistorial del canal\nhistorial del chat\nregistro del chat";
                    readonly pt: "ler canal\nler chat\nhistórico do canal\nhistórico do chat\nregistro do chat";
                    readonly vi: "đọc kênh\nđọc chat\nlịch sử kênh\nlịch sử chat";
                    readonly tl: "basahin ang channel\nbasahin ang chat\nhistory ng channel\nhistory ng chat";
                };
            };
            readonly weak: {
                readonly base: "channel\nchat\nhistory\nmessages\nconversation\nread\nroom\nlog\nrecent\nearlier";
                readonly locales: {
                    readonly "zh-CN": "频道\n聊天\n历史\n消息\n对话\n查看\n房间\n最近\n之前";
                    readonly ko: "채널\n채팅\n기록\n메시지\n대화\n읽기\n방\n최근\n이전";
                    readonly es: "canal\nchat\nhistorial\nmensajes\nconversación\nconversacion\nleer\nsala\nreciente\nantes";
                    readonly pt: "canal\nchat\nhistórico\nhistorico\nmensagens\nconversa\nler\nsala\nrecente\nantes";
                    readonly vi: "kênh\nchat\nlịch sử\ntin nhắn\ncuộc trò chuyện\nđọc\nphòng\ngần đây\ntrước đó";
                    readonly tl: "channel\nchat\nhistory\nmensahe\nusapan\nbasahin\nroom\nrecent\nearlier";
                };
            };
        };
        readonly read_messages: {
            readonly strong: {
                readonly base: "read messages with\nconversation with\nmessages with\nchat with\ndm history with\nmessage history with\nshow messages with\ncheck messages with";
                readonly locales: {
                    readonly "zh-CN": "查看与某人的消息\n与某人的对话\n查看私信记录";
                    readonly ko: "누군가와의 메시지 보기\n누군가와의 대화\ndm 기록 보기";
                    readonly es: "leer mensajes con\nconversación con\nconversacion con\nmensajes con\nchat con";
                    readonly pt: "ler mensagens com\nconversa com\nmensagens com\nchat com";
                    readonly vi: "đọc tin nhắn với\ncuộc trò chuyện với\ntin nhắn với";
                    readonly tl: "basahin ang mga mensahe kasama si\nusapan kasama si\nmga mensahe kasama si";
                };
            };
            readonly weak: {
                readonly base: "messages with\nconversation\ndm\ndirect message\nperson\ncontact\nchat with\nhistory with";
                readonly locales: {
                    readonly "zh-CN": "消息\n对话\n私信\n联系人";
                    readonly ko: "메시지\n대화\ndm\n연락처";
                    readonly es: "mensajes\nconversación\nconversacion\ndm\ncontacto";
                    readonly pt: "mensagens\nconversa\ndm\ncontato";
                    readonly vi: "tin nhắn\ncuộc trò chuyện\ndm\nliên hệ";
                    readonly tl: "mensahe\nusapan\ndm\ncontact";
                };
            };
        };
        readonly stream_control: {
            readonly strong: {
                readonly base: "go live\ngo offline\nstart stream\nstop stream\nstart streaming\nstop streaming\nbegin stream\nend stream";
                readonly locales: {
                    readonly "zh-CN": "开播\n下播\n开始直播\n停止直播";
                    readonly ko: "방송 시작\n방송 종료\n라이브 시작\n라이브 종료";
                    readonly es: "salir en vivo\nterminar stream\niniciar stream\ndetener stream";
                    readonly pt: "entrar ao vivo\nencerrar stream\niniciar stream\nparar stream";
                    readonly vi: "lên sóng\nket thuc stream\nkết thúc stream\nbắt đầu stream\nbat dau stream";
                    readonly tl: "mag live\ntapusin ang stream\nsimulan ang stream\nihinto ang stream";
                };
            };
            readonly weak: {
                readonly base: "live\nstream\nstreaming\nbroadcast\ntwitch\nyoutube\noffline\nonline";
                readonly locales: {
                    readonly "zh-CN": "直播\n开播\n下播\n在线\n离线\ntwitch\nyoutube";
                    readonly ko: "라이브\n스트림\n스트리밍\n방송\n트위치\n유튜브\n오프라인\n온라인";
                    readonly es: "vivo\nstream\nstreaming\ntransmisión\ntransmision\ntwitch\nyoutube\noffline\nonline";
                    readonly pt: "ao vivo\nstream\nstreaming\ntransmissão\ntransmissao\ntwitch\nyoutube\noffline\nonline";
                    readonly vi: "stream\nphát sóng\nphat song\ntrực tiếp\ntwitch\nyoutube\noffline\nonline";
                    readonly tl: "live\nstream\nstreaming\nbroadcast\ntwitch\nyoutube\noffline\nonline";
                };
            };
        };
        readonly search_entity: {
            readonly strong: {
                readonly base: "search entity\nfind person\nlookup user\nsearch contacts\nsearch rolodex\nwho is\ncontact details\nview person\nget contact";
                readonly locales: {
                    readonly "zh-CN": "查找联系人\n查人\n搜索联系人\n谁是\n查看资料";
                    readonly ko: "사람 찾기\n연락처 검색\n사용자 조회\n누구야\n프로필 보기";
                    readonly es: "buscar persona\nencontrar persona\nbuscar contactos\nquien es\nquién es\nver perfil";
                    readonly pt: "buscar pessoa\nencontrar pessoa\nbuscar contatos\nquem é\nquem e\nver perfil";
                    readonly vi: "tìm người\ntìm liên hệ\ntra người dùng\nai là\nxem hồ sơ";
                    readonly tl: "hanapin ang tao\nhanapin ang contact\nsino si\ntingnan ang profile";
                };
            };
            readonly weak: {
                readonly base: "person\ncontact\nentity\nuser\nlookup\nwho\nprofile\nidentity\nrolodex\ndetails";
                readonly locales: {
                    readonly "zh-CN": "联系人\n用户\n谁\n档案\n身份\n详情";
                    readonly ko: "사람\n연락처\n사용자\n누구\n프로필\n신원\n정보";
                    readonly es: "persona\ncontacto\nusuario\nquien\nquién\nperfil\nidentidad\ndetalles";
                    readonly pt: "pessoa\ncontato\nusuário\nusuario\nquem\nperfil\nidentidade\ndetalhes";
                    readonly vi: "người\nliên hệ\nngười dùng\nai\nhồ sơ\ndanh tính\nchi tiết";
                    readonly tl: "tao\ncontact\nuser\nsino\nprofile\nidentity\ndetails";
                };
            };
        };
        readonly link_entity: {
            readonly strong: {
                readonly base: "merge contact\nmerge contacts\nlink contact\nlink contacts\nlink identities\nsame person\nsame human\ncombine contacts\nthese are the same\nduplicate contact\ndedupe contact";
                readonly locales: {
                    readonly "zh-CN": "合并联系人\n关联联系人\n同一个人\n重复联系人";
                    readonly ko: "연락처 병합\n연락처 연결\n같은 사람\n중복 연락처";
                    readonly es: "fusionar contacto\nvincular contacto\nmisma persona\ncontacto duplicado\ncombinar contactos";
                    readonly pt: "mesclar contato\nvincular contato\nmesma pessoa\ncontato duplicado\ncombinar contatos";
                    readonly vi: "gộp liên hệ\nliên kết liên hệ\ncùng một người\nliên hệ trùng lặp";
                    readonly tl: "pagsamahin contact\ni-link ang contact\nparehong tao\nduplicate contact";
                };
            };
        };
        readonly lifeops: {
            readonly strong: {
                readonly base: "todo\nto-do\nto do\ntask\nhabit\nroutine\nreminder\nalarm\ngoal\ntrack\nstreak\nlifeops\nlife ops\nworkout\nexercise\nmeditation\nchecklist\nself-care\nwellness\naccountability";
                readonly locales: {
                    readonly "zh-CN": "待办\n代办事项\n待办事项\n任务\n习惯\n日程\n提醒\n闹钟\n目标\n打卡\n签到\n追踪\n锻炼\n健身\n冥想\n自律\n早起";
                    readonly ko: "할일\n할 일\n과제\n습관\n루틴\n알림\n알람\n목표\n추적\n스트릭\n운동\n명상\n투두\n체크리스트\n스케줄\n리마인더\n자기관리";
                    readonly es: "tarea\ntareas\nhabito\nhábito\nrutina\nrecordatorio\nalarma\nmeta\nmetas\nobjetivo\nseguimiento\nrastrear\npendiente\npendientes\nejercicio\nentrenamiento\nmeditación\nmeditacion\nracha\nlista de tareas\nquehacer\nquehaceres";
                    readonly pt: "tarefa\ntarefas\nhabito\nhábito\nrotina\nlembrete\nalarme\nmeta\nmetas\nobjetivo\nacompanhamento\nrastrear\nexercício\nexercicio\ntreino\nmeditação\nmeditacao\nsequência\nsequencia\nlista de tarefas\nafazer\nafazeres\npendência\npendencia";
                    readonly vi: "việc cần làm\nviec can lam\nnhiệm vụ\nnhiem vu\nthói quen\nthoi quen\nnhắc nhở\nnhac nho\nchuông báo\nchuong bao\nmục tiêu\nmuc tieu\ntheo dõi\ntheo doi\ntập thể dục\ntap the duc\nthiền\nthien";
                    readonly tl: "gawain\ngawi\nrutina\npaalala\nalarma\nlayunin\nsubaybay\nehersisyo\nmeditasyon\nlistahan\ntsek\nworkout\ngoal\nreminder\ntask";
                };
            };
            readonly weak: {
                readonly base: "done\nfinished\ncompleted\nskip\nsnooze\nlater\npostpone\ndefer\nmark\ncheck off\ndelete\nremove\ncancel\nupdate\nchange\nedit\nmodify\noverview\nsummary\nstatus\nprogress\nactive\nwhat do i have\nwhat's left";
                readonly locales: {
                    readonly "zh-CN": "完成\n做完了\n跳过\n推迟\n稍后\n延迟\n标记\n删除\n移除\n取消\n更新\n修改\n编辑\n概览\n摘要\n状态\n进度\n活跃";
                    readonly ko: "완료\n끝났어\n건너뛰기\n나중에\n미루기\n연기\n표시\n삭제\n제거\n취소\n수정\n변경\n편집\n개요\n요약\n상태\n진행\n활성";
                    readonly es: "hecho\nterminado\ncompletado\nomitir\nsaltar\nposponer\naplazar\ndespues\ndespués\nmarcar\neliminar\nquitar\ncancelar\nactualizar\ncambiar\neditar\nmodificar\nresumen\nestado\nprogreso\nactivo";
                    readonly pt: "feito\nterminado\nconcluido\nconcluído\npular\nadiar\ndepois\nmarcar\nexcluir\nremover\ncancelar\natualizar\nalterar\neditar\nmodificar\nresumo\nestado\nprogresso\nativo";
                    readonly vi: "xong\nhoàn thành\nbỏ qua\nđể sau\nhoãn\nđánh dấu\nxóa\nhủy\ncập nhật\nthay đổi\nsửa\ntổng quan\ntóm tắt\ntrạng thái\ntiến độ";
                    readonly tl: "tapos\nnatapos\nlaktawan\nmamaya\nipagpaliban\nmarkahan\ntanggalin\nalisin\nkanselahin\nbaguhin\ni-edit\nbuod\nestado\nprogreso\naktibo";
                };
            };
        };
        readonly lifeops_complete: {
            readonly strong: {
                readonly base: "done\nfinished\ncompleted\ndid it\ndid that\ndid my\ndid the\nmark done\nmark complete\nmark as done\nchecked off\nticked off\ncrossed off\njust finished\njust completed\njust did\ni already\ni've done\ni have done\nall done\ngot it done\ntook care of it\nknocked it out\ncrushed it\nnailed it\nhandled it\naccomplished\nyep done";
                readonly locales: {
                    readonly "zh-CN": "完成了\n做完了\n已完成\n搞定了\n搞定\n弄好了\n做好了\n打卡\n已做\nOK了\n完事了\n好了\n办完了\n整完了";
                    readonly ko: "했어\n했어요\n완료\n끝났어\n끝냈어\n다했어\n다 했어\n마쳤어\n체크\n끝\n했습니다\n완료했어\n완료했습니다\n해냈어\n클리어\n했지";
                    readonly es: "hecho\nlisto\nterminé\ntermine\nterminado\ncompleté\ncomplete\ncompletado\nya lo hice\nya hice\nmarcar hecho\nmarcar completo\nya\nya está\nya esta\nlo hice\nlo terminé\nlo termine\nacabé\nacabe\ncumplido\ndale";
                    readonly pt: "feito\npronto\nterminei\nterminado\ncompletei\nconcluí\nconclui\nconcluído\nconcluido\njá fiz\nja fiz\nmarcar feito\nmarcar concluído\ntá feito\nta feito\nfiz\nacabei\nbeleza\ntá pronto\nta pronto\nresolvido\nfinalizado";
                    readonly vi: "xong rồi\nxong roi\nđã xong\nda xong\nhoàn thành rồi\nhoan thanh roi\nđã làm\nda lam\nđánh dấu xong\ndanh dau xong\nxong\nlàm rồi\nlam roi\nok rồi\nok roi\nxử lý xong\nxu ly xong";
                    readonly tl: "tapos na\nnatapos na\nginawa ko na\nnatapos ko\nmarkahang tapos\nayos na\nokay na\ndone na\ntapos ko na\ngoods na";
                };
            };
        };
        readonly lifeops_skip: {
            readonly strong: {
                readonly base: "skip\npass on\nnot today\nskip today\nskip this\nnah\npass\nnope\nnot doing it\nnot gonna\ngonna skip\ncan't today\nnot this time\nhard pass\nno thanks";
                readonly locales: {
                    readonly "zh-CN": "跳过\n今天不做\n今天跳过\n算了\n不了\n不想做\n懒得做\n免了\n不做了\n放弃";
                    readonly ko: "건너뛰기\n오늘 안 해\n오늘은 패스\n패스\n스킵\n안 할래\n됐어\n안 해\n귀찮아\n넘어가";
                    readonly es: "omitir\nsaltar\nhoy no\npaso\npasar\nnah\nno quiero\ndejalo\ndéjalo\npaso de eso\nnel\nque va";
                    readonly pt: "pular\nhoje não\nhoje nao\npassar\ndeixa pra lá\ndeixa pra la\nnão quero\nnao quero\nnah\nnem\nto fora\npróximo\nproximo";
                    readonly vi: "bỏ qua\nbo qua\nhôm nay không\nhom nay khong\nthôi\nthoi\nkhỏi\nkhoi\nkhông làm\nkhong lam\nbỏ đi\nbo di";
                    readonly tl: "laktawan\nhindi ngayon\npasa\nskip\nayaw ko\nwag na\ndi ko gagawin";
                };
            };
        };
        readonly lifeops_snooze: {
            readonly strong: {
                readonly base: "snooze\nremind me later\nremind me again\npostpone\ndefer\npush back\npush it back\npush that back\nput off\nput it off\nput that off\nin a bit\nhold off\nnot right now\nmaybe later\nnot yet\ncome back later\nask me again\ngive me a minute";
                readonly locales: {
                    readonly "zh-CN": "推迟\n稍后\n晚点再说\n等下提醒\n延后\n延迟\n一会儿再说\n先不急\n别急\n缓缓\n等等\n明天再说\n过一会儿";
                    readonly ko: "나중에\n미루기\n다시 알려줘\n나중에 알려줘\n연기\n미루다\n잠깐\n조금 뒤에\n이따가\n좀 있다가\n잠시만";
                    readonly es: "posponer\naplazar\nmás tarde\nmas tarde\ndespués\ndespues\nrecuérdame después\nrecuerdame despues\nahora no\nahorita no\nahorita\nen un rato\nluego\nal rato\nun momento";
                    readonly pt: "adiar\nmais tarde\ndepois\nlembrar depois\npostergar\nagora não\nagora nao\ndaqui a pouco\njá já\nja ja\nperaí\nperai\ncalma\nespera";
                    readonly vi: "để sau\nde sau\nhoãn\nhoan\nnhắc lại sau\nnhac lai sau\nchờ chút\ncho chut\nchưa\nchua\ntừ từ\ntu tu\nlát nữa\nlat nua\ntí nữa\nti nua";
                    readonly tl: "mamaya\nipagpaliban\nipaalala mamaya\nmamaya na lang\nsandali lang\nsaglit\ndi muna\nhindi pa\nmaya-maya\nlater";
                };
            };
        };
        readonly lifeops_delete: {
            readonly strong: {
                readonly base: "delete\nremove\ncancel\nget rid of\ndrop\nstop tracking\nstop the\nstop my\nditch\nscrap\nnuke it\nkill it\ntrash\ntoss\nforget about\nforget it\nnever mind\nno longer need\ndon't need this\ndon't want this";
                readonly locales: {
                    readonly "zh-CN": "删除\n移除\n取消\n不要了\n停止追踪\n停止跟踪\n去掉\n扔掉\n不做了\n不需要了\n干掉";
                    readonly ko: "삭제\n제거\n취소\n없애줘\n추적 중지\n그만 추적\n지워줘\n버려\n필요 없어\n그만\n빼줘\n캔슬";
                    readonly es: "eliminar\nquitar\nborrar\ncancelar\ndejar de rastrear\ndejar de seguir\nborra\nolvídate\nolvidate\nno necesito\nya no quiero\nsácalo\nsacalo\ntíralo\ntiralo";
                    readonly pt: "excluir\ndeletar\nremover\ncancelar\nparar de rastrear\nparar de acompanhar\napagar\napaga\njoga fora\ntira\nnão preciso\nnao preciso\nnão quero mais\nnao quero mais\nesquece";
                    readonly vi: "xóa\nxoa\nhủy\nhuy\nbỏ\nbo\nngừng theo dõi\nngung theo doi\ngỡ\ngo\nbỏ đi\nbo di\nkhông cần nữa\nkhong can nua\nquên đi\nquen di";
                    readonly tl: "tanggalin\nalisin\nkanselahin\nitigil ang pagsubaybay\ndelete\nitapon\ndi ko na kailangan\nkalimutan na\nwag na";
                };
            };
        };
        readonly lifeops_update: {
            readonly strong: {
                readonly base: "update\nchange\nedit\nmodify\nadjust\nrename\nreschedule\ntweak\nfix\nswitch\nmove\nset to\nswap\nrevise";
                readonly locales: {
                    readonly "zh-CN": "更新\n修改\n编辑\n调整\n重命名\n改时间\n重新安排\n改\n换\n改成\n换成\n微调";
                    readonly ko: "수정\n변경\n편집\n조정\n이름 바꾸기\n일정 변경\n바꿔줘\n고쳐줘\n바꿔\n고쳐\n옮기기\n업데이트";
                    readonly es: "actualizar\ncambiar\neditar\nmodificar\najustar\nrenombrar\nreprogramar\narreglar\narregla\nmover\ncámbialo\ncambialo\ncorregir\nponle";
                    readonly pt: "atualizar\nalterar\neditar\nmodificar\najustar\nrenomear\nreagendar\narrumar\narruma\nmudar\nmuda\ntrocar\ntroca\nmexer\ncorrigir";
                    readonly vi: "cập nhật\ncap nhat\nthay đổi\nthay doi\nsửa\nsua\nđiều chỉnh\ndieu chinh\nđổi tên\ndoi ten\nđổi lịch\ndoi lich\nchỉnh\nchinh\nđổi\ndoi\ndời";
                    readonly tl: "baguhin\ni-edit\ni-adjust\npalitan ang pangalan\npalitan ang iskedyul\nupdate\nchange\nayusin\nilipat";
                };
            };
        };
        readonly lifeops_reminder_pref: {
            readonly strong: {
                readonly base: "stop reminding me\ndon't remind me\npause reminders\nresume reminders\nmore reminders\nless reminders\nfewer reminders\nnormal reminders\nmute reminders\nhigh priority only\nonly high priority\nbe more persistent\nmore persistent\nremind me less\nremind me more\nremind less\nremind more\nstart reminding me again\nturn reminders back on\nstop nagging\nquit bugging me\nenough reminders\ntoo many reminders\nchill with the reminders\nbug me more\nnag me about\nkeep on me about\nstay on top of me";
                readonly locales: {
                    readonly "zh-CN": "停止提醒\n别提醒了\n暂停提醒\n恢复提醒\n多提醒\n少提醒\n静音提醒\n仅高优先\n别烦我\n别催了\n多催催\n盯着我";
                    readonly ko: "알림 중지\n알림 그만\n알림 일시 중지\n알림 재개\n알림 더\n알림 줄여\n알림 음소거\n높은 우선순위만\n좀 그만\n자꾸 알려줘\n계속 알려줘\n잔소리 그만";
                    readonly es: "dejar de recordarme\nno me recuerdes\npausar recordatorios\nreanudar recordatorios\nmás recordatorios\nmas recordatorios\nmenos recordatorios\nrecordatorios normales\nsilenciar recordatorios\nsolo prioridad alta\ndeja de molestar\nno me molestes\nya basta de recordatorios\ninsísteme\ninsisteme";
                    readonly pt: "parar de lembrar\nnão me lembre\nnao me lembre\npausar lembretes\nretomar lembretes\nmais lembretes\nmenos lembretes\nlembretes normais\nsilenciar lembretes\napenas alta prioridade\npara de encher\nchega de lembrete\nme cobra mais\ninsiste mais";
                    readonly vi: "ngừng nhắc\nngung nhac\nđừng nhắc\ndung nhac\ntạm dừng nhắc\ntam dung nhac\ntiếp tục nhắc\ntiep tuc nhac\nnhắc nhiều hơn\nnhac nhieu hon\nnhắc ít hơn\nnhac it hon\ntắt nhắc\ntat nhac\nđủ rồi\ndu roi";
                    readonly tl: "itigil ang paalala\nhuwag na akong paalalahanan\ni-pause ang paalala\nituloy ang paalala\ndagdagan ang paalala\nbawasan ang paalala\ntama na\nstop na\ntigilan mo na";
                };
            };
        };
        readonly lifeops_overview: {
            readonly strong: {
                readonly base: "overview\nsummary\nwhat's active\nwhat is active\nstatus\nwhat do i have\nshow me everything\nwhat's left\nwhat is left\nstill left\nwhat do i still need\nanything else to do\nneed to get done\nneed to finish\nget done today\nanything else\nstill need to do\nwhat's on my plate\nwhat am i juggling\nwhere do things stand\ngive me the rundown\ncatch me up\nwhat's pending\nwhat's outstanding\nshow my tasks\nmy list\nmy tasks\nhow many tasks\nlist everything";
                readonly locales: {
                    readonly "zh-CN": "概览\n总结\n摘要\n状态\n还有什么\n剩余任务\n活跃任务\n我还要做什么\n都有啥\n看一下\n我的任务\n还剩什么\n有什么要做的";
                    readonly ko: "개요\n요약\n상태\n뭐 남았어\n남은 거\n활성 항목\n아직 할 거\n뭐 해야 돼\n뭐 해야 해\n할 일 목록\n얼마나 남았어\n보여줘";
                    readonly es: "resumen\nestado\nque me queda\nqué me queda\nque tengo\nqué tengo\nmostrar todo\ntareas activas\nqué hay pendiente\nque hay pendiente\nmis tareas\nmi lista\nqué falta\nque falta\nen qué ando\nen que ando";
                    readonly pt: "resumo\nestado\no que falta\no que tenho\nmostrar tudo\ntarefas ativas\no que tem pendente\nminhas tarefas\nminha lista\nquanto falta\ncadê minhas coisas\ncade minhas coisas";
                    readonly vi: "tổng quan\ntong quan\ntóm tắt\ntom tat\ntrạng thái\ntrang thai\ncòn gì\ncon gi\ncòn gì nữa\ncon gi nua\nviệc đang làm\nviec dang lam\ndanh sách\ndanh sach\ncho xem\ncó gì\nco gi";
                    readonly tl: "buod\nestado\nano pa ang natitira\nipakita lahat\nmga aktibong gawain\nano ang mga gawain ko\nlista ko\nanong meron\nshow";
                };
            };
        };
        readonly lifeops_cadence: {
            readonly strong: {
                readonly base: "every day\neveryday\ndaily\nweekly\nmonthly\nweekdays\nweekends\neach day\neach morning\neach night\neach week\neach month\nevery week\nevery month\nevery morning\nevery afternoon\nevery evening\nevery night\ntwice a day\nper day\nper week\nthroughout the day\nwith lunch\nwith breakfast\nwith dinner\ntimes a day\ntimes per day\ntimes a week\nonce a day\nonce a week\nbefore bed\nafter work\nwhen i wake up\nfirst thing in the morning\nat night\nin the morning\non mondays\non tuesdays\non wednesdays\non thursdays\non fridays\non saturdays\non sundays";
                readonly locales: {
                    readonly "zh-CN": "每天\n每日\n每周\n每月\n工作日\n周末\n每个早上\n每个下午\n每个晚上\n一天两次\n每天一次\n起床后\n睡前\n下班后\n上班前\n隔天\n每隔一天\n一周三次";
                    readonly ko: "매일\n매주\n매월\n평일\n주말\n매일 아침\n매일 저녁\n하루에 두 번\n하루에 한 번\n일어나면\n자기 전에\n퇴근 후\n출근 전\n격일\n주 3회\n월수금\n일주일에 한 번";
                    readonly es: "cada día\ncada dia\ndiario\ndiariamente\nsemanal\nsemanalmente\nmensual\nmensualmente\nentre semana\nfin de semana\nfines de semana\ncada mañana\ncada tarde\ncada noche\ndos veces al día\ndos veces al dia\npor día\npor dia\nantes de dormir\nal despertar\ndespués del trabajo\ndespues del trabajo\nlunes a viernes\ntodos los días\ntodos los dias\ncada rato";
                    readonly pt: "todo dia\ntodos os dias\ndiário\ndiario\ndiariamente\nsemanal\nsemanalmente\nmensal\nmensalmente\ndia de semana\nfim de semana\ntoda manhã\ntoda manha\ntoda tarde\ntoda noite\nduas vezes ao dia\npor dia\nantes de dormir\nao acordar\ndepois do trabalho\nsegunda a sexta\ndia sim dia não\ndia sim dia nao";
                    readonly vi: "mỗi ngày\nmoi ngay\nhàng ngày\nhang ngay\nhàng tuần\nhang tuan\nhàng tháng\nhang thang\nngày trong tuần\ncuối tuần\ncuoi tuan\nmỗi sáng\nmoi sang\nmỗi chiều\nmoi chieu\nmỗi tối\nmoi toi\nhai lần mỗi ngày\ntrước khi ngủ\ntruoc khi ngu\nkhi thức dậy\nkhi thuc day\nsau giờ làm\nsau gio lam\ncách ngày\ncach ngay";
                    readonly tl: "araw-araw\nlingguhan\nbuwanan\nweekdays\nweekends\ntuwing umaga\ntuwing hapon\ntuwing gabi\ndalawang beses sa isang araw\nbago matulog\npagkagising\npagkatapos ng trabaho\neveryday\ndaily";
                };
            };
        };
        readonly lifeops_goal: {
            readonly strong: {
                readonly base: "goal\ngoals\naspiration\nlife goal\nachieve\naim\ntarget\nambition\nmilestone\nobjective\ndream\nbucket list\nresolution\ni want to\ni wanna\nworking toward\nworking towards\nstrive\nvision\npurpose\nintention";
                readonly locales: {
                    readonly "zh-CN": "目标\n志向\n梦想\n愿望\n里程碑\n想要\n追求\n心愿\n计划\n努力\n愿景";
                    readonly ko: "목표\n꿈\n포부\n야망\n이정표\n하고 싶다\n되고 싶다\n비전\n계획\n다짐\n버킷리스트";
                    readonly es: "meta\nmetas\nobjetivo\nobjetivos\naspiración\naspiracion\nlograr\nsueño\nambición\nambicion\nquiero\npropósito\nproposito\nresolución\nresolucion\nplan";
                    readonly pt: "meta\nmetas\nobjetivo\nobjetivos\naspiração\naspiracao\nalcançar\nalcancar\nsonho\nambição\nambicao\nquero\npropósito\nproposito\nresolução\nresolucao\nplano";
                    readonly vi: "mục tiêu\nmuc tieu\nước mơ\nuoc mo\nhoài bão\nhoai bao\nkhát vọng\nkhat vong\nmuốn\nmuon\nquyết tâm\nquyet tam\nkế hoạch\nke hoach";
                    readonly tl: "layunin\npangarap\nambisyon\nmithiin\ngusto ko\nplano\nresolusyon\ngoal\nbucket list";
                };
            };
        };
        readonly lifeops_escalation: {
            readonly strong: {
                readonly base: "escalate\nescalation\nreminder plan\nset up sms\nset up text\nset up voice\nnotify if\ntext me if\ncall me if\nsms if\ntext if i ignore\ntext if i miss\ncall if i ignore\ncall if i miss\ntext me if i ignore\ntext me if i miss\ncall me if i ignore\ncall me if i miss\nnag me\nbug me\nkeep bugging me\nblow up my phone\nping me\nif i don't respond\nif i don't do it";
                readonly locales: {
                    readonly "zh-CN": "升级\n升级提醒\n设置短信\n设置语音\n如果忽略就发短信\n如果忽略就打电话\n催我\n盯紧\n如果我不做\n如果我不回复";
                    readonly ko: "에스컬레이션\n알림 계획\n문자 설정\n음성 설정\n무시하면 문자\n무시하면 전화\n계속 알려줘\n안 하면 문자해\n잔소리해줘";
                    readonly es: "escalar\nescalación\nescalacion\nplan de recordatorio\nconfigurar sms\nconfigurar texto\nconfigurar voz\nnotificar si\nenviar texto si ignoro\nllamar si ignoro\ninsísteme\ninsisteme\nsi no respondo\nsi no lo hago";
                    readonly pt: "escalar\nescalação\nescalacao\nplano de lembrete\nconfigurar sms\nconfigurar texto\nconfigurar voz\nnotificar se\nenviar mensagem se ignorar\nligar se ignorar\nme cobre\nse eu não fizer\nse eu nao fizer";
                    readonly vi: "leo thang\nkế hoạch nhắc nhở\nke hoach nhac nho\nthiết lập sms\nthiet lap sms\nnhắn tin nếu bỏ lỡ\nnhan tin neu bo lo\ngọi nếu bỏ lỡ\ngoi neu bo lo";
                    readonly tl: "i-escalate\nplano ng paalala\ni-setup ang sms\ni-text kung hindi pinansin\ntawagan kung hindi pinansin\npag hindi ko ginawa\nkulitin mo ako\ntext mo ako";
                };
            };
        };
        readonly lifeops_phone: {
            readonly strong: {
                readonly base: "phone\ntext me\ncall me\nsms\nmy number\nvoice call\nmy phone number\nphone number\ntxt me\nring me\nmy cell\nmobile\nmy mobile\nwhatsapp me\nwhatsapp";
                readonly locales: {
                    readonly "zh-CN": "电话\n给我发短信\n打给我\n短信\n我的号码\n我的电话号码\n手机\n手机号\n微信";
                    readonly ko: "전화\n문자 보내줘\n전화해줘\n내 번호\n내 전화번호\n핸드폰\n휴대폰\n폰\n카톡\n카카오톡";
                    readonly es: "teléfono\ntelefono\nenvíame un mensaje\nmandame un mensaje\nllámame\nllamame\nsms\nmi número\nmi numero\ncelular\ncel\nmi cel\nmóvil\nmovil\nwhatsapp";
                    readonly pt: "telefone\nme mande mensagem\nme ligue\nsms\nmeu número\nmeu numero\ncelular\ncel\nmeu cel\nwhatsapp\nzap\nme zapa";
                    readonly vi: "điện thoại\ndien thoai\nnhắn tin cho tôi\nnhan tin cho toi\ngọi cho tôi\ngoi cho toi\nsố của tôi\nso cua toi\nsố điện thoại\nso dien thoai\ndi động\ndi dong\nzalo";
                    readonly tl: "telepono\ni-text ako\ntawagan ako\nsms\nnumero ko\ncellphone\ncp\nnumber ko\nviber";
                };
            };
        };
        readonly lifeops_review: {
            readonly strong: {
                readonly base: "review\nhow am i doing\nhow's it going\nhow'd i do\nprogress\ncheck on\ncheck goal\ncheck my goal\nprogress report\nam i on track\nam i keeping up\nwhere am i at\nrecap\nstreak check\ngoal check\nhabit check";
                readonly locales: {
                    readonly "zh-CN": "回顾\n进展如何\n检查进度\n查看目标\n我做得怎么样\n看看进度\n怎么样了\n表现如何\n坚持得怎样";
                    readonly ko: "리뷰\n어떻게 하고 있어\n진행 상황\n목표 확인\n잘 하고 있어\n얼마나 했어\n성과\n습관 체크\n스트릭 확인";
                    readonly es: "revisar\ncómo voy\ncomo voy\nprogreso\nrevisar meta\nrevisar objetivo\ncómo me fue\ncomo me fue\nestoy en buen camino\nmi racha\ncómo llevo\ncomo llevo";
                    readonly pt: "revisar\ncomo estou indo\nprogresso\nverificar meta\nverificar objetivo\ncomo fui\nestou no caminho certo\nminha sequência\nminha sequencia\ncomo tá indo\ncomo ta indo";
                    readonly vi: "xem lại\nxem lai\ntiến triển thế nào\ntien trien the nao\ntiến độ\ntien do\nkiểm tra mục tiêu\nkiem tra muc tieu\nkết quả\nket qua\nđánh giá\ndanh gia";
                    readonly tl: "suriin\nkumusta ang progreso\ntingnan ang layunin\nkamusta\nreport";
                };
            };
        };
        readonly affirmative: {
            readonly strong: {
                readonly base: "yes\nyeah\nyep\nyup\nok\nokay\nsure\nconfirm\nconfirmed\ngo ahead\ndo it\nplease do\nsounds good\ncorrect\nexactly\nperfect\nthat works\nlooks good\ngo for it\nlgtm\nabsolutely\naffirmative\napproved\nlets go\nlet's go\nsave it\ncreate it";
                readonly locales: {
                    readonly "zh-CN": "是的\n好的\n确认\n可以\n没问题\n行\n对\n好\n确定\n同意\n当然\n就这样\n保存\n创建";
                    readonly ko: "네\n예\n좋아\n좋아요\n확인\n맞아\n괜찮아\n알겠어\n동의\n물론\n그래\n응\n저장\n만들어";
                    readonly es: "sí\nsi\nclaro\nvale\nbien\nconfirmar\nde acuerdo\nperfecto\nadelante\ncorrecto\nexacto\nhazlo\npor favor\nlisto\nguardar\ncrear";
                    readonly pt: "sim\nclaro\nok\nbeleza\nconfirmar\nde acordo\nperfeito\npode\ncorreto\nexato\nvai em frente\ncom certeza\nsalvar\ncriar";
                    readonly vi: "vâng\nrồi\nđược\nđồng ý\nđúng rồi\nok\nchắc chắn\nxác nhận\ntốt\nhay\nđúng\nlưu\ntạo";
                    readonly tl: "oo\nsige\ntama\nsigurado\nok\nayos na\nkumpirmahin\nsabi mo\nayan\ni-save\ngawin";
                };
            };
        };
        readonly negative: {
            readonly strong: {
                readonly base: "no\nnope\nnah\ndon't\ndo not\nwait\nhold on\ncancel\nnevermind\nnever mind\nforget it\nskip it\nstop\nnot now\nnot yet";
                readonly locales: {
                    readonly "zh-CN": "不\n不要\n不是\n取消\n等一下\n算了\n别\n停\n不用\n暂时不";
                    readonly ko: "아니요\n아니\n안돼\n취소\n잠깐\n됐어\n하지마\n멈춰\n아직\n나중에";
                    readonly es: "no\nnada\ncancelar\nespera\nolvídalo\nolvidalo\npara\ndetente\ntodavía no\naún no\naun no";
                    readonly pt: "não\nnao\nnada\ncancelar\nespera\nesqueça\nesqueca\npare\nainda não\nainda nao";
                    readonly vi: "không\nđừng\nhủy\nchờ\nthôi\ndừng\nchưa\nbỏ đi";
                    readonly tl: "hindi\nhuwag\nkanselahin\nteka\nkalimutan mo na\nhinto\nwag";
                };
            };
        };
        readonly draft_edit: {
            readonly strong: {
                readonly base: "how about\nwhat about\ninstead\nactually\nmake it\nchange it\nedit it\nupdate it\nrename it\nswitch it\nswap it\nrather\nkeep it\nbut change\nbut make";
                readonly locales: {
                    readonly "zh-CN": "改成\n换成\n改为\n换个\n怎么样\n还是\n改一下\n更新\n其实\n但是改";
                    readonly ko: "바꿔\n변경\n대신\n어떨까\n고쳐\n수정\n업데이트\n사실\n그런데";
                    readonly es: "cambiarlo\nmejor\nqué tal\nque tal\nen vez de\neditar\nactualizar\nrenombrar\nen realidad\npero cambia";
                    readonly pt: "mudar\nmelhor\nque tal\nem vez de\neditar\natualizar\nrenomear\nna verdade\nmas muda";
                    readonly vi: "đổi thành\nthay đổi\nsửa\ncập nhật\nthế nào\nthực ra\nnhưng đổi";
                    readonly tl: "palitan\nbaguhin\nimbes\ni-edit\ni-update\nsa halip\npero palitan";
                };
            };
        };
        readonly temporal_next: {
            readonly strong: {
                readonly base: "next\nupcoming\nsoon\nabout to\ncoming up\nafter this";
                readonly locales: {
                    readonly "zh-CN": "下一个\n即将\n马上\n接下来\n快到了";
                    readonly ko: "다음\n곧\n다가오는\n이제\n곧 있을";
                    readonly es: "próximo\nproximo\nsiguiente\npronto\na punto de";
                    readonly pt: "próximo\nproximo\nseguinte\nlogo\nem breve";
                    readonly vi: "tiếp theo\nsắp tới\nsớm\nsắp";
                    readonly tl: "susunod\nmalapit na\nmamaya";
                };
            };
        };
        readonly temporal_followup: {
            readonly strong: {
                readonly base: "yesterday\ntoday\ntomorrow\ntonight\nlater\nearlier\nthis week\nnext week\nthe week after\nweek after next\nthis weekend\nnext weekend\nweekend\nthis month\nnext month\nthis year\nnext year\nlast year\nmonday\ntuesday\nwednesday\nthursday\nfriday\nsaturday\nsunday\nfind it\nlook it up\ncheck again\ntry to find\ntry again\nretry\nagain";
                readonly locales: {
                    readonly "zh-CN": "昨天\n今天\n明天\n今晚\n稍后\n更早\n这周\n下周\n这个月\n下个月\n今年\n明年\n去年\n周一\n周二\n周三\n周四\n周五\n周六\n周日\n星期一\n星期二\n星期三\n星期四\n星期五\n星期六\n星期天\n再试\n查找\n再查\n再看看";
                    readonly ko: "어제\n오늘\n내일\n오늘밤\n나중에\n이번주\n다음주\n이번달\n다음달\n올해\n내년\n작년\n월요일\n화요일\n수요일\n목요일\n금요일\n토요일\n일요일\n다시\n찾아\n다시 시도\n다시 확인";
                    readonly es: "ayer\nhoy\nmañana\nesta noche\nluego\nmás tarde\nmas tarde\nesta semana\npróxima semana\nproxima semana\neste mes\npróximo mes\nproximo mes\neste año\neste ano\nlunes\nmartes\nmiércoles\nmiercoles\njueves\nviernes\nsábado\nsabado\ndomingo\nreintentar\nbuscar\notra vez\nde nuevo";
                    readonly pt: "ontem\nhoje\namanhã\namanha\nesta noite\nmais tarde\nesta semana\npróxima semana\nproxima semana\neste mês\neste mes\npróximo mês\nproximo mes\neste ano\nsegunda\nterça\nterca\nquarta\nquinta\nsexta\nsábado\nsabado\ndomingo\ntentar novamente\nprocurar\nde novo\noutra vez";
                    readonly vi: "hôm qua\nhôm nay\nngày mai\ntối nay\nsau\nsớm hơn\ntuần này\ntuần sau\ntháng này\ntháng sau\nnăm nay\nnăm sau\nnăm ngoái\nthứ hai\nthứ ba\nthứ tư\nthứ năm\nthứ sáu\nthứ bảy\nchủ nhật\nthử lại\ntìm\nlại";
                    readonly tl: "kahapon\nngayon\nbukas\nmamaya\nmamayang gabi\nngayong linggo\nsusunod na linggo\nngayong buwan\nsusunod na buwan\nngayong taon\nlunes\nmartes\nmiyerkules\nhuwebes\nbiyernes\nsabado\nlinggo\nsubukan muli\nhanapin\nulit\nmuli";
                };
            };
        };
    };
    readonly provider: {
        readonly recentConversations: {
            readonly relevance: {
                readonly base: "recent\nconversation\nsaid\ntold\nmentioned\nearlier\nbefore\nchat\nmessage";
                readonly locales: {
                    readonly "zh-CN": "最近\n对话\n说过\n提到\n之前\n聊天\n消息";
                    readonly ko: "최근\n대화\n말했\n언급\n이전\n채팅\n메시지";
                    readonly es: "reciente\nconversación\nconversacion\ndijo\nmencionó\nmenciono\nantes\nchat\nmensaje";
                    readonly pt: "recente\nconversa\ndisse\nmencionou\nantes\nchat\nmensagem";
                    readonly vi: "gần đây\ngan day\ncuộc trò chuyện\nnói\nnhắc\ntrước đó\nchat\ntin nhắn";
                    readonly tl: "recent\nusapan\nsinabi\nnabanggit\ndati\nchat\nmensahe";
                };
            };
        };
        readonly relevantConversations: {
            readonly relevance: {
                readonly base: "search\nfind\nremember\nwho said\nconversation about\ndiscussed\ntalked about\nmentioned";
                readonly locales: {
                    readonly "zh-CN": "搜索\n查找\n记得\n谁说过\n提到\n聊过";
                    readonly ko: "검색\n찾기\n기억\n누가 말했어\n언급\n이야기했던";
                    readonly es: "buscar\nencontrar\nrecordar\nquién dijo\nquien dijo\nhablaron de\nmencionó\nmenciono";
                    readonly pt: "buscar\nencontrar\nlembrar\nquem disse\nfalaram sobre\nmencionou";
                    readonly vi: "tìm\nnhớ\nai đã nói\nai da noi\nnhắc đến\nđã bàn về\nda ban ve";
                    readonly tl: "hanap\ntandaan\nsino ang nagsabi\npinag-usapan\nnabanggit";
                };
            };
        };
        readonly rolodex: {
            readonly relevance: {
                readonly base: "who\ncontact\nreach\nrolodex\nknow\nrelationship\nperson\npeople\nfriend\nuser";
                readonly locales: {
                    readonly "zh-CN": "谁\n联系人\n联络\n关系\n人\n朋友\n用户";
                    readonly ko: "누구\n연락처\n연락\n관계\n사람\n친구\n사용자";
                    readonly es: "quién\nquien\ncontacto\ncontactar\nrelación\nrelacion\npersona\ngente\namigo\nusuario";
                    readonly pt: "quem\ncontato\ncontatar\nrelação\nrelacao\npessoa\npessoas\namigo\nusuário\nusuario";
                    readonly vi: "ai\nliên hệ\nlien he\nmối quan hệ\nmoi quan he\nngười\nbạn bè\nban be\nngười dùng\nnguoi dung";
                    readonly tl: "sino\ncontact\nkontak\nrelasyon\ntao\nmga tao\nkaibigan\nuser";
                };
            };
        };
        readonly uiWidgets: {
            readonly relevance: {
                readonly base: "plugin\nplugins\ninstall\nsetup\nset up\nconfigure\nconfig\nenable\ndisable\nactivate\nconnect\nintegration\nhelp me\nhow do i\nhow to\nshow me\nform\nforms\nreminder\nreminders\nschedule\nscheduling\ndate\ntime\ndatetime\npicker\npick a date\npick a time\npolymarket\ndiscord\nopenai\nanthropic\ntelegram\ntwitch\nyoutube\ntwitter\napi key\ncredentials\nsecret";
                readonly locales: {
                    readonly "zh-CN": "插件\n安装\n设置\n配置\n启用\n禁用\n激活\n连接\n集成\n帮我\n怎么\n给我看\n表单\napi key\n凭证\n密钥";
                    readonly ko: "플러그인\n설치\n설정\n구성\n활성화\n비활성화\n연결\n통합\n도와줘\n어떻게\n보여줘\n폼\napi key\n자격 증명\n비밀";
                    readonly es: "plugin\nplugins\ninstalar\nconfiguración\nconfiguracion\nconfigurar\nactivar\ndesactivar\nconectar\nintegración\nintegracion\nayúdame\nayudame\ncómo\ncomo\nmuéstrame\nmuestrame\nformulario\napi key\ncredenciales\nsecreto";
                    readonly pt: "plugin\nplugins\ninstalar\nconfiguração\nconfiguracao\nconfigurar\nativar\ndesativar\nconectar\nintegração\nintegracao\nme ajuda\ncomo faço\nmostrar\nformulário\nformulario\napi key\ncredenciais\nsegredo";
                    readonly vi: "plugin\ncài đặt\ncai dat\nthiết lập\nthiet lap\ncấu hình\ncau hinh\nbật\nbat\ntắt\ntat\nkết nối\nket noi\ntích hợp\ntich hop\ngiúp tôi\ngiup toi\nlàm sao\nlam sao\ncho tôi xem\nbiểu mẫu\nbieu mau\napi key\nthông tin xác thực\nthong tin xac thuc\nbí mật\nbi mat";
                    readonly tl: "plugin\nplugins\ni-install\ni-setup\ni-configure\nconfig\npaganahin\npatayin\ni-connect\nintegration\ntulungan mo ako\npaano\nipakita mo\nform\ninterface\napi key\ncredentials\nsecret";
                };
            };
        };
        readonly uiGenerative: {
            readonly relevance: {
                readonly base: "dashboard\ntable\nchart\nmetrics\nui\ninterface\nvisualization\nvisualisation\nvisualize\nvisualise\ngraph\nplot\ndiagram\nanalytics\nkpi\nrender a\nbuild a dashboard";
                readonly locales: {
                    readonly "zh-CN": "仪表盘\n表格\n图表\n指标\n界面";
                    readonly ko: "대시보드\n테이블\n차트\n지표\n인터페이스";
                    readonly es: "panel\ntabla\ngráfico\ngrafico\nmétricas\nmetricas\ninterfaz";
                    readonly pt: "painel\ntabela\ngráfico\ngrafico\nmétricas\nmetricas\ninterface";
                    readonly vi: "dashboard\nbảng\nbang\nbiểu đồ\nbieu do\nchỉ số\nchi so\ngiao diện\ngiao dien";
                    readonly tl: "dashboard\ntable\nchart\nmetrics";
                };
            };
        };
    };
    readonly validate: {
        readonly codingTaskRequest: {
            readonly base: "build an app\nbuild a app\nbuild the app\nbuild me an app\nmake an app\ncreate an app\nwrite an app\nship an app\ndeploy an app\nbuild a website\nbuild a site\nbuild a page\nbuild a dashboard\nbuild a widget\nbuild a component\nbuild a script\nbuild a tool\nbuild an api\nbuild a bot\nbuild a cli\nbuild a plugin\nmake a website\nmake a site\nmake a dashboard\nmake a widget\nmake a component\nmake a script\nmake a tool\nmake an api\nmake a bot\nmake a cli\nmake a plugin\ncreate a website\ncreate a site\ncreate a page\ncreate a dashboard\ncreate a widget\ncreate a component\ncreate a script\ncreate a tool\ncreate an api\ncreate an endpoint\ncreate a bot\ncreate a cli\ncreate a plugin\ncreate a route\ncreate a handler\ncreate a module\ncreate a repo\nwrite a script\nwrite a component\nwrite an api\nwrite a function\nwrite a handler\nwrite a route\nwrite a module\ndeploy a server\ndeploy a site\ndeploy a website\ndeploy a bot\ndeploy a cli\ndeploy an api\nship a feature\nship a component\nspin up a server\nspin up an api\nspin up a bot\nadd an endpoint\nadd a route\nadd a handler\nadd an api\nadd a component\npull request\nmerge conflict\ngit push\ngit pull\ngit clone\ngit rebase\ntypescript error\ndebug the bug\ndebug this bug\ndebug a bug\ndebug the error\ndebug this error\ndebug the code\ndebug this code\nfix the bug\nfix a bug\nfix this bug";
            readonly locales: {
                readonly es: "construir una app\nconstruir una aplicación\nconstruir una aplicacion\ncrear una app\ncrear una aplicación\ncrear una aplicacion\nhacer una app\nhacer una aplicación\nhacer una aplicacion\nhazme una app\nconstruir un sitio\nconstruir un sitio web\nconstruir una página\nconstruir una pagina\nconstruir un panel\nconstruir un componente\nconstruir un script\nconstruir una herramienta\nconstruir una api\nconstruir un bot\nconstruir un cli\ncrear un sitio\ncrear un sitio web\ncrear una página\ncrear una pagina\ncrear un panel\ncrear un componente\ncrear un script\ncrear una herramienta\ncrear una api\ncrear un endpoint\ncrear un bot\ncrear un cli\ncrear un plugin\ncrear una ruta\nescribir un script\nescribir un componente\nescribir una api\nescribir una función\nescribir una funcion\ndesplegar un servidor\ndesplegar un sitio\ndesplegar un bot\ndesplegar una api\npull request\nconflicto de fusión\nconflicto de fusion\nerror de typescript\ndepurar el error\ndepurar este error\narreglar el bug\narreglar un bug\narreglar este bug\narreglar el error";
                readonly pt: "construir um app\nconstruir um aplicativo\nconstruir uma aplicação\nconstruir uma aplicacao\ncriar um app\ncriar um aplicativo\ncriar uma aplicação\ncriar uma aplicacao\nfazer um app\nfazer um aplicativo\nconstruir um site\nconstruir uma página\nconstruir uma pagina\nconstruir um painel\nconstruir um componente\nconstruir um script\nconstruir uma ferramenta\nconstruir uma api\nconstruir um bot\nconstruir um cli\ncriar um site\ncriar uma página\ncriar uma pagina\ncriar um painel\ncriar um componente\ncriar um script\ncriar uma ferramenta\ncriar uma api\ncriar um endpoint\ncriar um bot\ncriar um cli\ncriar um plugin\ncriar uma rota\nescrever um script\nescrever um componente\nescrever uma api\nescrever uma função\nescrever uma funcao\nimplantar um servidor\nimplantar um site\nimplantar um bot\nimplantar uma api\npull request\nconflito de merge\nerro de typescript\ndepurar o erro\ndepurar este erro\ncorrigir o bug\ncorrigir um bug\ncorrigir este bug\nconsertar o bug";
                readonly "zh-CN": "做一个应用\n做个应用\n做一个app\n做个app\n构建一个应用\n构建一个app\n创建一个应用\n创建一个app\n写一个应用\n写一个app\n做一个网站\n构建一个网站\n创建一个网站\n做一个页面\n创建一个页面\n做一个仪表板\n创建一个仪表板\n做一个组件\n创建一个组件\n写一个组件\n做一个脚本\n写一个脚本\n做一个工具\n创建一个工具\n做一个api\n创建一个api\n写一个api\n做一个机器人\n创建一个机器人\n做一个插件\n创建一个插件\n部署服务器\n部署网站\n部署机器人\n部署api\n拉取请求\n合并冲突\ntypescript错误\n调试错误\n修复bug\n修复这个bug\n修复错误";
                readonly ko: "앱 만들어\n앱을 만들어\n앱 만들어줘\n앱을 만들어줘\n앱 빌드\n앱 빌드해\n앱 만들기\n웹사이트 만들어\n웹사이트 만들어줘\n사이트 만들어\n페이지 만들어\n대시보드 만들어\n컴포넌트 만들어\n스크립트 만들어\n스크립트 작성\n도구 만들어\napi 만들어\napi 작성\n엔드포인트 만들어\n봇 만들어\n봇 만들어줘\n플러그인 만들어\n라우트 만들어\n서버 배포\n사이트 배포\n봇 배포\napi 배포\n풀 리퀘스트\n머지 충돌\n타입스크립트 오류\n타입스크립트 에러\n버그 수정\n이 버그 수정\n에러 수정\n버그 디버그\n에러 디버그";
                readonly vi: "xây dựng một ứng dụng\nxay dung mot ung dung\nxây dựng một app\nxay dung mot app\ntạo một ứng dụng\ntao mot ung dung\ntạo một app\ntao mot app\nlàm một ứng dụng\nlam mot ung dung\nlàm một app\nlam mot app\nviết một ứng dụng\nviet mot ung dung\nxây dựng một trang web\nxay dung mot trang web\ntạo một trang web\ntao mot trang web\ntạo một trang\ntao mot trang\ntạo một bảng điều khiển\ntao mot bang dieu khien\ntạo một thành phần\ntao mot thanh phan\nviết một script\nviet mot script\ntạo một script\ntao mot script\ntạo một công cụ\ntao mot cong cu\ntạo một api\ntao mot api\ntạo một endpoint\ntao mot endpoint\ntạo một bot\ntao mot bot\ntạo một plugin\ntao mot plugin\ntriển khai máy chủ\ntrien khai may chu\ntriển khai trang web\ntrien khai trang web\ntriển khai bot\ntrien khai bot\ntriển khai api\ntrien khai api\npull request\nxung đột merge\nxung dot merge\nlỗi typescript\nloi typescript\nsửa lỗi\nsua loi\nsửa bug\nsua bug\ngỡ lỗi\ngo loi";
                readonly tl: "gumawa ng app\ngumawa ng aplikasyon\ngawan mo ako ng app\nlumikha ng app\nlumikha ng aplikasyon\ngumawa ng website\ngumawa ng site\ngumawa ng page\ngumawa ng dashboard\ngumawa ng component\ngumawa ng script\nmagsulat ng script\ngumawa ng tool\ngumawa ng api\ngumawa ng endpoint\ngumawa ng bot\ngumawa ng plugin\ni-deploy ang server\ni-deploy ang site\ni-deploy ang bot\ni-deploy ang api\npull request\nmerge conflict\ntypescript error\nayusin ang bug\nayusin ang error\ni-debug ang bug\ni-debug ang error";
            };
        };
        readonly taskIntent: {
            readonly base: "create task\nadd task\nnew task\nmake task\ncomplete task\nfinish task\ndone with task\nmark task done\ndelete task\nremove task\nupdate task\nedit task\nchange task\nlist tasks\nshow tasks\nmy tasks\nwhat are my tasks\nadd a todo\nadd a to-do\ncreate a to do\ntask list\ncheck off";
            readonly locales: {
                readonly es: "crear tarea\ncrea tarea\nagregar tarea\nagrega tarea\nañadir tarea\nanadir tarea\nnueva tarea\nhacer tarea\ncompletar tarea\nterminar tarea\nmarcar tarea hecha\neliminar tarea\nborrar tarea\nquitar tarea\nactualizar tarea\neditar tarea\ncambiar tarea\nlistar tareas\nmostrar tareas\nmis tareas\ncuáles son mis tareas\ncuales son mis tareas\nagregar un pendiente\nagrega un pendiente\nlista de tareas";
                readonly pt: "criar tarefa\ncria tarefa\nadicionar tarefa\nadiciona tarefa\nnova tarefa\nfazer tarefa\ncompletar tarefa\nconcluir tarefa\nterminar tarefa\nmarcar tarefa feita\nexcluir tarefa\nremover tarefa\napagar tarefa\natualizar tarefa\neditar tarefa\nmudar tarefa\nlistar tarefas\nmostrar tarefas\nminhas tarefas\nquais são minhas tarefas\nquais sao minhas tarefas\nadicionar um afazer\nlista de tarefas";
                readonly "zh-CN": "创建任务\n新建任务\n添加任务\n完成任务\n标记任务完成\n删除任务\n移除任务\n更新任务\n编辑任务\n修改任务\n列出任务\n显示任务\n我的任务\n我有什么任务\n添加待办\n新增待办\n任务列表\n勾选";
                readonly ko: "작업 만들기\n작업 추가\n새 작업\n작업 완료\n작업 끝내\n완료 표시\n작업 삭제\n작업 제거\n작업 업데이트\n작업 수정\n작업 변경\n작업 목록\n작업 보여줘\n내 작업\n내 할 일이 뭐야\n할 일 추가\n투두 추가\n할 일 목록\n체크 표시";
                readonly vi: "tạo tác vụ\ntao tac vu\ntạo nhiệm vụ\ntao nhiem vu\nthêm tác vụ\nthem tac vu\ntác vụ mới\ntac vu moi\nhoàn thành tác vụ\nhoan thanh tac vu\nkết thúc tác vụ\nket thuc tac vu\nđánh dấu hoàn thành\ndanh dau hoan thanh\nxóa tác vụ\nxoa tac vu\ngỡ tác vụ\ngo tac vu\ncập nhật tác vụ\ncap nhat tac vu\nsửa tác vụ\nsua tac vu\nthay đổi tác vụ\nthay doi tac vu\ndanh sách tác vụ\ndanh sach tac vu\nhiển thị tác vụ\nhien thi tac vu\ntác vụ của tôi\ntac vu cua toi\nthêm việc cần làm\nthem viec can lam\ndanh sách việc\ndanh sach viec";
                readonly tl: "gumawa ng task\nmagdagdag ng task\nbagong task\ntapusin ang task\nkumpletuhin ang task\nmarkahan tapos\nburahin ang task\ntanggalin ang task\nalisin ang task\ni-update ang task\ni-edit ang task\nbaguhin ang task\nipakita ang tasks\nilista ang tasks\nmga task ko\nano ang mga task ko\nmagdagdag ng todo\nlistahan ng task\ni-check off";
            };
        };
    };
};
//# sourceMappingURL=validation-keyword-data.d.ts.map
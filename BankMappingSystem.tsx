import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Globe, 
  Building2, 
  Wallet, 
  ArrowRightLeft, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronDown,
  Upload,
  Save,
  FileText,
  PlusCircle,
  Banknote,
  User,
  LogOut,
  Languages,
  Check,
  Search,
  X,
  Paperclip,
  Scissors
} from 'lucide-react';

// --- 类型定义 ---

type Language = 'zh-CN' | 'zh-TW' | 'en-US' | 'ja-JP';

interface Translation {
  title: string;
  region: string;
  accounts: string;
  nodes: string;
  transactions: string;
  addNode: string;
  delete: string;
  save: string;
  manualInput: string;
  upload: string;
  associate: string;
  amount: string;
  date: string;
  description: string;
  status: string;
  coaMapping: string;
  pending: string;
  completed: string;
  actions: string;
  taxIncluded: string;
  taxExcluded: string;
  qualified: string;
  taxCategory: string;
  taxAmount: string;
  split: string;
  attachment: string;
  confirm: string;
  recall: string;
  remark: string;
  remarkPlaceholder: string;
  selectCoa: string;
  searchCoa: string;
  noData: string;
}

const translations: Record<Language, Translation> = {
  'zh-CN': {
    title: '全球银行流水归集系统',
    region: '地区',
    accounts: '银行账户',
    nodes: '科目节点 (Nodes 1-6)',
    transactions: '交易记录',
    addNode: '新增子节点',
    delete: '删除',
    save: '保存',
    manualInput: '手动录入',
    upload: '表格上传',
    associate: '关联节点6',
    amount: '金额',
    date: '日期',
    description: '摘要',
    status: '状态',
    coaMapping: '科目匹配',
    pending: '待处理',
    completed: '已完成',
    actions: '操作',
    taxIncluded: '内税',
    taxExcluded: '外税',
    qualified: '适格',
    taxCategory: '税区分',
    taxAmount: '税额',
    split: '拆分交易',
    attachment: '上传附件',
    confirm: '确认匹配',
    recall: '撤回',
    remark: '备注',
    remarkPlaceholder: '输入备注...',
    selectCoa: '-- 选择科目 (Node 4) --',
    searchCoa: '搜索科目...',
    noData: '暂无交易记录'
  },
  'zh-TW': {
    title: '全球銀行流水歸集系統',
    region: '地區',
    accounts: '銀行賬戶',
    nodes: '科目節點 (Nodes 1-6)',
    transactions: '交易記錄',
    addNode: '新增子節點',
    delete: '刪除',
    save: '保存',
    manualInput: '手動錄入',
    upload: '表格上傳',
    associate: '關聯節點6',
    amount: '金額',
    date: '日期',
    description: '摘要',
    status: '狀態',
    coaMapping: '科目匹配',
    pending: '待處理',
    completed: '已完成',
    actions: '操作',
    taxIncluded: '內稅',
    taxExcluded: '外稅',
    qualified: '適格',
    taxCategory: '稅區分',
    taxAmount: '稅額',
    split: '拆分交易',
    attachment: '上傳附件',
    confirm: '確認匹配',
    recall: '撤回',
    remark: '備註',
    remarkPlaceholder: '輸入備註...',
    selectCoa: '-- 選擇科目 (Node 4) --',
    searchCoa: '搜索科目...',
    noData: '暫無交易記錄'
  },
  'en-US': {
    title: 'Global Bank Statement Mapping System',
    region: 'Region',
    accounts: 'Bank Accounts',
    nodes: 'COA Nodes (1-6)',
    transactions: 'Transactions',
    addNode: 'Add Sub-node',
    delete: 'Delete',
    save: 'Save',
    manualInput: 'Manual Entry',
    upload: 'Upload CSV',
    associate: 'Map to Node 6',
    amount: 'Amount',
    date: 'Date',
    description: 'Desc',
    status: 'Status',
    coaMapping: 'COA Mapping',
    pending: 'Pending',
    completed: 'Completed',
    actions: 'Actions',
    taxIncluded: 'Inc. Tax',
    taxExcluded: 'Exc. Tax',
    qualified: 'Qualified',
    taxCategory: 'Tax Cat.',
    taxAmount: 'Tax',
    split: 'Split',
    attachment: 'Attachment',
    confirm: 'Confirm',
    recall: 'Recall',
    remark: 'Remark',
    remarkPlaceholder: 'Add remark...',
    selectCoa: '-- Select COA (Node 4) --',
    searchCoa: 'Search COA...',
    noData: 'No transactions found'
  },
  'ja-JP': {
    title: 'グローバル銀行明細集約システム',
    region: '地域',
    accounts: '銀行口座',
    nodes: '勘定科目ノード (1-6)',
    transactions: '取引明細',
    addNode: 'ノード追加',
    delete: '削除',
    save: '保存',
    manualInput: '手動入力',
    upload: 'アップロード',
    associate: 'ノード6に関連付け',
    amount: '金額',
    date: '日付',
    description: '摘要',
    status: '状態',
    coaMapping: '勘定科目マッチング',
    pending: '未処理',
    completed: '完了',
    actions: '操作',
    taxIncluded: '内税',
    taxExcluded: '外税',
    qualified: '適格',
    taxCategory: '税区分',
    taxAmount: '税額',
    split: '分割',
    attachment: '添付ファイル',
    confirm: '確認',
    recall: '取り消し',
    remark: '備考',
    remarkPlaceholder: '備考を入力...',
    selectCoa: '-- 科目選択 (Node 4) --',
    searchCoa: '科目を検索...',
    noData: '取引記録がありません'
  }
};

interface Account {
  id: string;
  name: string;
  currency: string;
}

interface Region {
  id: string;
  name: string;
  accounts: Account[];
}

interface COANode {
  id: string;
  name: string;
  level: number;
  children: COANode[];
  isFixed?: boolean;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  accountId: string;
  node4Id?: string; // 关联的节点4 ID
  status: 'pending' | 'completed' | 'rejected'; // 状态
  // --- 日本税务专用字段 ---
  taxType?: '内税' | '外税';
  taxAmount?: number;
  isQualified?: boolean; // 适格
  taxCategory?: string;  // 税区分
}

// --- 初始数据 ---

const INITIAL_REGIONS: Region[] = [
  {
    id: 'jp',
    name: 'JP',
    accounts: [
      { id: 'jp-1', name: '三井住友（法人）', currency: 'JPY' },
      { id: 'jp-2', name: '三井住友銀行　外貨口座', currency: 'USD' },
      { id: 'jp-3', name: '三菱ＵＦＪ', currency: 'JPY' },
      { id: 'jp-4', name: '三井住友CreditCard', currency: 'JPY' },
    ]
  },
  {
    id: 'sg',
    name: 'SG',
    accounts: [
      { id: 'sg-1', name: 'EastWest Bank（USD）', currency: 'USD' },
      { id: 'sg-2', name: 'Citi Bank（SGD）', currency: 'SGD' },
      { id: 'sg-3', name: 'Citi Bank（USD）', currency: 'USD' },
    ]
  },
  {
    id: 'tp',
    name: 'TPE',
    accounts: [
      { id: 'tp-1', name: '1112001 Bank-台銀活存 #62187', currency: 'TWD' },
      { id: 'tp-2', name: '1112002 Bank-富邦活存 #34788', currency: 'TWD' },
      { id: 'tp-3', name: '1112003 Bank-富邦外匯 USD#62845', currency: 'USD' },
    ]
  },
  {
    id: 'usc',
    name: 'US, Cayman',
    accounts: [
      { id: 'usc-1', name: 'HSBC_Checking', currency: 'USD' },
    ]
  }
];

const INITIAL_COA: COANode[] = [
  {
    id: 'bs', name: 'B/S (Balance Sheet)', level: 1, isFixed: true, children: [
      { id: 'assets', name: 'Assets (资产)', level: 2, isFixed: true, children: [
          { id: 'current-assets', name: 'Current Assets (流动资产)', level: 3, isFixed: true, children: [
            { id: 'arn-rp', name: 'Accounts receivable, net - related parties', level: 4, children: [] },
            { id: 'arn-tp', name: 'Accounts receivable, net - third parties', level: 4, children: [] },
            { id: 'cce', name: 'Cash & cash equivalent', level: 4, children: [] },
            { id: 'dfrp', name: 'Due from related parties', level: 4, children: [] },
            { id: 'irp', name: 'Intercompany receivable / payable', level: 4, children: [] },
            { id: 'lrgdn', name: 'Loan receivable - game developer, net', level: 4, children: [] },
            { id: 'oca', name: 'Other current assets', level: 4, children: [] },
            { id: 'pe', name: 'Prepaid expenses', level: 4, children: [] },
            { id: 'rcc', name: 'Restricted cash - current', level: 4, children: [] },
            { id: 'tr', name: 'Trade receivable', level: 4, children: [] },
          ] },
          { id: 'noncurrent-assets', name: 'Noncurrent Assets (非流动资产)', level: 3, isFixed: true, children: [
            { id: 'dic', name: 'Deferred IPO cost', level: 4, children: [] },
            { id: 'dtan', name: 'Deferred tax assets, net', level: 4, children: [] },
            { id: 'ian', name: 'Intangible assets, net', level: 4, children: [] },
            { id: 'iis', name: 'Investment in subsidiaries', level: 4, children: [] },
            { id: 'iftpn', name: 'Investments in films and television programs, net', level: 4, children: [] },
            { id: 'onca', name: 'Other noncurrent assets', level: 4, children: [] },
            { id: 'prn', name: 'Prepaid royalties, net', level: 4, children: [] },
            { id: 'ppe', name: 'Property, plant and equipment, net', level: 4, children: [] },
          ] }
      ]},
      { id: 'liabilities', name: 'Liabilities (负债)', level: 2, isFixed: true, children: [
          { id: 'current-liabilities', name: 'Current Liabilities (流动负债)', level: 3, isFixed: true, children: [
            { id: 'aprp', name: 'Accounts payable - related parties', level: 4, children: [] },
            { id: 'aptp', name: 'Accounts payable - third parties', level: 4, children: [] },
            { id: 'ae', name: 'Accrued expenses', level: 4, children: [] },
            { id: 'dtrp', name: 'Due to related parties', level: 4, children: [] },
            { id: 'llc', name: 'Lease liabilities - current', level: 4, children: [] },
            { id: 'ocl', name: 'Other current liabilities', level: 4, children: [] },
            { id: 'stl', name: 'Short-term loan', level: 4, children: [] },
            { id: 'tp', name: 'Tax payable', level: 4, children: [] },
          ] },
          { id: 'noncurrent-liabilities', name: 'Noncurrent Liabilities (非流动负债)', level: 3, isFixed: true, children: [
            { id: 'dtl', name: 'Deferred tax liabilities', level: 4, children: [] },
            { id: 'llnc', name: 'Lease liabilities - noncurrent', level: 4, children: [] },
            { id: 'ltl', name: 'Long-term loan', level: 4, children: [] },
          ] },
          { id: 'equity', name: 'Equity (股东权益)', level: 3, isFixed: true, children: [
            { id: 'aoci', name: 'Accumulated other comprehensive (loss) income', level: 4, children: [] },
            { id: 'apic', name: 'Additional paid-in capital', level: 4, children: [] },
            { id: 'os', name: 'Ordinary shares', level: 4, children: [] },
            { id: 're', name: 'Retained earnings', level: 4, children: [] },
            { id: 'sr', name: 'Statutory reserve', level: 4, children: [] },
            { id: 'sur', name: 'Subscription receivable', level: 4, children: [] },
          ] }
      ]}
    ]
  }
];

// --- 辅助组件：可搜索的下拉选择框 ---

interface SearchableSelectProps {
  options: { id: string, name: string }[];
  value: string;
  onChange: (id: string) => void;
  placeholder: string;
}

function SearchableSelect({ options, value, onChange, placeholder }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.id === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-[240px]" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="text-[11px] font-bold border-2 border-slate-100 rounded-xl px-3 py-2.5 bg-white flex items-center justify-between cursor-pointer hover:border-blue-200 transition-all"
      >
        <span className={selectedOption ? 'text-slate-900 truncate mr-2' : 'text-slate-400'}>
          {selectedOption ? selectedOption.name.split(' > ').pop() : placeholder}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2">
          <div className="max-h-[280px] overflow-y-auto py-1">
            {options.map(opt => (
              <button
                key={opt.id}
                onClick={() => {
                  onChange(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-slate-50 last:border-0 ${
                  value === opt.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className={`text-[12px] font-black ${value === opt.id ? 'text-blue-600' : 'text-slate-700'}`}>
                  {opt.name.split(' > ').pop()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- 组件主程序 ---

export default function BankMappingSystem() {
  const [lang, setLang] = useState<Language>('zh-CN');
  const [currency, setCurrency] = useState('JPY'); 
  const t = translations[lang];

  const [regions] = useState<Region[]>(INITIAL_REGIONS);
  const [coa, setCoa] = useState<COANode[]>(INITIAL_COA);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'tx-1', date: '2024-01-05', description: 'Office Rent Payment', amount: -500000, currency: 'JPY', accountId: 'jp-1', status: 'pending', taxType: '内税', taxAmount: 0, isQualified: true, taxCategory: '対象外' },
    { id: 'tx-2', date: '2024-01-06', description: 'Client Service Fee', amount: 12000, currency: 'USD', accountId: 'sg-3', status: 'pending' },
    { id: 'tx-3', date: '2024-01-07', description: 'Marketing Consultant Fee', amount: -2500, currency: 'USD', accountId: 'sg-3', status: 'pending' },
    { id: 'tx-4', date: '2024-01-08', description: 'Server Hosting Payment', amount: -850, currency: 'USD', accountId: 'sg-1', status: 'pending' },
  ]);

  const [selectedRegion, setSelectedRegion] = useState<string>(regions[0].id);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(regions[0].accounts[0].id);
  const [activeTab, setActiveTab] = useState<'transactions' | 'coa'>('transactions');
  const [txSubTab, setTxSubTab] = useState<'pending' | 'completed'>('pending');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // --- 拆分交易状态 ---
  const [isSplitDrawerOpen, setIsSplitDrawerOpen] = useState(false);
  const [splittingTx, setSplittingTx] = useState<Transaction | null>(null);
  const [splitRows, setSplitRows] = useState<{ id: string, desc: string, amount: string, node4Id: string }[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [menuView, setMenuView] = useState<'main' | 'currency' | 'language'>('main');
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
        setMenuView('main');
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addNode = (parentId: string, name: string) => {
    const updateNodes = (nodes: COANode[]): COANode[] => {
      return nodes.map(node => {
        if (node.id === parentId) {
          const newNode: COANode = {
            id: `node-${Math.random().toString(36).substr(2, 9)}`,
            name,
            level: node.level + 1,
            children: []
          };
          return { ...node, children: [...node.children, newNode] };
        }
        return { ...node, children: updateNodes(node.children) };
      });
    };
    setCoa(updateNodes(coa));
  };

  const deleteNode = (nodeId: string) => {
    const filterNodes = (nodes: COANode[]): COANode[] => {
      return nodes
        .filter(node => node.id !== nodeId || node.isFixed)
        .map(node => ({ ...node, children: filterNodes(node.children) }));
    };
    setCoa(filterNodes(coa));
  };

  // 获取所有节点4供选择（带完整路径）
  const node4Options = useMemo(() => {
    const options: { id: string, name: string }[] = [];
    const traverse = (nodes: COANode[], path: string = '') => {
      nodes.forEach(node => {
        const currentPath = path ? `${path} > ${node.name}` : node.name;
        if (node.level === 4) {
          options.push({ id: node.id, name: currentPath });
        }
        traverse(node.children, currentPath);
      });
    };
    traverse(coa);
    return options;
  }, [coa]);

  // --- 拆分逻辑函数 ---
  const handleOpenSplit = (tx: Transaction) => {
    setSplittingTx(tx);
    setSplitRows([{ id: '1', desc: tx.description, amount: Math.abs(tx.amount).toString(), node4Id: tx.node4Id || '' }]);
    setIsSplitDrawerOpen(true);
  };

  const addSplitRow = () => {
    setSplitRows([...splitRows, { id: Math.random().toString(), desc: '', amount: '0', node4Id: '' }]);
  };

  const removeSplitRow = (id: string) => {
    setSplitRows(splitRows.filter(r => r.id !== id));
  };

  // 根据当前账户和状态过滤流水
  const filteredTransactions = transactions.filter(tx => 
    tx.accountId === selectedAccountId && 
    (txSubTab === 'pending' ? (tx.status === 'pending' || tx.status === 'rejected') : tx.status === 'completed')
  );

  return (
    <div className="flex h-screen bg-gray-50 text-slate-900 font-sans overflow-hidden">
      {/* 隐藏的文件上传输入框 */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={(e) => {
          if (e.target.files?.[0]) alert(`成功选择文件: ${e.target.files[0].name}`);
        }} 
      />

      {/* 1. 左侧侧边栏 - 紧贴左侧 */}
      <aside className="w-64 bg-slate-900 flex flex-col border-r border-slate-800 shrink-0">
        {/* 系统标题 */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl shrink-0 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <span className="text-white text-xl font-black italic tracking-tighter">F</span>
          </div>
          <h1 className="text-lg font-black text-white tracking-tight uppercase">
            F system
          </h1>
        </div>

        {/* 主导航菜单 */}
        <nav className="flex-1 px-3 space-y-1">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'transactions' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            {t.transactions}
          </button>

          <button
            onClick={() => setActiveTab('coa')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'coa' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            {t.coaMapping}
          </button>
        </nav>

        {/* 个人中心 - 吸底展示 */}
        <div className="p-4 border-t border-slate-800 relative" ref={userMenuRef}>
          {isUserMenuOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-bottom-2 duration-200">
              <div className="py-2">
                {menuView === 'main' && (
                  <div className="space-y-0.5">
                    <button onClick={() => setMenuView('currency')} className="w-full text-left px-4 py-2.5 text-sm flex items-center justify-between text-gray-700 hover:bg-gray-50">
                      <div className="flex items-center gap-3"><Banknote className="w-4 h-4 text-gray-400" /><span>元</span></div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                    <button onClick={() => setMenuView('language')} className="w-full text-left px-4 py-2.5 text-sm flex items-center justify-between text-gray-700 hover:bg-gray-50">
                      <div className="flex items-center gap-3"><Globe className="w-4 h-4 text-gray-400" /><span>语言</span></div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                    <div className="h-px bg-gray-100 my-1 mx-2" />
                    <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"><LogOut className="w-4 h-4" /><span>登出</span></button>
                  </div>
                )}
                {menuView === 'currency' && (
                  <div>
                    <div className="px-4 py-2 border-b flex items-center gap-2"><button onClick={() => setMenuView('main')} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight className="w-4 h-4 rotate-180 text-gray-400" /></button><span className="text-xs font-bold text-gray-400">选择货币</span></div>
                    {[{code:'CNY',l:'元'},{code:'JPY',l:'日币'},{code:'USD',l:'美元'},{code:'TWD',l:'新台币'}].map(c => (
                      <button key={c.code} onClick={() => {setCurrency(c.code); setMenuView('main');}} className={`w-full text-left px-6 py-2 text-sm flex items-center justify-between ${currency === c.code ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}><span>{c.l}</span>{currency === c.code && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}</button>
                    ))}
                  </div>
                )}
                {menuView === 'language' && (
                  <div>
                    <div className="px-4 py-2 border-b flex items-center gap-2"><button onClick={() => setMenuView('main')} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight className="w-4 h-4 rotate-180 text-gray-400" /></button><span className="text-xs font-bold text-gray-400">选择语言</span></div>
                    {(['zh-CN', 'zh-TW', 'en-US', 'ja-JP'] as Language[]).map(l => (
                      <button key={l} onClick={() => {setLang(l); setMenuView('main');}} className={`w-full text-left px-6 py-2 text-sm flex items-center justify-between ${lang === l ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
                        <span>{l==='zh-CN'?'简中-ZH':l==='zh-TW'?'繁中-ZH-TW':l==='en-US'?'英语-EN':'日语-JP'}</span>
                        {lang === l && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <button 
            onClick={() => { setIsUserMenuOpen(!isUserMenuOpen); setMenuView('main'); }}
            className="w-full bg-slate-800 rounded-xl p-3 flex items-center gap-3 hover:bg-slate-700 transition-colors text-left border border-slate-700"
          >
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">yu.bin@ctw.inc</div>
            </div>
          </button>
        </div>
      </aside>

      {/* 2. 主内容区域 */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'transactions' ? (
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* 1. 顶部地区切换 (Region Tabs) */}
            <div className="bg-white px-8 pt-6 pb-2 border-b flex items-center justify-between">
                <div className="flex gap-8">
                  {regions.map(r => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setSelectedRegion(r.id);
                        setSelectedAccountId(r.accounts[0].id); // 切换地区时默认选择第一个账户
                      }}
                      className={`pb-4 text-sm font-black transition-all relative ${
                        selectedRegion === r.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {r.name}
                      {selectedRegion === r.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full shadow-[0_-2px_8px_rgba(37,99,235,0.4)]" />
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all text-xs font-bold shadow-lg shadow-slate-200">
                    <PlusCircle className="w-4 h-4" /> {t.manualInput}
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 border-2 border-slate-100 text-slate-600 rounded-xl hover:bg-gray-50 transition-all text-xs font-bold">
                    <Upload className="w-4 h-4" /> {t.upload}
                  </button>
                </div>
              </div>

              {/* 2. 账户选择 (Account Tabs) */}
              <div className="bg-slate-50/50 px-8 py-4 border-b overflow-x-auto no-scrollbar">
                <div className="flex gap-3">
                  {regions.find(r => r.id === selectedRegion)?.accounts.map(acc => (
                    <button
                      key={acc.id}
                      onClick={() => setSelectedAccountId(acc.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border-2 ${
                        selectedAccountId === acc.id 
                          ? 'bg-white border-blue-500 text-blue-600 shadow-sm' 
                          : 'bg-transparent border-transparent text-slate-400 hover:text-slate-600 hover:bg-white/50'
                      }`}
                    >
                      {acc.name}
                      <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] ${
                        selectedAccountId === acc.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {acc.currency}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. 流水内容区 */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* 待处理/已完成 二级切换 */}
                <div className="px-8 py-3 flex gap-8 border-b bg-white">
                  <button 
                    onClick={() => setTxSubTab('pending')}
                    className={`text-[13px] font-black flex items-center gap-2 transition-all relative py-2 ${
                      txSubTab === 'pending' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {t.pending}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      txSubTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {transactions.filter(t => t.accountId === selectedAccountId && (t.status === 'pending' || t.status === 'rejected')).length}
                    </span>
                    {txSubTab === 'pending' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
                  </button>
                  <button 
                    onClick={() => setTxSubTab('completed')}
                    className={`text-[13px] font-black flex items-center gap-2 transition-all relative py-2 ${
                      txSubTab === 'completed' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {t.completed}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      txSubTab === 'completed' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {transactions.filter(t => t.accountId === selectedAccountId && t.status === 'completed').length}
                    </span>
                    {txSubTab === 'completed' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-6">
                <div className="border border-slate-100 rounded-2xl shadow-sm bg-white overflow-visible">
                  <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="bg-slate-50 sticky top-0 z-20">
                    <tr>
                      <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 rounded-tl-2xl">{t.date}</th>
                      <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">{t.description}</th>
                      <th className={`px-6 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 ${selectedRegion === 'jp' ? 'min-w-[280px]' : 'min-w-[120px]'}`}>
                        {selectedRegion === 'jp' ? '金額・税額' : t.amount}
                      </th>
                      {selectedRegion === 'jp' && (
                        <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">適格・税区分</th>
                      )}
                      <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 w-[280px]">{t.coaMapping}</th>
                      <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 w-[200px]">{t.remark}</th>
                      <th className="px-6 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 rounded-tr-2xl w-[140px]">{t.actions}</th>
                    </tr>
                  </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredTransactions.map(tx => (
                        <tr key={tx.id} className={`hover:bg-blue-50/30 transition-colors group relative hover:z-50 ${tx.status === 'rejected' ? 'bg-red-50/10' : ''}`}>
                            <td className="px-6 py-5 text-sm font-bold text-slate-500">{tx.date}</td>
                            <td className="px-6 py-5">
                              <div className="text-[14px] font-black text-slate-900">{tx.description}</div>
                              <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter flex gap-2">
                                <span>ID: {tx.id}</span>
                                {tx.status === 'rejected' && <span className="text-red-500 font-black">● 已拒绝</span>}
                              </div>
                            </td>
                          <td className={`px-6 py-5 text-right ${selectedRegion === 'jp' ? 'min-w-[280px]' : 'min-w-[120px]'}`}>
                            <div className="flex items-center justify-end gap-2">
                              {/* 税处理标识 (仅日本展示) */}
                              {selectedRegion === 'jp' && (
                                <div className="text-[10px] font-black text-slate-400 border-2 border-slate-100 rounded-lg px-2 py-2 bg-slate-50 h-[38px] flex items-center justify-center min-w-[45px]">
                                  内税
                                </div>
                              )}

                              {/* 主金额 */}
                              <div className="flex flex-col items-end">
                                {selectedRegion === 'jp' && <div className="text-[10px] font-black text-slate-300 uppercase tracking-tighter mb-0.5">金额</div>}
                                <div className={`text-[14px] font-black font-mono px-3 py-1.5 rounded-xl border-2 border-slate-100 bg-white min-w-[100px] text-right ${tx.amount < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                  {(() => {
                                    const total = Math.abs(tx.amount);
                                    let base = total;
                                    if (selectedRegion === 'jp') {
                                      if (tx.taxCategory?.includes('10%')) base = total * 0.9;
                                      if (tx.taxCategory?.includes('8%')) base = total * 0.92;
                                    }
                                    return (tx.amount < 0 ? '-' : '+') + base.toLocaleString();
                                  })()}
                                </div>
                              </div>

                              {/* 税额 (仅日本展示) */}
                              {selectedRegion === 'jp' && (
                                <div className="flex flex-col items-end">
                                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-tighter mb-0.5">税额</div>
                                  <div className="text-[14px] font-black font-mono px-3 py-1.5 rounded-xl border-2 border-slate-100 bg-slate-50 min-w-[80px] text-right text-slate-400">
                                    {(() => {
                                      const total = Math.abs(tx.amount);
                                      let tax = 0;
                                      if (tx.taxCategory?.includes('10%')) tax = total * 0.1;
                                      if (tx.taxCategory?.includes('8%')) tax = total * 0.08;
                                      return tax.toLocaleString();
                                    })()}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="text-[10px] font-black text-slate-300 mt-1 mr-1">{tx.currency}</div>
                          </td>
                          {selectedRegion === 'jp' && (
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <label 
                                  className="flex items-center gap-1.5 cursor-pointer group"
                                  onClick={() => setTransactions(prev => prev.map(t => t.id === tx.id ? { ...t, isQualified: !t.isQualified } : t))}
                                >
                                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${tx.isQualified ? 'bg-blue-600 border-blue-600' : 'border-slate-200 group-hover:border-blue-400'}`}>
                                    {tx.isQualified && <Check className="w-3 h-3 text-white stroke-[4px]" />}
                                  </div>
                                  <span className="text-[11px] font-bold text-slate-600">適格</span>
                                </label>
                                <select 
                                  className="text-[11px] font-bold border-2 border-slate-100 rounded-xl px-2 py-2 bg-white focus:ring-2 focus:ring-blue-100 outline-none h-[38px]"
                                  value={tx.taxCategory || '対象外'}
                                  onChange={(e) => setTransactions(prev => prev.map(t => t.id === tx.id ? { ...t, taxCategory: e.target.value } : t))}
                                >
                                  <option>対象外</option>
                                  <option>10% 标准税</option>
                                  <option>8% 軽減税</option>
                                </select>
                              </div>
                            </td>
                          )}
                            <td className="px-6 py-5">
                              {txSubTab === 'pending' ? (
                                <SearchableSelect 
                                  options={node4Options}
                                  value={tx.node4Id || ''}
                                  onChange={(id) => setTransactions(prev => prev.map(t => t.id === tx.id ? { ...t, node4Id: id } : t))}
                                  placeholder="-- 选择科目 (Node 4) --"
                                />
                              ) : (
                                <span className="text-[12px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg ring-1 ring-blue-100 shadow-sm shadow-blue-50">
                                  {node4Options.find(o => o.id === tx.node4Id)?.name.split(' > ').pop() || '未指定'}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-5">
                              <input 
                                type="text" 
                                placeholder={t.remarkPlaceholder}
                                className="w-full text-xs font-medium bg-slate-50 border-b-2 border-slate-200 hover:border-blue-400 focus:border-blue-500 focus:bg-white outline-none py-2 px-2 transition-all placeholder:text-slate-400 rounded-t-lg"
                                value={(tx as any).remark || ''}
                                onChange={(e) => setTransactions(prev => prev.map(t => t.id === tx.id ? { ...t, remark: e.target.value } : t))}
                              />
                            </td>
                            <td className="px-6 py-5 text-center">
                              <div className="flex justify-center items-center gap-1">
                                {txSubTab === 'pending' ? (
                                  <>
                                    <button 
                                      onClick={() => fileInputRef.current?.click()}
                                      className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all group/btn"
                                      title="上传附件"
                                    >
                                      <Paperclip className="w-4 h-4 group-hover/btn:rotate-12" />
                                    </button>
                                    <button 
                                      onClick={() => handleOpenSplit(tx)}
                                      className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-full transition-all group/btn"
                                      title="拆分交易"
                                    >
                                      <Scissors className="w-4 h-4 group-hover/btn:-rotate-12" />
                                    </button>
                                    <button 
                                      onClick={() => setTransactions(prev => prev.map(t => t.id === tx.id ? { ...t, status: 'completed' } : t))}
                                      className="p-2 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all group/btn"
                                      title="确认匹配"
                                    >
                                      <Check className="w-6 h-6 stroke-[3px] group-hover/btn:scale-110" />
                                    </button>
                                  </>
                                ) : (
                                  <button 
                                    onClick={() => setTransactions(prev => prev.map(t => t.id === tx.id ? { ...t, status: 'pending' } : t))}
                                    className="px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-700 shadow-lg shadow-slate-100 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                                  >
                                    <ArrowRightLeft className="w-3 h-3" /> 撤回
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredTransactions.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-300 bg-white rounded-2xl border-2 border-dashed border-slate-100 mt-4">
                      <Banknote className="w-16 h-16 opacity-10 mb-4" />
                      <p className="text-sm font-black italic">暂无流水记录</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
        ) : (
          <div className="h-full overflow-y-auto p-10 animate-in fade-in duration-500">
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">{t.coaMapping}</h3>
                  <p className="text-slate-400 text-sm font-medium">配置层级归集逻辑，支持 1-6 级节点映射</p>
                </div>
                <div className="text-[11px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full ring-1 ring-blue-100">
                  LEVEL 1-3 FIXED • 4-6 MANAGEABLE
                </div>
              </div>
              
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 p-8">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> 树形结构管理
                </h4>
                <div className="space-y-4">
                  {coa.map(node => (
                    <TreeNode key={node.id} node={node} onAdd={addNode} onDelete={deleteNode} t={t} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. 拆分交易右侧抽屉 */}
      {isSplitDrawerOpen && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] animate-in fade-in duration-300"
            onClick={() => setIsSplitDrawerOpen(false)}
          />
          {/* 抽屉内容 */}
          <div className="fixed top-0 right-0 h-full w-[500px] bg-white shadow-2xl z-[101] flex flex-col animate-in slide-in-from-right duration-500 ease-out border-l">
            <div className="p-6 border-b flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Scissors className="w-5 h-5 text-amber-500" /> 拆分交易记录
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Split Transaction Details</p>
              </div>
              <button 
                onClick={() => setIsSplitDrawerOpen(false)}
                className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 原交易简报 */}
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 ring-4 ring-blue-50/50">
                <div className="text-[10px] font-black text-blue-400 uppercase mb-2 tracking-tighter">Original Transaction</div>
                <div className="flex justify-between items-center text-sm font-black text-blue-900">
                  <span>{splittingTx?.description}</span>
                  <span>{splittingTx?.amount.toLocaleString()} {splittingTx?.currency}</span>
                </div>
              </div>

              {/* 拆分条目列表 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">拆分条目 (Split Items)</h4>
                  <button 
                    onClick={addSplitRow}
                    className="text-[10px] font-black text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 transition-all flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> 添加条目
                  </button>
                </div>

                <div className="space-y-3">
                  {splitRows.map((row, index) => (
                    <div key={row.id} className="p-4 bg-white border-2 border-slate-50 rounded-2xl hover:border-slate-100 transition-all space-y-3 shadow-sm relative group/row">
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="text-[9px] font-black text-slate-300 uppercase block mb-1 ml-1">摘要</label>
                          <input 
                            className="w-full text-xs font-bold border-2 border-slate-100 rounded-xl px-3 py-2 outline-none focus:border-blue-400 transition-all"
                            placeholder="输入交易说明..."
                            value={row.desc}
                            onChange={(e) => {
                              const newRows = [...splitRows];
                              newRows[index].desc = e.target.value;
                              setSplitRows(newRows);
                            }}
                          />
                        </div>
                        <div className="w-[120px]">
                          <label className="text-[9px] font-black text-slate-300 uppercase block mb-1 ml-1">金额</label>
                          <input 
                            className="w-full text-xs font-black border-2 border-slate-100 rounded-xl px-3 py-2 outline-none focus:border-blue-400 transition-all text-right font-mono"
                            type="number"
                            value={row.amount}
                            onChange={(e) => {
                              const newRows = [...splitRows];
                              newRows[index].amount = e.target.value;
                              setSplitRows(newRows);
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-300 uppercase block mb-1 ml-1">科目匹配</label>
                        <SearchableSelect 
                          options={node4Options}
                          value={row.node4Id}
                          onChange={(id) => {
                            const newRows = [...splitRows];
                            newRows[index].node4Id = id;
                            setSplitRows(newRows);
                          }}
                          placeholder="选择归集科目..."
                        />
                      </div>
                      
                      {splitRows.length > 1 && (
                        <button 
                          onClick={() => removeSplitRow(row.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover/row:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 stroke-[4px]" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-slate-400 uppercase">已拆分总计</span>
                <span className="text-lg font-black text-slate-900 font-mono">
                  {splitRows.reduce((acc, row) => acc + Number(row.amount || 0), 0).toLocaleString()} / {Math.abs(splittingTx?.amount || 0).toLocaleString()}
                </span>
              </div>
              <button 
                onClick={() => {
                  alert('拆分成功！');
                  setIsSplitDrawerOpen(false);
                }}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest"
              >
                保存拆分结果
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// --- 递归科目树组件 (保持原有逻辑，略微优化 UI) ---

interface TreeNodeProps {
  node: COANode;
  onAdd: (parentId: string, name: string) => void;
  onDelete: (nodeId: string) => void;
  t: Translation;
  key?: string | number;
}

function TreeNode({ node, onAdd, onDelete, t }: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const canAdd = node.level < 6;
  const canDelete = !node.isFixed;

  return (
    <div className="ml-4 border-l-2 border-slate-50 pl-6 py-1">
      <div className="flex items-center gap-3 group py-2">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1.5 hover:bg-slate-100 rounded-lg transition-all ${node.children.length === 0 ? 'invisible' : ''}`}
        >
          {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
        </button>
        
        <div className={`px-4 py-2.5 rounded-xl flex items-center justify-between flex-1 transition-all ${
          node.level === 1 ? 'bg-slate-900 text-white font-black text-[13px] shadow-lg' :
          node.level === 2 ? 'bg-slate-100 text-slate-700 font-bold text-[12px]' :
          node.level === 6 ? 'bg-blue-600 text-white font-black text-[11px] shadow-md shadow-blue-100' : 'bg-white border border-slate-100 text-slate-600 text-[12px] font-bold shadow-sm'
        }`}>
          <span>{node.name} <span className="opacity-30 text-[9px] ml-2 tracking-tighter">L{node.level}</span></span>
          
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {canAdd && (
              <button onClick={() => setIsAdding(true)} className="p-1 hover:text-blue-400 transition-colors" title={t.addNode}>
                <Plus className="w-4 h-4" />
              </button>
            )}
            {canDelete && (
              <button onClick={() => onDelete(node.id)} className="p-1 hover:text-rose-400 transition-colors" title={t.delete}>
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {isAdding && (
        <div className="ml-10 mt-2 mb-4 flex gap-2">
          <input 
            autoFocus
            className="text-xs font-bold border-2 border-slate-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            placeholder="节点名称..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { onAdd(node.id, newName); setIsAdding(false); setNewName(''); }
              if (e.key === 'Escape') setIsAdding(false);
            }}
          />
          <button 
            onClick={() => { onAdd(node.id, newName); setIsAdding(false); setNewName(''); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black hover:bg-blue-700 transition-colors"
          >
            {t.save}
          </button>
          <button 
            onClick={() => { setIsAdding(false); setNewName(''); }}
            className="bg-slate-100 text-slate-500 px-3 py-2 rounded-xl text-[10px] font-black hover:bg-slate-200 hover:text-slate-700 transition-colors"
            title="取消"
          >
            <X className="w-3.5 h-3.5 stroke-[3px]" />
          </button>
        </div>
      )}

      {isOpen && node.children.length > 0 && (
        <div className="mt-1">
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} onAdd={onAdd} onDelete={onDelete} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

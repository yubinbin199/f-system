import React, { useState, useMemo, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  Globe, Building2, Wallet, ArrowRightLeft, Plus, Trash2, ChevronRight, ChevronDown,
  Upload, Save, FileText, PlusCircle, Banknote, User, LogOut, Languages, Check, Search, X,
  Paperclip, Scissors, Zap, Settings, Pencil, ArrowUpRight, ArrowDownLeft, Filter
} from 'lucide-react';

// --- 类型定义 ---
type Language = 'zh-CN' | 'zh-TW' | 'en-US' | 'ja-JP';
interface Translation {
  title: string; region: string; accounts: string; nodes: string; transactions: string;
  addNode: string; delete: string; save: string; manualInput: string; upload: string;
  associate: string; amount: string; date: string; description: string; status: string;
  coaMapping: string; pending: string; completed: string; actions: string;
  taxIncluded: string; taxExcluded: string; qualified: string; taxCategory: string;
  taxAmount: string; split: string; attachment: string; confirm: string; recall: string;
  remark: string; remarkPlaceholder: string; selectCoa: string; searchCoa: string;
  noData: string; treeTitle: string; rules: string; createRule: string; ruleName: string;
  applyTo: string; moneyIn: string; moneyOut: string; allAccounts: string;
  conditions: string; descContains: string; thenAssign: string; autoConfirm: string;
  autoConfirmHelp: string; accountName: string;
}

const translations: Record<Language, Translation> = {
  'zh-CN': {
    title: 'F system', region: '地区', accounts: '银行账户', nodes: '科目节点', transactions: '交易记录',
    addNode: '新增子节点', delete: '删除', save: '保存', manualInput: '手动录入', upload: '表格上传',
    associate: '关联节点6', amount: '金额', date: '日期', description: '摘要', status: '状态',
    coaMapping: '科目匹配', pending: '待处理', completed: '已完成', actions: '操作',
    taxIncluded: '内税', taxExcluded: '外税', qualified: '适格', taxCategory: '税区分',
    taxAmount: '税额', split: '拆分交易', attachment: '上传附件', confirm: '确认匹配', recall: '撤回',
    remark: '备注', remarkPlaceholder: '输入备注...', selectCoa: '-- 选择科目 --',
    searchCoa: '搜索科目...', noData: '暂无交易记录', rules: '自动规则', createRule: '新建规则',
    ruleName: '规则名称', applyTo: '应用于', moneyIn: '收入', moneyOut: '支出', allAccounts: '所有账户',
    conditions: '匹配条件', descContains: '摘要包含', thenAssign: '分配科目', autoConfirm: '自动确认',
    autoConfirmHelp: '自动完成匹配', treeTitle: 'Chart of Accounts', accountName: '账户名称'
  },
  'ja-JP': {
    title: 'F system', region: '地域', accounts: '銀行口座', nodes: '勘定科目', transactions: '取引明細',
    addNode: '追加', delete: '削除', save: '保存', manualInput: '手動入力', upload: 'アップロード',
    associate: 'ノード6', amount: '金額', date: '日付', description: '摘要', status: 'ステータス',
    coaMapping: '科目一致', pending: '保留中', completed: '完了', actions: '操作',
    taxIncluded: '内税', taxExcluded: '外税', qualified: '適格', taxCategory: '税区分',
    taxAmount: '税額', split: '分割', attachment: '添付', confirm: '承認', recall: '撤回',
    remark: '備考', remarkPlaceholder: '備考...', selectCoa: '-- 選択 --',
    searchCoa: '検索...', noData: '数据なし', rules: '自動ルール', createRule: '新規作成',
    ruleName: 'ルール名', applyTo: '適用', moneyIn: '入金', moneyOut: '出金', allAccounts: '全口座',
    conditions: '条件', descContains: '含む', thenAssign: '割り当て', autoConfirm: '自動',
    autoConfirmHelp: '自動承認', treeTitle: '勘定科目表', accountName: '口座名'
  },
  'zh-TW': {
    title: 'F system', region: '地區', accounts: '銀行賬戶', nodes: '科目節點', transactions: '交易記錄',
    addNode: '新增子節點', delete: '刪除', save: '保存', manualInput: '手動錄入', upload: '表格上傳',
    associate: '關聯節點6', amount: '金額', date: '日期', description: '摘要', status: '狀態',
    coaMapping: '科目匹配', pending: '待處理', completed: '已完成', actions: '操作',
    taxIncluded: '內稅', taxExcluded: '外稅', qualified: '適格', taxCategory: '稅區分',
    taxAmount: '稅額', split: '拆分交易', attachment: '上傳附件', confirm: '確認匹配', recall: '撤回',
    remark: '備註', remarkPlaceholder: '輸入備註...', selectCoa: '-- 選擇科目 --',
    searchCoa: '搜索科目...', noData: '暫無交易記錄', rules: '自動規則', createRule: '新建規則',
    ruleName: '規則名稱', applyTo: '應用於', moneyIn: '收入', moneyOut: '支出', allAccounts: '所有賬戶',
    conditions: '匹配條件', descContains: '摘要包含', thenAssign: '分配科目', autoConfirm: '自動確認',
    autoConfirmHelp: '自動完成匹配', treeTitle: 'Chart of Accounts', accountName: '賬戶名稱'
  },
  'en-US': {
    title: 'F system', region: 'Region', accounts: 'Accounts', nodes: 'COA', transactions: 'Transactions',
    addNode: 'Add Node', delete: 'Delete', save: 'Save', manualInput: 'Manual Entry', upload: 'Upload',
    associate: 'Map Node 6', amount: 'Amount', date: 'Date', description: 'Description', status: 'Status',
    coaMapping: 'Mapping', pending: 'Pending', completed: 'Completed', actions: 'Actions',
    taxIncluded: 'Inc.Tax', taxExcluded: 'Exc.Tax', qualified: 'Qualified', taxCategory: 'Tax Cat.',
    taxAmount: 'Tax', split: 'Split', attachment: 'Attach', confirm: 'Confirm', recall: 'Recall',
    remark: 'Remark', remarkPlaceholder: 'Remark...', selectCoa: '-- Select --',
    searchCoa: 'Search...', noData: 'No Data', rules: 'Rules', createRule: 'New Rule',
    ruleName: 'Rule Name', applyTo: 'Apply to', moneyIn: 'Money In', moneyOut: 'Money Out', allAccounts: 'All',
    conditions: 'Conditions', descContains: 'Contains', thenAssign: 'Assign', autoConfirm: 'Auto',
    autoConfirmHelp: 'Auto Match', treeTitle: 'COA', accountName: 'Account'
  }
};

interface Account { id: string; name: string; currency: string; }
interface Region { id: string; name: string; accounts: Account[]; }
interface Transaction {
  id: string; date: string; description: string; amount: number; currency: string; accountId: string;
  node4Id?: string; status: 'pending' | 'completed' | 'rejected'; taxType?: '内税' | '外税';
  taxAmount?: number; isQualified?: boolean; taxCategory?: string; remark?: string; regionId?: string;
  isGroup?: boolean; childCount?: number;
}
interface COANode { id: string; name: string; level: number; children: COANode[]; isFixed?: boolean; regionIds?: string[]; }
interface Rule { id: string; name: string; regionId: string; accountId: string; direction: 'in' | 'out'; conditionValue: string; assignNode4Id: string; autoConfirm: boolean; }
interface JERow { id: string; accountId: string; debit: string; credit: string; description: string; name: string; }

const INITIAL_REGIONS: Region[] = [
  { id: 'jp', name: 'JP', accounts: [{ id: 'jp-1', name: '三井住友（法人）', currency: 'JPY' }, { id: 'jp-2', name: '三井住友銀行 外貨口座', currency: 'USD' }, { id: 'jp-3', name: '三菱ＵＦＪ', currency: 'JPY' }, { id: 'jp-4', name: '三井住友CreditCard', currency: 'JPY' }] },
  { id: 'sg', name: 'SG', accounts: [{ id: 'sg-1', name: 'EastWest Bank（USD）', currency: 'USD' }, { id: 'sg-2', name: 'Citi Bank（SGD）', currency: 'SGD' }, { id: 'sg-3', name: 'Citi Bank（USD）', currency: 'USD' }] },
  { id: 'us', name: 'US', accounts: [{ id: 'us-1', name: 'HSBC_Checking01 USD', currency: 'USD' }] },
  { id: 'cayman', name: 'Cayman', accounts: [{ id: 'cayman-1', name: 'HSBC_Checking02 USD', currency: 'USD' }] }
];

const INITIAL_COA: COANode[] = [{ id: 'bs', name: 'B/S (Balance Sheet)', level: 1, isFixed: true, children: [{ id: 'assets', name: 'Assets', level: 2, isFixed: true, children: [{ id: 'current-assets', name: 'Current assets', level: 3, isFixed: true, children: [{ id: 'ca-1', name: 'Cash & cash equivalent', level: 4, children: [] }, { id: 'ca-2', name: 'Trade receivable', level: 4, children: [] }] }] }, { id: 'liabilities', name: 'Liabilities', level: 2, isFixed: true, children: [{ id: 'cl-1', name: 'Accounts payable', level: 4, children: [] }] }] }];

function SearchableSelect({ options, value, onChange, placeholder, disabled }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
  const selectedOption = options.find((opt: any) => opt.id === value);
  const handleOpen = (e: React.MouseEvent) => { 
    e.stopPropagation();
    if (disabled) return;
    if (containerRef.current) { 
      const rect = containerRef.current.getBoundingClientRect(); 
      setCoords({ top: rect.bottom + 4, left: rect.left, width: rect.width }); 
      setIsOpen(!isOpen); 
    } 
  };
  return (
    <div className={`relative w-full max-w-[240px] pointer-events-auto ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} ref={containerRef}>
      <div onClick={handleOpen} className="text-[11px] font-bold border-2 border-slate-100 rounded-xl px-3 py-2.5 bg-white flex items-center justify-between hover:border-blue-200 transition-all">
        <span className={selectedOption ? 'text-slate-900 truncate mr-2' : 'text-slate-400'}>{selectedOption ? selectedOption.name.split(' > ').pop() : placeholder}</span>
        {!disabled && <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
      </div>
      {isOpen && ReactDOM.createPortal(<div className="fixed bg-white border border-slate-200 rounded-xl z-[10000] overflow-hidden shadow-2xl" style={{ top: coords.top, left: coords.left, width: coords.width, maxHeight: '300px' }}><div className="overflow-y-auto py-1 max-h-[300px]">{options.map((opt: any) => <button key={opt.id} onClick={(e) => { e.stopPropagation(); onChange(opt.id); setIsOpen(false); }} className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-0 ${value === opt.id ? 'bg-blue-50' : ''}`}><div className={`text-[12px] font-black ${value === opt.id ? 'text-blue-600' : 'text-slate-700'}`}>{opt.name.split(' > ').pop()}</div></button>)}</div></div>, document.body)}
    </div>
  );
}

export default function BankMappingSystem() {
  const [lang, setLang] = useState<Language>('zh-CN');
  const t = translations[lang];
  const [regions] = useState<Region[]>(INITIAL_REGIONS);
  const [coa, setCoa] = useState<COANode[]>(INITIAL_COA);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'tx-jp-1', date: '2024-01-05', description: 'Office Rent Payment', amount: -500000, currency: 'JPY', accountId: 'jp-1', status: 'pending', taxType: '内税', taxAmount: 0, isQualified: true, taxCategory: '対象外', regionId: 'jp' },
    { id: 'tx-jp-3', date: '2024-01-07', description: 'Sales Revenue', amount: 880000, currency: 'JPY', accountId: 'jp-3', status: 'pending', taxType: '内税', taxAmount: 80000, isQualified: true, taxCategory: '10%标准', regionId: 'jp' },
    { id: 'tx-sg-1', date: '2024-01-06', description: 'Service Fee', amount: 12000, currency: 'USD', accountId: 'sg-3', status: 'pending', regionId: 'sg' },
  ]);

  const [selectedRegion, setSelectedRegion] = useState<string>(regions[0].id);
  const [activeTab, setActiveTab] = useState<'transactions' | 'coa'>('transactions');
  const [txSubTab, setTxSubTab] = useState<'pending' | 'completed' | 'je'>('pending');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ startDate: '', endDate: '', accountIds: [] as string[] });
  
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [selectedRuleRegion, setSelectedRuleRegion] = useState<string>('jp');
  const [rules, setRules] = useState<Rule[]>([]);
  const [isRuleEditorOpen, setIsRuleEditorOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Partial<Rule>>({});

  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [manualJELines, setManualJELines] = useState<JERow[]>([]);
  const [jeDate, setJeDate] = useState('');
  const [jeNo, setJeNo] = useState('');

  const [isSplitDrawerOpen, setIsSplitDrawerOpen] = useState(false);
  const [splittingTx, setSplittingTx] = useState<Transaction | null>(null);
  const [splitRows, setSplitRows] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentRegionAccounts = useMemo(() => regions.find(r => r.id === selectedRegion)?.accounts.map(a => a.id) || [], [selectedRegion, regions]);
  const node4Options = useMemo(() => { const opts: any[] = []; const traverse = (n: any, p: string) => { const cp = p ? `${p} > ${n.name}` : n.name; if (n.level === 4) opts.push({ id: n.id, name: cp }); n.children.forEach((c: any) => traverse(c, cp)); }; coa.forEach(n => traverse(n, '')); return opts; }, [coa]);

  const matchesSearch = (tx: Transaction) => { const trm = searchTerm.toLowerCase(); return tx.description.toLowerCase().includes(trm) || tx.id.toLowerCase().includes(trm) || tx.date.includes(trm); };
  
  const filteredTransactions = useMemo(() => transactions.filter(tx => {
    const isSpecial = tx.id.startsWith('je-') || tx.id.startsWith('split-');
    const isManualEntry = tx.id.startsWith('je-');
    const regMatch = isSpecial ? (tx.regionId === selectedRegion) : currentRegionAccounts.includes(tx.accountId);
    const statMatch = txSubTab === 'pending' ? (tx.status === 'pending' || tx.status === 'rejected') : (tx.status === 'completed' && !isManualEntry);
    const dateMatch = (!filters.startDate || tx.date >= filters.startDate) && (!filters.endDate || tx.date <= filters.endDate);
    const accMatch = filters.accountIds.length === 0 || filters.accountIds.includes(tx.accountId);
    return regMatch && statMatch && dateMatch && accMatch && matchesSearch(tx);
  }), [transactions, selectedRegion, txSubTab, filters, searchTerm, currentRegionAccounts]);

  const handleDeleteJE = (jeNo: string) => { if (confirm('确定要删除这笔分录吗？')) { setTransactions(prev => prev.filter(t => !t.id.startsWith(`je-${jeNo}-`))); } };
  const handleEditJE = (jeNo: string) => { const related = transactions.filter(t => t.id.startsWith(`je-${jeNo}-`)); if (related.length === 0) return; setJeDate(related[0].date); setJeNo(jeNo); setManualJELines(related.map((tx, i) => ({ id: tx.id, accountId: tx.accountId, debit: tx.amount > 0 ? tx.amount.toString() : '', credit: tx.amount < 0 ? Math.abs(tx.amount).toString() : '', description: tx.description, name: tx.remark || '' }))); setIsManualEntryOpen(true); };

  const addNode = (parentId: string, name: string, regionIds: string[]) => {
    const newNode: COANode = { id: `node-${Date.now()}`, name, level: 0, children: [], regionIds };
    const traverse = (nodes: COANode[]): COANode[] => nodes.map(n => {
      if (n.id === parentId) return { ...n, children: [...n.children, { ...newNode, level: n.level + 1 }] };
      return { ...n, children: traverse(n.children) };
    });
    setCoa(traverse(coa));
  };
  const deleteNode = (id: string) => {
    const traverse = (nodes: COANode[]): COANode[] => nodes.filter(n => n.id !== id).map(n => ({ ...n, children: traverse(n.children) }));
    setCoa(traverse(coa));
  };

  const [expandedTxId, setExpandedTxId] = useState<string | null>(null);

  const renderTransactionRow = (tx: Transaction) => {
    const isJP = selectedRegion === 'jp';
    const isGroup = tx.isGroup;
    const isExpanded = expandedTxId === tx.id;
    const accName = isGroup ? '多科目/账户' : (regions.flatMap(r => r.accounts).find(a => a.id === tx.accountId)?.name || node4Options.find((n:any) => n.id === tx.accountId)?.name.split(' > ').pop() || '-');
    const jpTaxOptions = ["課税売上10%", "課税売上8%（軽）", "課対仕入10%", "課対仕入8%（軽）", "対象外", "非課売上", "共対仕入10%", "共対仕入8%（軽）", "非課仕入"];

    return (
      <React.Fragment key={tx.id}>
        <tr onClick={() => setExpandedTxId(isExpanded ? null : tx.id)} className={`group hover:bg-slate-50 transition-all cursor-pointer border-b border-slate-100 relative ${isExpanded ? 'bg-blue-50/40' : ''}`}>
          <td className="px-6 py-5 text-xs font-bold text-slate-900">{tx.date}</td>
          <td className="px-6 py-5" onClick={e => e.stopPropagation()}><div className="flex flex-col"><input className="text-xs font-bold bg-transparent outline-none w-full border-b border-transparent focus:border-blue-200 pointer-events-auto" value={tx.description} onChange={e => setTransactions(prev => prev.map(t => t.id === tx.id ? {...t, description: e.target.value} : t))} disabled={isGroup}/>{isGroup && <span className="text-[9px] text-blue-500 font-black mt-1 uppercase">Contains {tx.childCount} Lines</span>}</div></td>
          <td className="px-6 py-5 text-[11px] font-black text-slate-600">{accName}</td>
          <td className="px-6 py-5"><div className="flex items-center gap-3"><div className={`text-[14px] font-black font-mono px-3 py-1.5 rounded-xl border-2 border-slate-100 bg-white min-w-[100px] text-left ${tx.amount < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{(() => { const total = Math.abs(tx.amount); let base = total; if (isJP && !isGroup) { const cat = tx.taxCategory || '対象外'; if (cat.includes('10%')) base = total / 1.1; else if (cat.includes('8%')) base = total / 1.08; } return (tx.amount < 0 ? '-' : '+') + base.toLocaleString(undefined, { maximumFractionDigits: 2 }); })()}</div>{isJP && !isGroup && (<div className="text-[14px] font-black font-mono px-3 py-1.5 rounded-xl border-2 border-slate-100 bg-slate-50 text-slate-400 min-w-[80px]">{(() => { const total = Math.abs(tx.amount); let tax = 0; const cat = tx.taxCategory || '対象外'; if (cat.includes('10%')) tax = total - (total / 1.1); else if (cat.includes('8%')) tax = total - (total / 1.08); return tax.toLocaleString(undefined, { maximumFractionDigits: 2 }); })()}</div>)}</div></td>
          {isJP && (<td className="px-6 py-5"><div className="flex items-center gap-2 pointer-events-auto" onClick={e => e.stopPropagation()}><button onClick={() => setTransactions(prev => prev.map(t => t.id === tx.id ? {...t, isQualified: !t.isQualified} : t))} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${tx.isQualified ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'}`}>{tx.isQualified && <Check className="w-3 h-3 text-white" />}</button><select className="text-[10px] font-black border border-slate-200 rounded p-1 outline-none bg-white cursor-pointer" value={tx.taxCategory || '対象外'} onChange={e => setTransactions(prev => prev.map(t => t.id === tx.id ? {...t, taxCategory: e.target.value} : t))}>{jpTaxOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div></td>)}
          <td className="px-6 py-5" onClick={e => e.stopPropagation()}><SearchableSelect options={node4Options} value={tx.node4Id || ''} onChange={(id:any) => setTransactions(prev => prev.map(t => t.id === tx.id ? {...t, node4Id: id} : t))} placeholder={t.selectCoa} disabled={isGroup}/></td>
          <td className="px-6 py-5"><input className="w-full text-xs font-bold border-b border-slate-100 outline-none bg-transparent pointer-events-auto" onClick={e => e.stopPropagation()} value={tx.remark || ''} placeholder="备注..." onChange={e => setTransactions(prev => prev.map(t => t.id === tx.id ? {...t, remark: e.target.value} : t))} disabled={isGroup}/></td>
          <td className="px-6 py-5"><div className="flex gap-1 items-center pointer-events-auto" onClick={e => e.stopPropagation()}>{txSubTab === 'pending' ? (<><button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="p-3 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all cursor-pointer"><Paperclip className="w-4 h-4" /></button><button onClick={(e) => { e.stopPropagation(); setSplittingTx(tx); setSplitRows([{ id: '1', amount: (Math.abs(tx.amount)/2).toString(), node4Id: tx.node4Id || '', remark: '' }, { id: '2', amount: (Math.abs(tx.amount)/2).toString(), node4Id: '', remark: '' }]); setIsSplitDrawerOpen(true); }} className="p-3 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-full transition-all cursor-pointer"><Scissors className="w-4 h-4" /></button><button onClick={(e) => { e.stopPropagation(); setTransactions(prev => prev.map(t => t.id === tx.id ? {...t, status: 'completed'} : t)); }} className="p-3 text-emerald-500 scale-110 hover:scale-125 hover:bg-emerald-50 rounded-full transition-all cursor-pointer"><Check className="w-6 h-6 stroke-[3.5px]" /></button></>) : (<button onClick={(e) => { e.stopPropagation(); setTransactions(prev => prev.map(t => t.id === tx.id ? {...t, status: 'pending'} : t)); }} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-slate-800 transition-all cursor-pointer">撤回</button>)}</div></td>
        </tr>
        {isExpanded && !isGroup && (
          <tr onClick={e => e.stopPropagation()}><td colSpan={isJP ? 8 : 7} className="p-0 border-b border-slate-200"><div className="bg-slate-50/50 p-8"><div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col gap-8 shadow-sm"><div className="flex flex-col gap-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Bank Description</label><div className="text-sm font-black text-slate-900 bg-slate-50 p-4 rounded-xl border border-slate-100">{tx.description}</div></div><div className="flex gap-4 border-b border-slate-100 pb-4"><button className="px-4 py-2 rounded-lg text-xs font-black bg-slate-100 text-slate-600">Match</button><button className="px-4 py-2 rounded-lg text-xs font-black bg-slate-900 text-white border border-slate-950">Categorise</button></div><div className="grid grid-cols-2 gap-10"><div className="space-y-6"><div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction type</label><select className="w-full text-sm font-bold border-2 border-slate-100 rounded-xl px-4 py-3 bg-white outline-none focus:border-blue-500 cursor-pointer"><option>{tx.amount < 0 ? 'Expense' : 'Inflow'}</option></select></div><div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">From/To</label><input className="w-full text-sm font-bold border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500" placeholder="Select supplier or customer..."/></div></div><div className="space-y-6"><div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account</label><div className="w-full"><SearchableSelect options={node4Options} value={tx.node4Id || ''} onChange={(id:any) => setTransactions(prev => prev.map(t => t.id === tx.id ? {...t, node4Id: id} : t))} placeholder={t.selectCoa}/></div></div><div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Memo</label><textarea className="w-full h-24 text-sm font-bold border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-blue-500 resize-none" placeholder="Add a memo..." value={tx.remark || ''} onChange={e => setTransactions(prev => prev.map(t => t.id === tx.id ? {...t, remark: e.target.value} : t))}/></div></div></div><div className="flex justify-end gap-3 pt-4 border-t border-slate-100"><button onClick={(e) => { e.stopPropagation(); setExpandedTxId(null); }} className="px-6 py-2.5 text-xs font-black text-slate-400 hover:text-slate-600 cursor-pointer">Cancel</button><button onClick={(e) => { e.stopPropagation(); setTransactions(prev => prev.map(t => t.id === tx.id ? {...t, status: 'completed'} : t)); setExpandedTxId(null); }} className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black border border-slate-900 hover:bg-slate-800 cursor-pointer">Confirm Match</button></div></div></div></td></tr>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <input type="file" ref={fileInputRef} className="hidden" />
      {/* 侧边栏层级设低，防止遮挡右侧 */}
      <aside className="w-20 lg:w-64 bg-slate-900 flex flex-col shrink-0 relative z-10">
        <div className="p-6 flex items-center gap-3"><div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center border border-blue-500"><span className="text-white text-xl font-black italic">F</span></div><h1 className="text-lg font-black text-white tracking-tight uppercase hidden lg:block">F system</h1></div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button onClick={() => setActiveTab('transactions')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border ${activeTab === 'transactions' ? 'bg-blue-600 text-white border-blue-500' : 'text-slate-400 border-transparent hover:bg-slate-800'} cursor-pointer transition-all`}><ArrowRightLeft className="w-5 h-5" /><span className="hidden lg:block font-bold">{t.transactions}</span></button>
          <button onClick={() => setActiveTab('coa')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border ${activeTab === 'coa' ? 'bg-blue-600 text-white border-blue-500' : 'text-slate-400 border-transparent hover:bg-slate-800'} cursor-pointer transition-all`}><FileText className="w-5 h-5" /><span className="hidden lg:block font-bold">{t.coaMapping}</span></button>
        </nav>
        <div className="p-4 border-t border-slate-800 relative">
          <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="w-full bg-slate-800 rounded-2xl p-3 flex items-center gap-3 hover:bg-slate-700 transition-all border border-slate-700 cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shrink-0 border border-blue-500"><User className="w-5 h-5" /></div>
            <div className="flex-1 min-w-0 hidden lg:block"><div className="text-sm font-bold text-white truncate text-left">yu.bin@ctw.inc</div></div>
          </button>
          {isUserMenuOpen && (<div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl border border-slate-200 py-2 text-slate-900 z-[300] shadow-xl">{['简体中文', 'English', '日本語'].map((l, i) => <button key={l} onClick={() => {setLang(i===0?'zh-CN':i===1?'en-US':'ja-JP'); setIsUserMenuOpen(false);}} className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer">{l}</button>)}</div>)}
        </div>
      </aside>

      {/* 主内容区域使用 z-20 确保高于侧边栏 */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden relative z-20">
        {/* 顶部导航：使用 py 确保按钮居中，且去掉所有可能导致偏移的 pt/h */}
        <div className="bg-white py-6 px-8 border-b flex items-center justify-between shrink-0 relative z-[100] pointer-events-auto">
          <div className="flex gap-8">
            {regions.map(r => (
              <button 
                key={r.id} 
                onClick={(e) => { e.stopPropagation(); setSelectedRegion(r.id); }} 
                className={`pb-2 px-1 text-sm font-black transition-all relative border-b-4 ${selectedRegion === r.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'} cursor-pointer pointer-events-auto`}
              >
                {r.name}
              </button>
            ))}
          </div>
          <div className="flex gap-3 pointer-events-auto">
            <button onClick={(e) => { e.stopPropagation(); setIsRuleModalOpen(true); setIsRuleEditorOpen(false); }} className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl text-xs font-black border border-amber-600 hover:bg-amber-600 transition-all active:scale-95 cursor-pointer"><Zap className="w-4 h-4 fill-current" />{t.rules}</button>
            <button onClick={(e) => { e.stopPropagation(); setJeDate(new Date().toISOString().split('T')[0]); setJeNo('JE-'+Math.floor(Math.random()*10000)); setManualJELines([{id:'1',accountId:'',debit:'',credit:'',description:'',name:''},{id:'2',accountId:'',debit:'',credit:'',description:'',name:''},{id:'3',accountId:'',debit:'',credit:'',description:'',name:''},{id:'4',accountId:'',debit:'',credit:'',description:'',name:''}]); setIsManualEntryOpen(true); }} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black border border-slate-950 hover:bg-slate-800 transition-all active:scale-95 cursor-pointer"><PlusCircle className="w-4 h-4" />{t.manualInput}</button>
            <button onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="flex items-center gap-2 px-6 py-3 border-2 border-slate-100 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-50 transition-all active:scale-95 cursor-pointer"><Upload className="w-4 h-4" />{t.upload}</button>
          </div>
        </div>

        {activeTab === 'transactions' ? (
          <div className="flex-1 flex flex-col overflow-hidden relative z-0">
            {/* 二级状态切换 */}
            <div className="px-8 py-3 flex items-center justify-between border-b bg-slate-50/50 shrink-0 relative z-10">
              <div className="flex gap-8">
                {['pending', 'completed', 'je'].map(sub => (
                  <button key={sub} onClick={() => setTxSubTab(sub as any)} className={`text-[13px] font-black transition-all relative pb-2 border-b-4 cursor-pointer ${txSubTab === sub ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{sub==='je'?'分录 (JE)':sub==='pending'?t.pending:t.completed}</button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white rounded-xl px-2 py-1.5 border border-slate-200"><input type="date" className="bg-transparent text-[10px] font-bold text-slate-500 outline-none w-[85px] cursor-pointer" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})}/><span className="text-slate-300 mx-1">-</span><input type="date" className="bg-transparent text-[10px] font-bold text-slate-500 outline-none w-[85px] cursor-pointer" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})}/></div>
                <div className="flex items-center bg-white rounded-xl px-3 py-2 w-[200px] border border-slate-200"><Search className="w-3.5 h-3.5 text-slate-400 mr-2" /><input type="text" placeholder="搜索..." className="bg-transparent text-xs font-bold outline-none w-full" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/></div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 relative z-0">
              {txSubTab === 'je' ? (
                <div className="border border-slate-200 rounded-3xl bg-white overflow-hidden"><table className="w-full text-left border-separate border-spacing-0"><thead className="bg-slate-50 sticky top-0 z-20"><tr><th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase border-b border-slate-200 w-[100px]">ID</th><th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase border-b border-slate-200 w-[120px]">日期</th><th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase border-b border-slate-200">摘要</th><th className="px-6 py-4 text-[11px] font-black text-slate-600 uppercase border-b border-slate-200 bg-blue-50/50 w-[200px]">借方科目</th><th className="px-6 py-4 text-[11px] font-black text-slate-600 uppercase border-b border-slate-200 bg-blue-50/50 text-right w-[120px]">借方金额</th><th className="px-6 py-4 text-[11px] font-black text-slate-600 uppercase border-b border-slate-200 bg-amber-50/50 w-[200px]">贷方科目</th><th className="px-6 py-4 text-[11px] font-black text-slate-600 uppercase border-b border-slate-200 bg-amber-50/50 text-right w-[120px]">贷方金额</th><th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase border-b border-slate-200 text-center w-[120px]">操作</th></tr></thead><tbody className="divide-y divide-slate-50">{transactions.filter(t => (currentRegionAccounts.includes(t.accountId) || t.regionId === selectedRegion) && t.status === 'completed' && matchesSearch(t)).sort((a,b) => (a.id.startsWith('je-')?a.id.split('-').slice(0,3).join('-'):a.id).localeCompare(b.id.startsWith('je-')?b.id.split('-').slice(0,3).join('-'):b.id)).flatMap((tx, index, arr) => { const isSpecial = tx.id.startsWith('je-') || tx.id.startsWith('split-'); const isJP = selectedRegion === 'jp'; const absAmount = Math.abs(tx.amount); let tax = 0; let base = absAmount; const cat = tx.taxCategory || '対象外'; if (isJP && !isSpecial) { if (cat.includes('10%')) { base = absAmount / 1.1; tax = absAmount - base; } else if (cat.includes('8%')) { base = absAmount / 1.08; tax = absAmount - base; } } const bankName = regions.flatMap(r => r.accounts).find(a => a.id === tx.accountId)?.name || 'Bank'; const coaName = node4Options.find((n:any) => n.id === tx.node4Id)?.name.split(' > ').pop() || 'Unassigned'; const isGroupLine = index > 0 && isSpecial && (tx.id.split('-').slice(0,3).join('-') === arr[index-1].id.split('-').slice(0,3).join('-')); if (isSpecial) { let debAcc = '', creAcc = '', debAmt = '', creAmt = ''; if (tx.amount > 0) { debAcc = (regions.flatMap(r => r.accounts).find(a => a.id === tx.accountId)?.name || coaName); debAmt = absAmount.toLocaleString(); } else { creAcc = (regions.flatMap(r => r.accounts).find(a => a.id === tx.accountId)?.name || coaName); creAmt = absAmount.toLocaleString(); } return [(<tr key={tx.id} className="hover:bg-slate-50 transition-colors"><td className="px-6 py-4 text-xs font-bold text-slate-400">{!isGroupLine && (tx.id.startsWith('je-')?tx.id.split('-')[1]:'SPLIT')}</td><td className="px-6 py-4 text-sm font-bold text-slate-500">{!isGroupLine && tx.date}</td><td className="px-6 py-4 text-sm font-medium text-slate-700 truncate max-w-[200px]">{!isGroupLine && tx.description}</td><td className="px-6 py-4 text-sm font-black text-slate-800 bg-blue-50/30 border-l border-blue-100">{debAcc}</td><td className="px-6 py-4 text-sm font-mono font-black text-slate-900 text-right bg-blue-50/30 border-r border-blue-100">{debAmt}</td><td className="px-6 py-4 text-sm font-black text-slate-800 bg-amber-50/30 border-l border-amber-100">{creAcc}</td><td className="px-6 py-4 text-sm font-mono font-black text-slate-900 text-right bg-amber-50/30 border-r border-amber-100">{creAmt}</td><td className="px-6 py-4 text-center border-l border-slate-100">{!isGroupLine && tx.id.startsWith('je-') && (<div className="flex justify-center gap-1"><button onClick={(e) => { e.stopPropagation(); handleEditJE(tx.id.split('-')[1]); }} className="p-3 text-blue-500 hover:bg-blue-50 rounded-lg cursor-pointer"><Pencil className="w-4 h-4" /></button><button onClick={(e) => { e.stopPropagation(); handleDeleteJE(tx.id.split('-')[1]); }} className="p-3 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"><Trash2 className="w-4 h-4" /></button></div>)}</td></tr>)]; } if (isJP && tax > 0) { return [<tr key={`${tx.id}-base`} className="hover:bg-slate-50 transition-colors"><td className="px-6 py-4 text-xs font-bold text-slate-400">{tx.id.split('-').pop()}</td><td className="px-6 py-4 text-sm font-bold text-slate-500">{tx.date}</td><td className="px-6 py-4 text-sm font-medium text-slate-700 truncate max-w-[200px]">{tx.description}</td><td className="px-6 py-4 text-sm font-black text-slate-800 bg-blue-50/30 border-l border-blue-100">{tx.amount > 0 ? bankName : coaName}</td><td className="px-6 py-4 text-sm font-mono font-black text-slate-900 text-right bg-blue-50/30 border-r border-blue-100">{tx.amount > 0 ? absAmount.toLocaleString() : base.toLocaleString(undefined, {maximumFractionDigits:0})}</td><td className="px-6 py-4 text-sm font-black text-slate-800 bg-amber-50/30 border-l border-amber-100">{tx.amount > 0 ? coaName : bankName}</td><td className="px-6 py-4 text-sm font-mono font-black text-slate-900 text-right bg-amber-50/30 border-r border-amber-100">{tx.amount > 0 ? base.toLocaleString(undefined, {maximumFractionDigits:0}) : absAmount.toLocaleString()}</td><td className="px-6 py-4 border-l border-slate-100"></td></tr>, <tr key={`${tx.id}-tax`} className="hover:bg-slate-50 transition-colors border-t border-dashed border-slate-100"><td className="px-6 py-2 text-xs font-bold text-slate-400 opacity-0">#</td><td className="px-6 py-2 text-sm font-bold text-slate-500 opacity-0">{tx.date}</td><td className="px-6 py-2 text-sm font-medium text-slate-400 italic">└─ {cat}</td><td className="px-6 py-2 text-sm font-black text-slate-600 bg-blue-50/30 border-l border-blue-100 opacity-0">{tx.amount > 0 ? '' : cat}</td><td className="px-6 py-2 text-sm font-mono font-black text-blue-600 text-right bg-blue-50/30 border-r border-blue-100">{tx.amount > 0 ? '' : tax.toLocaleString(undefined, {maximumFractionDigits:0})}</td><td className="px-6 py-2 text-sm font-black text-slate-600 bg-amber-50/30 border-l border-amber-100">{tx.amount > 0 ? cat : ''}</td><td className="px-6 py-2 text-sm font-mono font-black text-amber-600 text-right bg-blue-50/30 border-r border-amber-100">{tx.amount > 0 ? tax.toLocaleString(undefined, {maximumFractionDigits:0}) : ''}</td><td className="px-6 py-4 border-l border-slate-100"></td></tr>]; } return [(<tr key={tx.id} className="hover:bg-slate-50 transition-colors"><td className="px-6 py-4 text-xs font-bold text-slate-400">{tx.id.split('-').pop()}</td><td className="px-6 py-4 text-sm font-bold text-slate-500">{tx.date}</td><td className="px-6 py-4 text-sm font-medium text-slate-700 truncate max-w-[200px]">{tx.description}</td><td className="px-6 py-4 text-sm font-black text-slate-800 bg-blue-50/30 border-l border-blue-100">{tx.amount > 0 ? bankName : coaName}</td><td className="px-6 py-4 text-sm font-mono font-black text-slate-900 text-right bg-blue-50/30 border-r border-blue-100">{absAmount.toLocaleString()}</td><td className="px-6 py-4 text-sm font-black text-slate-800 bg-amber-50/30 border-l border-amber-100">{tx.amount > 0 ? coaName : bankName}</td><td className="px-6 py-4 text-sm font-mono font-black text-slate-900 text-right bg-amber-50/30 border-r border-amber-100">{absAmount.toLocaleString()}</td><td className="px-6 py-4 border-l border-slate-100"></td></tr>)]; })}</tbody></table></div>
              ) : (
                <div className="border border-slate-200 rounded-3xl bg-white overflow-visible"><table className="w-full text-left border-separate border-spacing-0"><thead className="bg-slate-50 sticky top-0 z-20"><tr><th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase border-b border-slate-200">{t.date}</th><th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase border-b border-slate-200">{t.description}</th><th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase border-b border-slate-200">{t.accountName}</th><th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase border-b border-slate-200">{t.amount}</th>{selectedRegion === 'jp' && <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase border-b border-slate-200">适格・税区分</th>}<th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase border-b border-slate-200 w-[280px]">{t.coaMapping}</th><th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase border-b border-slate-200">{t.remark}</th><th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase border-b border-slate-200 text-left">{t.actions}</th></tr></thead><tbody className="divide-y divide-slate-50">{(() => { if (txSubTab === 'completed') { const grouped: any = {}; const normals: any[] = []; filteredTransactions.forEach(tx => { if (tx.id.startsWith('je-') || tx.id.startsWith('split-')) { const bid = tx.id.split('-').slice(0,3).join('-'); if (!grouped[bid]) grouped[bid] = []; grouped[bid].push(tx); } else normals.push(tx); }); return [...normals, ...Object.values(grouped).map((g: any) => ({ ...g[0], id: g[0].id.split('-').slice(0,3).join('-'), accountId: 'multiple', amount: g.reduce((s: any, t: any) => s + t.amount, 0), isGroup: true, childCount: g.length }))].sort((a,b) => b.date.localeCompare(a.date)).map(tx => renderTransactionRow(tx)); } return filteredTransactions.map(tx => renderTransactionRow(tx)); })()}</tbody></table>{filteredTransactions.length === 0 && <div className="py-24 text-center font-black italic text-slate-300">暂无交易记录</div>}</div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-10 animate-in fade-in duration-500 relative z-10"><div className="max-w-5xl mx-auto"><h3 className="text-3xl font-black text-slate-900 mb-10">{t.treeTitle}</h3><div className="bg-white rounded-[40px] border border-slate-200 p-10"><div className="space-y-4">{coa.map(n => <TreeNode key={n.id} node={n} onAdd={addNode} onDelete={deleteNode} t={t} />)}</div></div></div></div>
        )}
      </main>

      <RuleDrawer isOpen={isRuleModalOpen} onClose={() => setIsRuleModalOpen(false)} rules={rules} setRules={setRules} regions={regions} node4Options={node4Options} t={t} selectedRuleRegion={selectedRuleRegion} setSelectedRuleRegion={setSelectedRuleRegion} isRuleEditorOpen={isRuleEditorOpen} setIsRuleEditorOpen={setIsRuleEditorOpen} editingRule={editingRule} setEditingRule={setEditingRule} handleSaveRule={() => { const nr = { ...editingRule as Rule, id: editingRule.id || `rule-${Date.now()}` }; setRules(p => editingRule.id ? p.map(r => r.id === nr.id ? nr : r) : [...p, nr]); setIsRuleEditorOpen(false); }} />
      <ManualEntryDrawer isOpen={isManualEntryOpen} onClose={() => {setIsManualEntryOpen(false); setJeNo(''); setManualJELines([]);}} jeNo={jeNo} setJeNo={setJeNo} jeDate={jeDate} setJeDate={setJeDate} jeRows={manualJELines} setJeRows={setManualJELines} regions={regions} node4Options={node4Options} setTransactions={setTransactions} t={t} selectedRegion={selectedRegion} />
      <SplitDrawer isOpen={isSplitDrawerOpen} onClose={() => setIsSplitDrawerOpen(false)} tx={splittingTx} rows={splitRows} setRows={setSplitRows} node4Options={node4Options} onSave={() => { if (!splittingTx) return; const total = splitRows.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0); if (Math.abs(total - Math.abs(splittingTx.amount)) > 0.01) return alert('金额未配平'); const jeId = `split-${splittingTx.id}-${Date.now()}`; const bankAmt = splittingTx.amount > 0 ? -splittingTx.amount : Math.abs(splittingTx.amount); const bankTx: Transaction = { ...splittingTx, id: `${jeId}-bank`, status: 'completed', amount: bankAmt, regionId: selectedRegion }; const coaTxs: Transaction[] = splitRows.map((r, i) => ({ id: `${jeId}-coa-${i}`, date: splittingTx.date, description: r.remark || splittingTx.description, amount: splittingTx.amount > 0 ? parseFloat(r.amount) : -parseFloat(r.amount), currency: splittingTx.currency, accountId: r.node4Id, node4Id: r.node4Id, status: 'completed', remark: r.remark, regionId: selectedRegion })); setTransactions(prev => [...prev.filter(t => t.id !== splittingTx.id), bankTx, ...coaTxs]); setIsSplitDrawerOpen(false); }} t={t} />
    </div>
  );
}

function RuleDrawer({ isOpen, onClose, rules, setRules, regions, node4Options, t, selectedRuleRegion, setSelectedRuleRegion, isRuleEditorOpen, setIsRuleEditorOpen, editingRule, setEditingRule, handleSaveRule }: any) { 
  if (!isOpen) return null; 
  return ReactDOM.createPortal(<><div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998]" onClick={onClose} /><div className="fixed top-0 right-0 h-full w-[600px] bg-white z-[9999] flex flex-col border-l border-slate-200"><div className="p-6 border-b flex items-center justify-between bg-slate-50"><div><h3 className="text-xl font-black text-slate-900 flex items-center gap-2"><Zap className="w-6 h-6 text-amber-500 fill-current" />{isRuleEditorOpen ? '编辑规则' : t.rules}</h3></div><button onClick={onClose} className="p-2 cursor-pointer"><X className="w-6 h-6" /></button></div><div className="flex-1 overflow-y-auto p-8">{!isRuleEditorOpen ? (<div className="space-y-6"><div className="flex gap-2 overflow-x-auto pb-2">{regions.map((r: any) => <button key={r.id} onClick={() => setSelectedRuleRegion(r.id)} className={`px-4 py-2 rounded-lg text-xs font-black border ${selectedRuleRegion === r.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-500 border-transparent'} cursor-pointer`}>{r.name}</button>)}</div><button onClick={() => { setEditingRule({ name: '', direction: 'out', accountId: 'all', conditionValue: '', assignNode4Id: '', autoConfirm: false, regionId: selectedRuleRegion }); setIsRuleEditorOpen(true); }} className="w-full py-4 border-2 border-dashed border-blue-200 text-blue-500 font-black cursor-pointer hover:bg-blue-50 transition-all">+ {t.createRule}</button></div>) : (<div className="space-y-8"><div><label className="text-xs font-black text-slate-400">规则名称</label><input className="w-full text-lg font-black border-b-2 border-slate-200 py-2 outline-none focus:border-blue-600" value={editingRule.name} onChange={e => setEditingRule({...editingRule, name: e.target.value})}/></div><SearchableSelect options={node4Options} value={editingRule.assignNode4Id} onChange={(id:any) => setEditingRule({...editingRule, assignNode4Id: id})} placeholder="分配科目"/></div>)}</div><div className="p-6 border-t bg-white flex gap-3">{isRuleEditorOpen && <button onClick={() => setIsRuleEditorOpen(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold border border-slate-200 cursor-pointer">返回</button>}<button onClick={isRuleEditorOpen ? handleSaveRule : onClose} className="flex-[2] py-3 bg-slate-900 text-white rounded-xl font-black border border-slate-900 cursor-pointer">{isRuleEditorOpen ? t.save : '关闭'}</button></div></div></>, document.body); 
}

function ManualEntryDrawer({ isOpen, onClose, jeNo, setJeNo, jeDate, setJeDate, jeRows, setJeRows, regions, node4Options, setTransactions, t, selectedRegion }: any) {
  if (!isOpen) return null;
  const totalDebit = jeRows.reduce((sum: number, r: any) => sum + (parseFloat(r.debit) || 0), 0);
  const totalCredit = jeRows.reduce((sum: number, r: any) => sum + (parseFloat(r.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;
  const handleSave = () => { if (!isBalanced) return alert('借贷不平'); const bankAccounts = regions.flatMap((r: any) => r.accounts); const newTxs = jeRows.filter((r: any) => r.accountId).map((r: any, i: number) => ({ id: `je-${jeNo}-${i}-${Date.now()}`, date: jeDate, description: r.description || `JE #${jeNo}`, amount: (parseFloat(r.debit)||0)-(parseFloat(r.credit)||0), currency: bankAccounts.find((a:any)=>a.id===r.accountId)?.currency || 'USD', accountId: r.accountId, status: 'completed', remark: r.name, regionId: selectedRegion })); setTransactions((p:any) => [...newTxs, ...p.filter((t:any) => !t.id.startsWith(`je-${jeNo}-`))]); onClose(); alert('分录已保存'); };
  return ReactDOM.createPortal(<><div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998]" onClick={onClose} /><div className="fixed top-0 right-0 h-full w-[1000px] bg-white z-[9999] flex flex-col border-l border-slate-200"><div className="p-6 border-b flex items-center justify-between bg-slate-50"><div><h3 className="text-xl font-black text-slate-900 flex items-center gap-2"><PlusCircle className="w-6 h-6 text-blue-600" />手动录入</h3></div><button onClick={onClose} className="p-2 cursor-pointer"><X className="w-6 h-6" /></button></div><div className="flex-1 overflow-y-auto p-6"><table className="w-full border-separate border-spacing-y-2"><thead><tr><th className="text-left text-[10px] font-black text-slate-400 pb-2 w-[280px]">科目匹配</th><th className="text-left text-[10px] font-black text-slate-400 pb-2 w-[120px]">借方</th><th className="text-left text-[10px] font-black text-slate-400 pb-2 w-[120px]">贷方</th><th className="text-left text-[10px] font-black text-slate-400 pb-2">摘要</th></tr></thead><tbody>{jeRows.map((r:any, i:number)=>(<tr key={r.id}><td><SearchableSelect options={[...regions.flatMap((rg:any)=>rg.accounts.map((a:any)=>({id:a.id,name:a.name}))),...node4Options]} value={r.accountId} onChange={(v:any)=>{const nr=[...jeRows];nr[i].accountId=v;setJeRows(nr);}} placeholder="Select..."/></td><td><input className="w-full border-2 border-slate-50 rounded-xl px-2 py-2.5 text-right" placeholder="0.00" value={r.debit} onChange={e=>{const nr=[...jeRows];nr[i].debit=e.target.value;nr[i].credit='';setJeRows(nr);}}/></td><td><input className="w-full border-2 border-slate-50 rounded-xl px-2 py-2.5 text-right" placeholder="0.00" value={r.credit} onChange={e=>{const nr=[...jeRows];nr[i].credit=e.target.value;nr[i].debit='';setJeRows(nr);}}/></td><td><input className="w-full border-2 border-slate-50 rounded-xl px-3 py-2.5" value={r.description} onChange={e=>{const nr=[...jeRows];nr[i].description=e.target.value;setJeRows(nr);}}/></td></tr>))}</tbody></table><button onClick={()=>setJeRows([...jeRows,{id:Math.random().toString(),accountId:'',debit:'',credit:'',description:'',name:''}])} className="mt-4 text-xs font-black text-blue-600 border border-blue-200 px-4 py-2 rounded-xl cursor-pointer">+ ADD LINE</button></div><div className="p-8 border-t bg-slate-50 flex items-center justify-between"><div className="flex gap-12"><div className="flex flex-col items-end"><span className="text-[10px] font-black text-slate-400 uppercase">Debits</span><span className="font-mono text-2xl font-black">{totalDebit.toLocaleString()}</span></div><div className="flex flex-col items-end"><span className="text-[10px] font-black text-slate-400 uppercase">Credits</span><span className="font-mono text-2xl font-black">{totalCredit.toLocaleString()}</span></div></div><button onClick={handleSave} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black border border-slate-900 cursor-pointer">Save & Close</button></div></div></>, document.body); }

function SplitDrawer({ isOpen, onClose, tx, rows, setRows, node4Options, onSave, t }: any) { 
  if (!isOpen || !tx) return null; 
  const total = rows.reduce((s: number, r: any) => s + (parseFloat(r.amount) || 0), 0); 
  const rem = Math.abs(tx.amount) - total; 
  return ReactDOM.createPortal(<><div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998]" onClick={onClose} /><div className="fixed top-0 right-0 h-full w-[550px] bg-white z-[9999] flex flex-col border-l border-slate-200"><div className="p-6 border-b flex items-center justify-between bg-slate-50"><div><h3 className="text-xl font-black text-slate-900 flex items-center gap-2"><Scissors className="w-6 h-6 text-amber-500" />拆分交易</h3></div><button onClick={onClose} className="p-2 cursor-pointer"><X className="w-6 h-6" /></button></div><div className="flex-1 overflow-y-auto p-8 space-y-4">{rows.map((r: any, i: number) => (<div key={r.id} className="p-5 border-2 border-slate-50 rounded-2xl space-y-4"><div className="flex justify-between items-center"><span className="text-[10px] font-black text-blue-600">Line #{i+1}</span><button onClick={()=>setRows(rows.filter((_:any,idx:number)=>idx!==i))} className="text-rose-400 cursor-pointer"><Trash2 className="w-4 h-4"/></button></div><div className="grid grid-cols-2 gap-4"><div><input className="w-full border-2 border-slate-100 rounded-xl px-3 py-2 text-sm font-black" value={r.amount} onChange={e=>{const nr=[...rows];nr[i].amount=e.target.value;setRows(nr);}}/></div><div><SearchableSelect options={node4Options} value={r.node4Id} onChange={(v:any)=>{const nr=[...rows];nr[i].node4Id=v;setRows(nr);}} placeholder="Select Subject"/></div></div></div>))}<button onClick={()=>setRows([...rows,{id:Math.random().toString(),amount:'0',node4Id:'',remark:''}])} className="w-full py-4 border-2 border-dashed rounded-2xl text-slate-400 font-black cursor-pointer hover:bg-slate-50">+ ADD SPLIT</button></div><div className="p-8 border-t bg-slate-50 flex items-center justify-between"><div className="flex flex-col"><span className="text-[10px] font-black text-slate-400">Remaining</span><span className={`font-mono text-2xl font-black ${Math.abs(rem)>0.01?'text-rose-500':'text-emerald-500'}`}>{rem.toLocaleString()}</span></div><button onClick={onSave} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black border border-slate-900 cursor-pointer" disabled={Math.abs(rem)>0.01}>Confirm</button></div></div></>, document.body); 
}

function TreeNode({ node, onAdd, onDelete, t }: any) {
  const [isOpen, setIsOpen] = useState(true); const [isAdding, setIsAdding] = useState(false); const [newName, setNewName] = useState(''); const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const regions = [{id:'jp',name:'JP'},{id:'sg',name:'SG'},{id:'us',name:'US'},{id:'cayman',name:'Cayman'}];
  return (<div className="ml-4 border-l-2 border-slate-50 pl-6 py-1"><div className="flex items-center gap-3 group py-2"><button onClick={() => setIsOpen(!isOpen)} className={`p-1.5 cursor-pointer ${node.children.length === 0 ? 'invisible' : ''}`}>{isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}</button><div className={`px-4 py-3 rounded-2xl flex items-center justify-between flex-1 border ${node.level === 1 ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200'}`}><div className="flex items-center gap-2"><span className="font-black text-[13px]">{node.name}</span>{node.regionIds && node.regionIds.map((rid:any)=><span key={rid} className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[9px] rounded font-black border border-blue-200">{rid.toUpperCase()}</span>)}</div><div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">{node.level < 6 && <button onClick={() => setIsAdding(true)} className="p-1 hover:text-blue-400 cursor-pointer"><Plus className="w-4 h-4" /></button>}{!node.isFixed && <button onClick={() => onDelete(node.id)} className="p-1 hover:text-rose-400 cursor-pointer"><Trash2 className="w-4 h-4" /></button>}</div></div></div>{isAdding && (<div className="ml-10 mt-2 p-5 bg-slate-50 rounded-2xl border border-slate-200"><input autoFocus className="w-full px-4 py-3 rounded-xl outline-none mb-4 border-2 border-white" placeholder="节点名称..." value={newName} onChange={e => setNewName(e.target.value)}/><div className="flex gap-2 overflow-x-auto mb-4">{regions.map(r=><button key={r.id} onClick={()=>setSelectedRegions(prev=>prev.includes(r.id)?prev.filter(i=>i!==r.id):[...prev,r.id])} className={`px-3 py-1.5 rounded-lg text-[10px] font-black border ${selectedRegions.includes(r.id)?'bg-blue-600 text-white border-blue-600':'bg-white text-slate-400 border-slate-200'} cursor-pointer`}>{r.name}</button>)}</div><div className="flex gap-2 justify-end"><button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-400 font-bold cursor-pointer">取消</button><button onClick={() => { onAdd(node.id, newName, selectedRegions); setIsAdding(false); setNewName(''); }} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-black border border-slate-900 cursor-pointer">保存</button></div></div>)}{isOpen && node.children.length > 0 && <div className="mt-1">{node.children.map((c:any) => <TreeNode key={c.id} node={c} onAdd={onAdd} onDelete={onDelete} t={t} />)}</div>}</div>);
}

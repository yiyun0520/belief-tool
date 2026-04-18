// v4.0 — Batch 4: Toast系統 / motion token / focus / disabled / loading
import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import { Plus, Info, Clock, ChevronDown, ChevronUp, X, Check, Trash2, Sparkles, ArrowLeft, Filter, Edit3, Upload, Download, Copy, Settings, LogOut, User, AlertTriangle, CheckCircle, Info as InfoIcon } from "lucide-react";
import { useSync } from "./useSync";

const THEMES = {
  d1: { bg:"#23232E", bgDeep:"#1A1A24", bgCard:"#2A2A38", border:"#3A3848", borderHover:"#4A4858", accent:"#6B5FD4", accentLight:"#3B3760", accentText:"#E8E6F4", coral:"#E05570", cancelBg:"#4D4466", cancelText:"#D4CFE8", t1:"#E8E6F4", t2:"#C0BDDA", t3:"#9B98B0", name:"炭灰紫", nameJa:"パープル" },
  d2: { bg:"#1C1C1E", bgDeep:"#111113", bgCard:"#222224", border:"#2E2E30", borderHover:"#3E3E42", accent:"#A78BFA", accentLight:"#3F375A", accentText:"#2D2540", coral:"#E05570", cancelBg:"#3A3A3E", cancelText:"#D0D0D4", t1:"#ECECEE", t2:"#B8B8BC", t3:"#7A7A80", name:"黑曜石", nameJa:"ブラック" },
  d3: { bg:"#1E1C1A", bgDeep:"#141210", bgCard:"#262220", border:"#302C28", borderHover:"#403C38", accent:"#D4C8A8", accentLight:"#302820", accentText:"#100C04", coral:"#E05570", cancelBg:"#2C2820", cancelText:"#A89880", t1:"#EDE8E0", t2:"#A89880", t3:"#706860", name:"暖石", nameJa:"ウォームグレー" },
  l1: { bg:"#F4F2FC", bgDeep:"#EEEAF7", bgCard:"#FBFAFE", border:"#D8D2ED", borderHover:"#C4BCE0", accent:"#6B5FD4", accentLight:"#E3DEF5", accentText:"#FFFFFF", coral:"#E05570", cancelBg:"#CCC0EC", cancelText:"#3D3570", t1:"#2A2438", t2:"#5A5368", t3:"#8C8599", name:"薰衣草白", nameJa:"ラベンダー" },
  l2: { bg:"#FAF5EE", bgDeep:"#F2E8D8", bgCard:"#FEFAF5", border:"#E0CEBC", borderHover:"#CEB89A", accent:"#C87830", accentLight:"#F5E0C8", accentText:"#FFFFFF", coral:"#E05570", cancelBg:"#EEDCCC", cancelText:"#4A3018", t1:"#2E2018", t2:"#5A4030", t3:"#987850", name:"杏仁奶", nameJa:"アーモンド" },
  l3: { bg:"#EAF7F3", bgDeep:"#DAF0E8", bgCard:"#F6FCFA", border:"#AADDD0", borderHover:"#8DD4C8", accent:"#1AB898", accentLight:"#B8F0E4", accentText:"#FFFFFF", coral:"#E05570", cancelBg:"#B8EDE4", cancelText:"#174840", t1:"#172E2A", t2:"#345850", t3:"#5AAA9A", name:"薄荷", nameJa:"ミント" },
};

function isDark(th) { return th.bg.startsWith("#1") || th.bg.startsWith("#2"); }
function getShadows(th) {
  if (isDark(th)) return { sm:"none", md:"none", lg:"none", xl:"none" };
  return { sm:"0 1px 3px rgba(0,0,0,0.06)", md:"0 4px 12px rgba(0,0,0,0.08)", lg:"0 8px 24px rgba(0,0,0,0.12)", xl:"0 12px 32px rgba(0,0,0,0.16)" };
}

const BADGE_COLORS = {
  nourishing: { border:"#4EAD88", text:"#6DDDB4" },
  watching:   { border:"#A87E2A", text:"#E0AC48" },
  draining:   { border:"#A04848", text:"#E08888" },
};

const T = {
  zh: {
    appTitle:"信念覺察", about:"關於這個工具", export:"匯出", importBtn:"匯入",
    allBeliefs:"全部", nourishing:"滋養", balanced:"一半一半", draining:"消耗",
    unsure:"不確定", unevaluated:"還沒評估", transforming:"轉化中",
    addBelief:"新增信念", cancel:"取消", back:"返回",
    guideQ:"你現在對想記錄的信念，清楚到什麼程度？",
    guideA:"已知道信念是什麼", guideB:"有件事想分析看看", guideC:"從篩選器帶入",
    guideDescA:"直接輸入信念文字", guideDescB:"描述事件，讓 AI 幫你找出背後的信念", guideDescC:"把篩選器裡的信念帶過來（需先從篩選器匯出 JSON）",
    changeEntry:"重新選擇方式",
    beliefPlaceholder:"這個信念是什麼？（例：努力就會成功）",
    createBelief:"建立信念", eventDesc:"發生了什麼事？", myReaction:"我的反應/感受",
    analyzeWithAI:"讓 AI 分析背後可能的信念",
    selectBeliefs:"選擇要建立的信念（可多選）", selectHint:"點選有共鳴的，可以選多個",
    addSelected:"建立選中的信念",
    source_direct:"直接輸入", source_filter:"從篩選器", source_event:"從事件反推",
    block1:"信念與事實", block2:"評估", block3:"覺察", block4:"轉化",
    editBelief:"編輯", editFact:"編輯", supportingFacts:"支持這個信念的事實",
    factPlaceholder:"輸入一個支持這個信念的事實…",
    howAffect:"它怎麼影響你？",
    score1:"傷害我", score2:"消耗多於幫助", score3:"一半一半", score4:"幫助多於消耗", score5:"滋養我", scoreUnsure:"不確定",
    whyScore:"為什麼？（選填）", whyPlaceholder:"想寫就寫，不寫也可以",
    saveEval:"儲存評分", evalHistory:"曾評估 {n} 次", seeHistory:"看歷史 →",
    awarenessPrompt:"它怎麼影響你？是幫助還是消耗？",
    awarenessPromptUnsure:"先別急著評分。它怎麼影響你？是幫助還是消耗？",
    awarenessPlaceholder:"自由書寫…加分減分都適用",
    transformHint_nourishing:"目前評估為滋養。如果想嘗試換個角度或寫新信念，可以從這裡開始 →",
    transformHint_balanced:"想換個角度看它嗎？或寫一個新的信念？→",
    transformHint_draining:"想換個角度看它嗎？或寫一個新的信念？→",
    transformHint_unsure:"先覺察看看。如果想嘗試轉化，從這裡開始 →",
    transformHint_unevaluated:"先覺察看看。如果想嘗試轉化，從這裡開始 →",
    tryIt:"我想試試 →", stopTransform:"我不想轉化了 ←",
    choosePath:"你想怎麼做？", pathA:"換個角度看它（轉念）", pathB:"寫一個新的信念（替換）",
    getAIPerspective:"讓 AI 給我幾個角度", getAIBelief:"讓 AI 幫我想新信念",
    copyPrompt:"複製提示詞", promptCopied:"已複製 ✓",
    cooldown:"冷卻中", yourVersion:"或自己寫",
    yourPerspectivePlaceholder:"自己的新角度…", yourBeliefPlaceholder:"自己的新信念…",
    choiceSaved:"已儲存 ✓",
    practiceTitle:"在生活中怎麼活出新角度", addRecord:"+ 新增紀錄",
    recordEvent:"這次發生了什麼？", recordReaction:"我的反應",
    dirNew:"用了新角度", dirOld:"沒用上", dirMixed:"一半一半", saveRecord:"儲存紀錄",
    filterRef:"篩選器參考", alignScore:"言行一致度", beliefResult:"篩選結果", importedAt:"帶入時間",
    historyTitle:"評估歷史", noHistory:"還沒有評估記錄", noNote:"（沒有備註）",
    saveEdit:"儲存",
    deleted:"信念已刪除", undo:"復原", imported:"已帶入", bringIn:"帶入",
    noFilterData:"沒有找到篩選器的信念記錄",
    loading:"AI 分析中…", aiError:"AI 回應失敗，請重試", aiNotConfigured:"AI 功能尚未啟用（需設定 API key）", retry:"重試",
    deleteYes:"刪除", deleteNo:"取消",
    noBeliefs:"還沒有信念。點右下角 + 新增第一個。",
    factsN:"事實 {n}", recordsN:"紀錄 {n}",
    statBadge_5:"✓ 滋養", statBadge_4:"滋養", statBadge_3:"一半一半",
    statBadge_2:"消耗", statBadge_1:"傷害", statBadge_unsure:"不確定", statBadge_none:"還沒評估",
    importTitle:"匯入信念", importDesc:"選擇從此工具匯出的 JSON 檔案", importSuccess:"匯入成功 ✓", importError:"檔案格式錯誤，請確認是本工具匯出的 JSON",
    filterImportDesc:"選擇從篩選器匯出的 JSON 檔案",
    exportAll_json:"匯出備份", exportAll_md:"匯出筆記", exportThis_md:"匯出此信念筆記",
    dropOrClick:"拖放檔案至此或點擊選擇",
    unsupportedFormat:"不支援的檔案格式。本工具只接受信念覺察工具的匯出檔，或人生篩選器的備份檔（backup）。",
    parseError:"檔案格式錯誤，無法解析",
    emptyBeliefs:"檔案中沒有可匯入的信念",
    noFilterBeliefs:"此備份檔不含信念類記錄",
    importPreviewTitle:"匯入信念覺察工具備份",
    importTotal:"總共 {n} 筆信念",
    importConflict:"其中 {m} 筆與現有資料衝突",
    conflictHandling:"衝突處理方式",
    conflictOverwrite:"用匯入版覆蓋本地版",
    conflictSkip:"保留本地版，跳過匯入版",
    conflictKeepBoth:"兩者都保留",
    conflictList:"衝突清單",
    applySettings:"同時套用備份的設定",
    filterImportTitle:"從人生篩選器匯入信念",
    filterImportFound:"找到 {n} 筆 belief 類記錄",
    selectAll:"全選", deselectAll:"全不選",
    alreadyExists:"已存在",
    confirmImport:"確認匯入",
    importedToast_zh:"已匯入 {n} 筆信念",
    importedBadge:"匯入",
    confirmDeleteEval:"確定刪除這筆評估？",
    deleteBtn:"刪除",
    settings:"設定",
    section_language:"語言",
    section_appearance:"外觀",
    section_data:"資料管理",
    section_account:"帳號",
    section_reset:"重設所有資料",
    resetBtn:"重設",
    confirmReset:"確定要刪除所有資料嗎？此動作無法復原",
    confirmResetBtn:"確定刪除",
    logout:"登出",
    syncStatus_synced:"已同步", syncStatus_syncing:"同步中…", syncStatus_offline:"離線", syncStatus_loading:"載入中…", syncStatus_error:"同步失敗",
    syncErrorToast:"同步失敗，已自動重試中", aiAnalysisDone:"AI 分析完成",
  },
  ja: {
    appTitle:"ビリーフ・アウェアネス", about:"このツールについて", export:"エクスポート", importBtn:"インポート",
    allBeliefs:"すべて", nourishing:"糧になる", balanced:"半々", draining:"消耗している",
    unsure:"わからない", unevaluated:"未評価", transforming:"書き換え中",
    addBelief:"ビリーフを追加", cancel:"キャンセル", back:"戻る",
    guideQ:"記録したいビリーフについて、どのくらいはっきりしていますか？",
    guideA:"ビリーフがわかっている", guideB:"出来事を分析したい", guideC:"フィルターから持ってくる",
    guideDescA:"ビリーフを直接入力する", guideDescB:"出来事を入力して、AIに背後のビリーフを探してもらう", guideDescC:"フィルターのビリーフを取り込む（先にフィルターからJSONをエクスポートする必要があります）",
    changeEntry:"入力方法を変える",
    beliefPlaceholder:"このビリーフは？（例：頑張れば必ず報われる）",
    createBelief:"ビリーフを作成", eventDesc:"何が起きましたか？", myReaction:"私の反応・気持ち",
    analyzeWithAI:"AIに背後のビリーフを分析してもらう",
    selectBeliefs:"作成するビリーフを選んでください（複数可）", selectHint:"ピンときたものをタップ。複数選べます。",
    addSelected:"選んだビリーフを追加",
    source_direct:"直接入力", source_filter:"フィルターから", source_event:"出来事から",
    block1:"ビリーフと事実", block2:"評価", block3:"気づき", block4:"書き換え",
    editBelief:"編集", editFact:"編集", supportingFacts:"このビリーフを支持する事実",
    factPlaceholder:"このビリーフを支持する事実を入力…",
    howAffect:"どう影響していますか？",
    score1:"害になっている", score2:"消耗の方が多い", score3:"半々", score4:"助けの方が多い", score5:"糧になる", scoreUnsure:"わからない",
    whyScore:"なぜ？（任意）", whyPlaceholder:"書きたければ書く、書かなくてもOKです！",
    saveEval:"評価を保存", evalHistory:"評価 {n} 回", seeHistory:"履歴を表示",
    awarenessPrompt:"どう影響していますか？助けになっていますか、それとも消耗していますか？",
    awarenessPromptUnsure:"ゆっくりで大丈夫です。どう影響していますか？助けになっていますか、消耗していますか？",
    awarenessPlaceholder:"自由に書いてください…",
    transformHint_nourishing:"現在の評価は「糧になる」。違う視点や新しいビリーフを試すこともできます。",
    transformHint_balanced:"違う角度で見てみますか？または新しいビリーフを書きますか？→",
    transformHint_draining:"違う角度で見てみますか？または新しいビリーフを書きますか？→",
    transformHint_unsure:"まず気づきを深めましょう。書き換えを試すこともできます。",
    transformHint_unevaluated:"まず気づきを深めましょう。書き換えを試すこともできます。",
    tryIt:"試してみる →", stopTransform:"書き換えを中止",
    choosePath:"どうしたいですか？", pathA:"違う角度で見る（リフレーミング）", pathB:"新しいビリーフを書く（置き換え）",
    getAIPerspective:"AIから視点をもらう", getAIBelief:"AIに新しいビリーフを提案してもらう",
    copyPrompt:"プロンプトをコピー", promptCopied:"コピー済み ✓",
    cooldown:"クールダウン中", yourVersion:"自分の言葉で書く",
    yourPerspectivePlaceholder:"自分の新しい視点…", yourBeliefPlaceholder:"自分の新しいビリーフ…",
    choiceSaved:"保存済み ✓",
    practiceTitle:"新しい視点を日常で体現する", addRecord:"+ 記録を追加",
    recordEvent:"今回何が起きましたか？", recordReaction:"私の反応",
    dirNew:"新しい視点を使えた", dirOld:"使えなかった", dirMixed:"半々", saveRecord:"記録を保存",
    filterRef:"フィルター参照", alignScore:"一致スコア", beliefResult:"フィルター結果", importedAt:"取り込み日時",
    historyTitle:"評価履歴", noHistory:"まだ評価記録がありません", noNote:"（メモなし）",
    saveEdit:"保存",
    deleted:"ビリーフを削除しました", undo:"元に戻す", imported:"取り込み済み", bringIn:"取り込む",
    noFilterData:"フィルターのビリーフ記録が見つかりません",
    loading:"AI分析中…", aiError:"AIの応答に失敗しました。再試行してください", aiNotConfigured:"AI機能は現在利用できません（APIキーが必要です）", retry:"再試行",
    deleteYes:"削除", deleteNo:"キャンセル",
    noBeliefs:"まだビリーフがありません。右下の + で最初のビリーフを追加してください。",
    factsN:"事実 {n}", recordsN:"記録 {n}",
    statBadge_5:"✓ 力に", statBadge_4:"糧になる", statBadge_3:"半々",
    statBadge_2:"消耗", statBadge_1:"害に", statBadge_unsure:"わからない", statBadge_none:"未評価",
    importTitle:"ビリーフをインポート", importDesc:"このツールからエクスポートしたJSONファイルを選択", importSuccess:"インポート成功 ✓", importError:"ファイル形式が正しくありません",
    filterImportDesc:"フィルターからエクスポートしたJSONファイルを選択してください",
    exportAll_json:"バックアップ", exportAll_md:"ノートとして出力", exportThis_md:"このビリーフをノート出力",
    dropOrClick:"ファイルをドラッグまたはクリックして選択",
    unsupportedFormat:"サポートされていないファイル形式。このツールはビリーフ・アウェアネスツールのエクスポートファイル、またはライフフィルターのバックアップファイル（backup）のみ受け付けます。",
    parseError:"ファイル形式エラー、解析できません",
    emptyBeliefs:"ファイルにインポート可能なビリーフがありません",
    noFilterBeliefs:"このバックアップファイルにはビリーフカテゴリの記録が含まれていません",
    importPreviewTitle:"ビリーフ・アウェアネスツールバックアップをインポート",
    importTotal:"合計 {n} 件のビリーフ",
    importConflict:"うち {m} 件が既存データと競合",
    conflictHandling:"競合の処理方法",
    conflictOverwrite:"インポート版で上書き",
    conflictSkip:"ローカル版を保持（スキップ）",
    conflictKeepBoth:"両方を保持",
    conflictList:"競合リスト",
    applySettings:"バックアップの設定も適用",
    filterImportTitle:"人生フィルターからビリーフをインポート",
    filterImportFound:"ビリーフカテゴリの記録を {n} 件見つかりました",
    selectAll:"すべて選択", deselectAll:"すべて解除",
    alreadyExists:"既存",
    confirmImport:"インポート確定",
    importedToast_ja:"{n} 件のビリーフをインポートしました",
    importedBadge:"インポート",
    confirmDeleteEval:"この評価を削除しますか？",
    deleteBtn:"削除",
    settings:"設定",
    section_language:"言語",
    section_appearance:"テーマ",
    section_data:"データ管理",
    section_account:"アカウント",
    section_reset:"すべてのデータをリセット",
    resetBtn:"リセット",
    confirmReset:"すべてのデータを削除しますか？この操作は取り消せません",
    confirmResetBtn:"削除する",
    logout:"ログアウト",
    syncStatus_synced:"同期済み", syncStatus_syncing:"同期中…", syncStatus_offline:"オフライン", syncStatus_loading:"読み込み中…", syncStatus_error:"同期エラー",
    syncErrorToast:"同期に失敗しました。自動再試行中", aiAnalysisDone:"AI分析が完了しました",
  }
};

function scoreColor(score, th) {
  if(score===4||score===5) return th.accent;
  if(score===1||score===2) return th.coral;
  return th.t3;
}
function dirColor(dir, th) {
  if(dir==="new") return th.accent;
  if(dir==="old") return th.coral;
  return th.t3;
}

const TK = "ba-v2-theme";
function ldTheme() { try { const v = localStorage.getItem(TK); return THEMES[v] ? v : "d1"; } catch { return "d1"; } }
function svTheme(k) { try { localStorage.setItem(TK, k); } catch {} }

const gid = (p) => p+"_"+Date.now()+"_"+Math.random().toString(36).slice(2,7);
const now = () => new Date().toISOString();
const fmt = (iso) => { const d=new Date(iso); return d.getFullYear()+"/"+String(d.getMonth()+1).padStart(2,"0")+"/"+String(d.getDate()).padStart(2,"0"); };
const getStatus = (b) => { const e=b.evaluations[b.evaluations.length-1]; if(!e) return "unevaluated"; if(e.isUnsure) return "unsure"; if(e.score>=4) return "nourishing"; if(e.score<=2) return "draining"; return "balanced"; };

function useDebounce(fn, ms) {
  const t = useRef(null); const f = useRef(fn); f.current = fn;
  return useCallback((...a) => { clearTimeout(t.current); t.current = setTimeout(()=>f.current(...a), ms); }, [ms]);
}

// ── Toast Context ─────────────────────────────────────────────────────────────
const ToastContext = createContext(null);
function useToast() { return useContext(ToastContext); }

let toastIdCounter = 0;

function ToastProvider({ children, th }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});
  const pausedRef = useRef(false);
  const sh = getShadows(th);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  const removeToast = useCallback((id) => {
    clearTimeout(timersRef.current[id]);
    delete timersRef.current[id];
    setToasts(p => p.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((opts) => {
    // opts: { variant: "neutral"|"error"|"action", msg, actionLabel, onAction, duration? }
    const duration = opts.duration ?? (opts.variant === "error" ? 5000 : opts.variant === "action" ? 8000 : 3000);
    const id = ++toastIdCounter;
    const toast = { id, variant: opts.variant || "neutral", msg: opts.msg, actionLabel: opts.actionLabel, onAction: opts.onAction, duration, remaining: duration, startedAt: Date.now() };

    setToasts(p => {
      let next = [...p, toast];
      // max 3: drop oldest non-error first, then oldest error
      if (next.length > 3) {
        const neutralIdx = next.findIndex(t => t.variant === "neutral");
        if (neutralIdx >= 0) { clearTimeout(timersRef.current[next[neutralIdx].id]); delete timersRef.current[next[neutralIdx].id]; next.splice(neutralIdx, 1); }
        else { clearTimeout(timersRef.current[next[0].id]); delete timersRef.current[next[0].id]; next.shift(); }
      }
      return next;
    });

    const scheduleRemoval = (ms) => {
      timersRef.current[id] = setTimeout(() => removeToast(id), ms);
    };
    scheduleRemoval(duration);

    return id;
  }, [removeToast]);

  // Pause on window blur
  useEffect(() => {
    const onBlur = () => {
      pausedRef.current = true;
      setToasts(p => p.map(t => {
        const elapsed = Date.now() - (t.startedAt || Date.now());
        clearTimeout(timersRef.current[t.id]);
        return { ...t, remaining: Math.max(0, t.remaining - elapsed) };
      }));
    };
    const onFocus = () => {
      pausedRef.current = false;
      setToasts(p => p.map(t => {
        if (t.remaining > 0) {
          timersRef.current[t.id] = setTimeout(() => removeToast(t.id), t.remaining);
        }
        return { ...t, startedAt: Date.now() };
      }));
    };
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => { window.removeEventListener("blur", onBlur); window.removeEventListener("focus", onFocus); };
  }, [removeToast]);

  // Pause on desktop hover
  const pauseAll = () => {
    if (typeof window !== "undefined" && window.innerWidth < 640) return;
    setToasts(p => p.map(t => {
      const elapsed = Date.now() - (t.startedAt || Date.now());
      clearTimeout(timersRef.current[t.id]);
      return { ...t, remaining: Math.max(0, t.remaining - elapsed) };
    }));
  };
  const resumeAll = () => {
    if (typeof window !== "undefined" && window.innerWidth < 640) return;
    setToasts(p => p.map(t => {
      if (t.remaining > 0) {
        timersRef.current[t.id] = setTimeout(() => removeToast(t.id), t.remaining);
      }
      return { ...t, startedAt: Date.now() };
    }));
  };

  const pos = isMobile
    ? { position:"fixed", bottom:"calc(env(safe-area-inset-bottom, 0px) + 16px)", left:"16px", right:"16px", zIndex:3000, display:"flex", flexDirection:"column", gap:8 }
    : { position:"fixed", top:72, right:24, zIndex:3000, display:"flex", flexDirection:"column", gap:8, width:380, maxWidth:"calc(100vw - 48px)" };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div style={pos} onMouseEnter={pauseAll} onMouseLeave={resumeAll}>
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} th={th} sh={sh} onRemove={removeToast} isMobile={isMobile}/>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, th, sh, onRemove, isMobile }) {
  const isError = toast.variant === "error";
  const iconColor = isError ? th.coral : th.accent;
  return (
    <div role="alert" aria-live="polite" style={{
      background: th.bgCard, borderRadius:8, padding:"12px 16px",
      display:"flex", alignItems:"flex-start", gap:10,
      boxShadow: isDark(th) ? "0 4px 16px rgba(0,0,0,0.4)" : sh.xl,
      border:"0.5px solid "+th.border,
      animation:"toastIn 250ms cubic-bezier(0,0,0.2,1)",
      maxWidth: isMobile ? "100%" : 380, minWidth: 240,
    }}>
      {/* Icon */}
      <div style={{flexShrink:0,marginTop:1}}>
        {isError
          ? <svg viewBox="0 0 16 16" width={16} height={16}><path d="M8 2L14 13H2L8 2Z" fill="none" stroke={th.coral} strokeWidth="1.5" strokeLinejoin="round"/><line x1="8" y1="7" x2="8" y2="10" stroke={th.coral} strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="12" r="0.8" fill={th.coral}/></svg>
          : <svg viewBox="0 0 16 16" width={16} height={16}><circle cx="8" cy="8" r="6" fill="none" stroke={th.accent} strokeWidth="1.5"/><line x1="8" y1="5" x2="8" y2="9" stroke={th.accent} strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="11.5" r="0.8" fill={th.accent}/></svg>
        }
      </div>
      {/* Message */}
      <span style={{flex:1,color:th.t1,fontSize:14,lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{toast.msg}</span>
      {/* Action button */}
      {toast.variant === "action" && toast.actionLabel && (
        <button onClick={()=>{ toast.onAction?.(); onRemove(toast.id); }}
          style={{flexShrink:0,background:"none",border:"none",cursor:"pointer",color:th.accent,fontSize:13,fontWeight:600,padding:"0 4px",minHeight:44,display:"flex",alignItems:"center"}}>
          {toast.actionLabel}
        </button>
      )}
      {/* Close */}
      <button onClick={()=>onRemove(toast.id)} aria-label="閉じる"
        style={{flexShrink:0,background:"none",border:"none",cursor:"pointer",color:th.t3,padding:4,display:"flex",alignItems:"center",width:24,height:24,justifyContent:"center",marginTop:-2}}
        onMouseEnter={e=>e.currentTarget.style.color=th.t2}
        onMouseLeave={e=>e.currentTarget.style.color=th.t3}>
        <X size={14}/>
      </button>
    </div>
  );
}

// ── Spinner SVG ───────────────────────────────────────────────────────────────
function Spinner({ size=20, color }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} style={{animation:"spin 1s linear infinite",flexShrink:0}}>
      <circle cx="8" cy="8" r="6" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray="28" strokeDashoffset="10"/>
    </svg>
  );
}

// ── AI ────────────────────────────────────────────────────────────────────────
async function callAI(prompt) {
  const r = await fetch("/.netlify/functions/ai", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
  });
  const d = await r.json();
  if (d.error === "AI_NOT_CONFIGURED") throw new Error("AI_NOT_CONFIGURED");
  if (!r.ok || !d.content) throw new Error();
  return JSON.parse(d.content.map(b=>b.text||"").join("").replace(/```json|```/g,"").trim());
}
const JB = String.fromCharCode(123)+'"beliefs":['+String.fromCharCode(123)+'"text":"...","explanation":"..."'+String.fromCharCode(125)+']}';
const JP = String.fromCharCode(123)+'"perspectives":['+String.fromCharCode(123)+'"text":"...","explanation":"..."'+String.fromCharCode(125)+']}';
const pEvent = (ev,rx,l) => l==="ja"
  ? "私は出来事を経験しました。背後にあるビリーフを3〜5個分析してください。\n出来事："+ev+"\n反応："+rx+"\n一人称、簡潔、多様で中立。各ビリーフを改行で区切り、番号や記号なしでテキストのみ返してください。"
  : "我經歷了一個事件，請分析3-5個背後的信念。\n事件："+ev+"\n反應："+rx+"\n一人稱、簡潔、多樣化、中性。每個信念單獨一行，不加編號或符號，只回傳純文字。";
const pPersp = (b,s,n,a,l) => l==="ja"
  ? "ビリーフを変えずに違う視点を3〜5個提案してください。\n元のビリーフ："+b+"\n評価："+(s!==null&&s!==undefined?s:"不明")+"/5、"+(n||"なし")+"\n気づき："+(a||"なし")+"\n各視点を改行で区切り、番号や記号なしでテキストのみ返してください。"
  : "幫使用者換個角度看信念，給3-5個不同視角。\n原信念："+b+"\n評估："+(s!==null&&s!==undefined?s:"不確定")+"/5，"+(n||"無")+"\n覺察："+(a||"無")+"\n每個視角單獨一行，不加編號或符號，只回傳純文字。";
const pReplace = (b,s,n,a,l) => l==="ja"
  ? "ユーザーが置き換えたいビリーフについて新しいビリーフを3〜5個提案してください。\n元のビリーフ："+b+"\n評価："+(s!==null&&s!==undefined?s:"不明")+"/5、"+(n||"なし")+"\n気づき："+(a||"なし")+"\n各ビリーフを改行で区切り、番号や記号なしでテキストのみ返してください。"
  : "幫使用者想3-5個替換的新信念。\n原信念："+b+"\n評估："+(s!==null&&s!==undefined?s:"不確定")+"/5，"+(n||"無")+"\n覺察："+(a||"無")+"\n每個信念單獨一行，不加編號或符號，只回傳純文字。";
const buildCopyPrompt = (type,belief,cur,awareness,lang) => {
  const s=cur?.isUnsure?null:cur?.score??null, n=cur?.note||"", a=awareness||"";
  return type==="perspective"?pPersp(belief,s,n,a,lang):pReplace(belief,s,n,a,lang);
};

// ── Export ────────────────────────────────────────────────────────────────────
function exportJSON(beliefs, settings) {
  const data = { type:"belief-awareness", version:"v2.0", exportedAt:now(), settings, beliefs };
  const blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download="belief-awareness-v3_"+new Date().toISOString().slice(0,10)+".json"; a.click(); URL.revokeObjectURL(url);
}
const SC_LABELS_ZH = {1:"傷害我",2:"消耗多於幫助",3:"一半一半",4:"幫助多於消耗",5:"滋養我"};
const SC_LABELS_JA = {1:"害になっている",2:"消耗の方が多い",3:"半々",4:"助けの方が多い",5:"糧になる"};
const DIR_LABELS_ZH = {new:"用了新角度",old:"沒用上",mixed:"一半一半"};
const DIR_LABELS_JA = {new:"新しい視点を使えた",old:"使えなかった",mixed:"半々"};
function beliefToMD(b, lang) {
  const isZh = lang !== "ja";
  const scl = isZh ? SC_LABELS_ZH : SC_LABELS_JA;
  const dirl = isZh ? DIR_LABELS_ZH : DIR_LABELS_JA;
  const srcMap = isZh ? {direct:"直接輸入",filter:"從篩選器",event:"從事件反推"} : {direct:"直接入力",filter:"フィルターから",event:"出来事から"};
  const last = b.evaluations[b.evaluations.length-1]||null;
  const scoreLabel = last ? (last.isUnsure ? (isZh?"不確定":"わからない") : last.score+"（"+(scl[last.score]||"")+"）") : (isZh?"還沒評估":"未評価");
  const fmtDate = iso => { const d=new Date(iso); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); };
  let md = "**"+(isZh?"狀態":"状態")+"**："+scoreLabel+" · **"+(isZh?"來源":"出典")+"**："+(srcMap[b.source]||b.source)+" · **"+(isZh?"建立":"作成")+"**："+fmtDate(b.createdAt)+"\n\n";
  if (b.evidence.length > 0) { md += "### "+(isZh?"支持這個信念的事實":"このビリーフを支持する事実")+"\n"; b.evidence.forEach(e => { md += "- "+e.text+"\n"; }); md += "\n"; }
  if (b.evaluations.length > 0) {
    md += "### "+(isZh?"評估歷史":"評価履歴")+"\n";
    b.evaluations.forEach(ev => { const sl = ev.isUnsure ? (isZh?"不確定":"わからない") : ev.score+"（"+(scl[ev.score]||"")+"）"; md += "- "+fmtDate(ev.createdAt)+" · **"+sl+"**"+(ev.note ? " — 「"+ev.note+"」" : "")+"\n"; });
    md += "\n";
  }
  if (b.awareness.note) { md += "### "+(isZh?"覺察":"気づき")+"\n"+b.awareness.note+"\n\n"; }
  const tr = b.transform;
  if (tr.perspectiveText || tr.newBelief || (tr.records && tr.records.length > 0)) {
    md += "### "+(isZh?"轉化":"書き換え")+"\n";
    if (tr.perspectiveText) md += "**"+(isZh?"新角度":"新しい視点")+"**："+tr.perspectiveText+"\n";
    if (tr.newBelief) md += "**"+(isZh?"新信念":"新しいビリーフ")+"**："+tr.newBelief+"\n";
    if (tr.records && tr.records.length > 0) { md += "\n**"+(isZh?"紀錄":"記録")+"**：\n"; tr.records.forEach((r,i) => { md += (i+1)+". "+fmtDate(r.createdAt)+" · "+(dirl[r.direction]||r.direction)+(r.event ? " — "+r.event : "")+"\n"; }); }
    md += "\n";
  }
  if (b.filterRef) {
    md += "### "+(isZh?"來自篩選器":"フィルターから")+"\n";
    if (b.filterRef.alignScore !== undefined && b.filterRef.alignScore !== null) md += (isZh?"言行一致度":"一致スコア")+" "+b.filterRef.alignScore+"/5";
    if (b.filterRef.result) md += " · "+(isZh?"結果":"結果")+"："+b.filterRef.result;
    md += "\n\n";
  }
  return md;
}
function exportAllMD(beliefs, lang) {
  const isZh = lang !== "ja";
  const fmtDate = iso => { const d=new Date(iso); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); };
  let md = "# "+(isZh?"信念覺察紀錄":"ビリーフ・アウェアネス記録")+"\n"+(isZh?"匯出時間":"エクスポート日時")+"："+fmtDate(now())+"\n\n---\n\n";
  beliefs.forEach(b => { md += "## 「"+b.belief+"」\n"; md += beliefToMD(b, lang); md += "---\n\n"; });
  const blob = new Blob([md],{type:"text/markdown;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download="belief-awareness_"+new Date().toISOString().slice(0,10)+".md"; a.click(); URL.revokeObjectURL(url);
}
function exportSingleMD(b, lang) {
  let md = "# 「"+b.belief+"」\n\n"; md += beliefToMD(b, lang);
  const safe = b.belief.replace(/[^\u4e00-\u9fa5\u3040-\u30ff\u3400-\u4dbfa-zA-Z0-9]/g,"_").slice(0,10);
  const fmtDate = iso => new Date(iso).toISOString().slice(0,10);
  const blob = new Blob([md],{type:"text/markdown;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download="belief_"+safe+"_"+fmtDate(now())+".md"; a.click(); URL.revokeObjectURL(url);
}

// ── AutoGrow Textarea ─────────────────────────────────────────────────────────
function AutoTextarea({ value, onChange, placeholder, style, onKeyDown, minRows=2, disabled, readOnly }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.height = "auto"; el.style.height = el.scrollHeight + "px";
  }, [value]);
  return (
    <textarea ref={ref} value={value} onChange={onChange} onKeyDown={onKeyDown} placeholder={placeholder}
      rows={minRows} disabled={disabled} readOnly={readOnly}
      style={{ ...style, resize:"none", overflow:"hidden",
        cursor: disabled ? "not-allowed" : readOnly ? "default" : undefined,
        opacity: disabled ? 0.4 : 1,
      }}
    />
  );
}

function AboutContent({ th, t, lang }) {
  const isZh = lang !== "ja";
  const blocks = isZh
    ? [{title:"① 信念與事實",desc:"找出信念，記錄支持它的事實"},{title:"② 評估",desc:"目前覺得它對你是幫助還是消耗（判斷會變，所以有歷史）"},{title:"③ 覺察",desc:"看它的兩面——幫助了什麼？消耗了什麼？"},{title:"④ 轉化",desc:"換個角度看它，或寫一個新的信念，AI 會幫你想"}]
    : [{title:"① ビリーフと事実",desc:"ビリーフを見つけ、それを支持する事実を記録する"},{title:"② 評価",desc:"今、それがあなたに助けか消耗か（判断は変わる、だから履歴がある）"},{title:"③ 気づき",desc:"両面を見る——何を助けている？何を消耗している？"},{title:"④ 書き換え",desc:"違う角度で見るか、新しいビリーフを書く。AIが手伝います"}];
  const scoreRows = isZh
    ? [["5","滋養我"],["4","幫助多於消耗"],["3","一半一半"],["2","消耗多於幫助"],["1","傷害我"],["?","不確定"]]
    : [["5","糧になる"],["4","助けの方が多い"],["3","半々"],["2","消耗の方が多い"],["1","害になっている"],["?","わからない"]];
  const scoreColors = { "5":scoreColor(5,th),"4":scoreColor(4,th),"3":scoreColor(3,th),"2":scoreColor(2,th),"1":scoreColor(1,th),"?":th.t3 };
  const intro1 = isZh ? "信念本身沒有好壞，只看它目前對你的影響是幫助還是消耗。" : "ビリーフ自体に良い悪いはなく、今のあなたへの影響が助けになっているか消耗しているかだけを見ます。";
  const intro2 = isZh ? "這個工具不告訴你哪些信念該改、哪些該留，而是陪你持續觀察信念跟你的關係。" : "このツールはどのビリーフを変えるべきか教えるものではなく、ビリーフとあなたの関係を継続的に観察する場所です。";
  const tagline = isZh ? "它不是要修正你，而是幫你看見自己。" : "あなたを直すためではなく、自分自身を見つめさせるための場所です。";
  return (
    <div>
      <p style={{color:th.t2,fontSize:14,lineHeight:1.8,margin:"0 0 12px"}}>{intro1}</p>
      <p style={{color:th.t2,fontSize:14,lineHeight:1.8,margin:"0 0 20px"}}>{intro2}</p>
      <p style={{color:th.t1,fontWeight:600,fontSize:13,margin:"0 0 12px"}}>{isZh?"四個區塊":"四つのブロック"}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
        {blocks.map((b,i)=>(
          <div key={i} style={{background:th.bgDeep,border:"0.5px solid "+th.border,borderRadius:8,padding:12}}>
            <div style={{color:th.accent,fontSize:12,fontWeight:600,marginBottom:4}}>{b.title}</div>
            <div style={{color:th.t3,fontSize:12,lineHeight:1.5}}>{b.desc}</div>
          </div>
        ))}
      </div>
      <p style={{color:th.t1,fontWeight:600,fontSize:13,margin:"0 0 12px"}}>{isZh?"評分標準":"評価基準"}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
        {scoreRows.map(([num,label])=>(
          <div key={num} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:4,background:th.bgDeep}}>
            <span style={{color:scoreColors[num]||th.t3,fontSize:15,fontWeight:700,minWidth:16,textAlign:"center"}}>{num}</span>
            <span style={{color:th.t2,fontSize:12}}>{label}</span>
          </div>
        ))}
      </div>
      <p style={{color:th.t3,fontSize:13,lineHeight:1.8,textAlign:"center",fontStyle:"italic",padding:"10px 0 14px"}}>{tagline}</p>
      <p style={{color:th.t3,fontSize:11,textAlign:"center",margin:0}}>v4.0</p>
    </div>
  );
}

// ── SyncDot ───────────────────────────────────────────────────────────────────
function SyncDot({ status, t, th, showLabel=false }) {
  const [showTip, setShowTip] = useState(false);
  const [stuckLoading, setStuckLoading] = useState(false);
  const stuckTimer = useRef(null);

  // If loading/syncing for more than 12s, show error state
  useEffect(() => {
    if(status === "syncing" || status === "loading") {
      stuckTimer.current = setTimeout(() => setStuckLoading(true), 12000);
    } else {
      clearTimeout(stuckTimer.current);
      setStuckLoading(false);
    }
    return () => clearTimeout(stuckTimer.current);
  }, [status]);

  const effectiveStatus = stuckLoading ? "error" : status;

  if(effectiveStatus === "synced") {
    if(showLabel) {
      return (
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:7,height:7,borderRadius:9999,background:"#4EAD88",flexShrink:0}}/>
          <span style={{color:th.t3,fontSize:12}}>{t.syncStatus_synced}</span>
        </div>
      );
    }
    return (
      <div style={{position:"relative",flexShrink:0}} onMouseEnter={()=>setShowTip(true)} onMouseLeave={()=>setShowTip(false)}>
        <div style={{width:7,height:7,borderRadius:9999,background:"#4EAD88",flexShrink:0,cursor:"default"}}/>
        {showTip&&(
          <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,background:th.bgCard,border:"0.5px solid "+th.border,borderRadius:8,padding:"6px 10px",fontSize:12,color:th.t2,whiteSpace:"nowrap",zIndex:500,boxShadow:"0 4px 12px rgba(0,0,0,0.15)"}}>
            {t.syncStatus_synced}
          </div>
        )}
      </div>
    );
  }
  if(effectiveStatus === "syncing" || effectiveStatus === "loading") {
    if(showLabel) {
      return (
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <Spinner size={12} color={th.t3}/>
          <span style={{color:th.t3,fontSize:12}}>{effectiveStatus === "loading" ? t.syncStatus_loading : t.syncStatus_syncing}</span>
        </div>
      );
    }
    return (
      <div style={{display:"flex",alignItems:"center",width:18,height:18,flexShrink:0}}>
        <Spinner size={14} color={th.t2}/>
      </div>
    );
  }
  if(effectiveStatus === "error") {
    if(showLabel) {
      return (
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:7,height:7,borderRadius:9999,background:th.coral,flexShrink:0}}/>
          <span style={{color:th.coral,fontSize:12}}>{t.syncStatus_error}</span>
        </div>
      );
    }
    return (
      <div style={{position:"relative",flexShrink:0}}>
        <button onClick={()=>setShowTip(v=>!v)} style={{background:"none",border:"none",cursor:"pointer",padding:2,display:"flex",alignItems:"center"}}>
          <svg viewBox="0 0 16 16" width={16} height={16}>
            <path d="M8 2L14 13H2L8 2Z" fill="none" stroke={th.coral} strokeWidth="1.5" strokeLinejoin="round"/>
            <line x1="8" y1="7" x2="8" y2="10" stroke={th.coral} strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="8" cy="12" r="0.8" fill={th.coral}/>
          </svg>
        </button>
        {showTip&&(
          <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,background:th.bgCard,border:"0.5px solid "+th.border,borderRadius:8,padding:"8px 12px",fontSize:12,color:th.coral,whiteSpace:"nowrap",zIndex:500,boxShadow:"0 4px 12px rgba(0,0,0,0.15)"}}>
            {t.syncStatus_error}
          </div>
        )}
      </div>
    );
  }
  // offline
  if(showLabel) {
    return (
      <div style={{display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:7,height:7,borderRadius:9999,background:th.t3,flexShrink:0}}/>
        <span style={{color:th.t3,fontSize:12}}>{t.syncStatus_offline}</span>
      </div>
    );
  }
  return <div style={{width:7,height:7,borderRadius:9999,background:th.t3,flexShrink:0}}/>;
}

// ── Header ────────────────────────────────────────────────────────────────────
function Header({ th, t, settings, onSettings, onAbout, onHistory, showHistory, left, title, onExport, onImport, onExportMD, onExportSingleMD, onResetAll, user, onLogout, syncStatus }) {
  const [drawerOpen,setDrawerOpen]=useState(false);
  const [confirmReset,setConfirmReset]=useState(false);
  const [aboutOpen,setAboutOpen]=useState(false);
  const drawerRef=useRef(null);
  const sh = getShadows(th);
  const [isMobile,setIsMobile]=useState(()=>typeof window!=="undefined"&&window.innerWidth<640);
  useEffect(()=>{
    const fn=()=>setIsMobile(window.innerWidth<640);
    window.addEventListener("resize",fn);
    return()=>window.removeEventListener("resize",fn);
  },[]);
  useEffect(()=>{
    if(!drawerOpen) return;
    const fn=e=>{ if(e.key==="Escape"){setDrawerOpen(false);setConfirmReset(false);} };
    document.addEventListener("keydown",fn);
    return()=>document.removeEventListener("keydown",fn);
  },[drawerOpen]);

  function handleReset(){ onResetAll&&onResetAll(); setDrawerOpen(false); setConfirmReset(false); }
  function closeDrawer(){ setDrawerOpen(false); setConfirmReset(false); }

  const ib={background:"none",border:"none",cursor:"pointer",color:th.t3,padding:4,display:"flex",alignItems:"center"};
  const sb={background:"none",border:"0.5px solid "+th.border,borderRadius:8,cursor:"pointer",color:th.t2,padding:"4px 8px",fontSize:12,display:"flex",alignItems:"center",gap:4};
  const fullBtn={width:"100%",display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:8,background:"none",border:"0.5px solid "+th.border,cursor:"pointer",color:th.t2,fontSize:13,marginBottom:8,textAlign:"left",boxSizing:"border-box"};
  const secLabel={color:th.t3,fontSize:11,fontWeight:600,marginBottom:8,display:"block",letterSpacing:"0.04em"};
  const secDiv={borderBottom:"0.5px solid "+th.border,paddingBottom:16,marginBottom:16};
  const langBtnStyle=(l)=>({flex:1,padding:"8px 0",borderRadius:8,border:"0.5px solid "+(settings.lang===l?th.accent:th.border),background:settings.lang===l?th.accent:"transparent",color:settings.lang===l?th.accentText:th.t2,cursor:"pointer",fontSize:13,fontWeight:settings.lang===l?600:400,transition:"all 150ms cubic-bezier(0,0,0.2,1)"});

  const DrawerBody = (
    <>
      <div onClick={closeDrawer} style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.45)"}}/>
      <div ref={drawerRef} className="themed-scroll" style={{position:"fixed",top:0,right:0,bottom:0,zIndex:201,width:280,background:th.bgCard,borderLeft:"0.5px solid "+th.border,overflowY:"auto",display:"flex",flexDirection:"column",boxShadow:sh.lg}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:"0.5px solid "+th.border,flexShrink:0}}>
          <span style={{color:th.t1,fontWeight:600,fontSize:15}}>{t.settings}</span>
          <button onClick={closeDrawer} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,padding:4,display:"flex"}}><X size={18}/></button>
        </div>
        <div style={{padding:20,flex:1}}>
          {isMobile&&(
            <div style={secDiv}>
              {onAbout&&<button onClick={()=>{closeDrawer();setAboutOpen(true);}} style={fullBtn}><Info size={14}/>{t.about}</button>}
              {showHistory&&onHistory&&<button onClick={()=>{closeDrawer();onHistory();}} style={fullBtn}><Clock size={14}/>{t.historyTitle}</button>}
              {onExportSingleMD&&<button onClick={()=>{closeDrawer();onExportSingleMD();}} style={fullBtn}><Download size={14}/>{t.exportThis_md}</button>}
            </div>
          )}
          <div style={secDiv}>
            <span style={secLabel}>{t.section_language}</span>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>onSettings({...settings,lang:"zh"})} style={langBtnStyle("zh")}>中文</button>
              <button onClick={()=>onSettings({...settings,lang:"ja"})} style={langBtnStyle("ja")}>日本語</button>
            </div>
          </div>
          <div style={secDiv}>
            <span style={secLabel}>{t.section_appearance}</span>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {Object.entries(THEMES).map(([k,v])=>{
                const isSelected=settings.theme===k;
                return(
                  <button key={k} onClick={()=>onSettings({...settings,theme:k})} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:8,border:(isSelected?"1.5px":"0.5px")+" solid "+(isSelected?v.accent:th.border),background:isSelected?v.accent+"18":th.bgDeep,cursor:"pointer",transition:"all 150ms cubic-bezier(0,0,0.2,1)",textAlign:"left",boxShadow:isSelected&&!isDark(th)?sh.sm:"none"}}>
                    <div style={{width:24,height:24,borderRadius:9999,background:v.bg,border:"0.5px solid "+(isSelected?v.accent:th.border),flexShrink:0}}/>
                    <span style={{color:isSelected?v.accent:th.t2,fontSize:12,fontWeight:isSelected?600:400,lineHeight:1.3}}>{settings.lang==="ja"?v.nameJa:v.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div style={secDiv}>
            <span style={secLabel}>{t.section_data}</span>
            <button onClick={()=>onExport&&onExport()} style={fullBtn}><Download size={14}/>{t.exportAll_json}</button>
            <button onClick={()=>onExportMD&&onExportMD()} style={fullBtn}><Download size={14}/>{t.exportAll_md}</button>
            <button onClick={()=>{closeDrawer();onImport&&onImport();}} style={{...fullBtn,marginBottom:0}}><Upload size={14}/>{t.importBtn}</button>
          </div>
          <div style={secDiv}>
            <span style={secLabel}>{t.section_account}</span>
            {user&&(
              <div style={{marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  {user.photoURL
                    ?<img src={user.photoURL} style={{width:32,height:32,borderRadius:9999,flexShrink:0}} alt="avatar"/>
                    :<div style={{width:32,height:32,borderRadius:9999,background:th.accent+"33",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><User size={16} color={th.accent}/></div>
                  }
                  <div>
                    <div style={{color:th.t1,fontSize:13,fontWeight:500}}>{user.displayName||"—"}</div>
                    <div style={{color:th.t3,fontSize:11}}>{user.email}</div>
                  </div>
                </div>
                <SyncDot status={syncStatus} t={t} th={th} showLabel={true}/>
              </div>
            )}
            <button onClick={()=>{closeDrawer();onLogout&&onLogout();}} style={{...fullBtn,marginBottom:0,color:th.coral,borderColor:th.coral+"66"}}>
              <LogOut size={14}/>{t.logout}
            </button>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <span style={{...secLabel,color:th.coral}}>{t.section_reset}</span>
            {!confirmReset
              ?<button onClick={()=>setConfirmReset(true)} style={{background:"none",border:"0.5px solid "+th.coral,borderRadius:9999,cursor:"pointer",color:th.coral,padding:"8px 20px",fontSize:13}}>{t.resetBtn}</button>
              :<div>
                <p style={{color:th.coral,fontSize:13,margin:"0 0 12px",lineHeight:1.5}}>⚠ {t.confirmReset}</p>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setConfirmReset(false)} style={{flex:1,padding:"8px 0",borderRadius:9999,border:"0.5px solid "+th.borderHover,background:"none",cursor:"pointer",color:th.t1,fontSize:13}}>{t.cancel}</button>
                  <button onClick={handleReset} style={{flex:1,padding:"8px 0",borderRadius:9999,border:"none",background:th.coral,cursor:"pointer",color:"#fff",fontSize:13,fontWeight:600}}>{t.confirmResetBtn}</button>
                </div>
              </div>
            }
          </div>
        </div>
        <div style={{padding:"12px 20px",borderTop:"0.5px solid "+th.border,flexShrink:0}}/>
      </div>
    </>
  );

  return (
    <>
      <div style={{position:"sticky",top:0,zIndex:100,background:th.bg,borderBottom:"0.5px solid "+th.border,padding:"0 12px",display:"flex",alignItems:"center",gap:8,height:56,flexShrink:0,boxShadow:!isDark(th)?sh.md:"none"}}>
        {left}
        <span style={{color:th.t1,fontWeight:600,fontSize:15,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{title}</span>
        {!isMobile&&(
          <>
            {user&&syncStatus&&<SyncDot status={syncStatus} t={t} th={th}/>}
            {showHistory&&<button onClick={onHistory} style={ib}><Clock size={18}/></button>}
            {onExportSingleMD&&<button onClick={onExportSingleMD} style={sb}><Download size={13}/>{t.exportThis_md}</button>}
            <button onClick={()=>{setDrawerOpen(v=>!v);setConfirmReset(false);}}
              style={{...ib,background:drawerOpen?th.accent+"22":"none",border:"0.5px solid "+(drawerOpen?th.accent:th.border),color:drawerOpen?th.accent:th.t2,borderRadius:8,padding:6}}>
              <Settings size={18}/>
            </button>
            <button onClick={()=>setAboutOpen(true)} style={ib}><Info size={18}/></button>
          </>
        )}
        {isMobile&&(
          <>
            {user&&syncStatus&&<SyncDot status={syncStatus} t={t} th={th}/>}
            <button onClick={()=>{setDrawerOpen(v=>!v);setConfirmReset(false);}}
              style={{width:32,height:32,borderRadius:9999,background:drawerOpen?th.accent+"22":"none",border:"0.5px solid "+(drawerOpen?th.accent:th.border),cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <svg viewBox="0 0 18 18" width={18} height={18} fill="none">
                <line x1="3" y1="5" x2="15" y2="5" stroke={drawerOpen?th.accent:th.t2} strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="3" y1="9" x2="15" y2="9" stroke={drawerOpen?th.accent:th.t2} strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="3" y1="13" x2="15" y2="13" stroke={drawerOpen?th.accent:th.t2} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </>
        )}
      </div>
      {drawerOpen&&DrawerBody}
      <Modal open={aboutOpen} onClose={()=>setAboutOpen(false)} title={t.about} th={th}>
        <AboutContent th={th} t={t} lang={settings.lang}/>
      </Modal>
    </>
  );
}

function Modal({ open, onClose, title, th, children }) {
  const sh = getShadows(th);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const isTablet = typeof window !== "undefined" && window.innerWidth >= 640 && window.innerWidth <= 1024;
  useEffect(()=>{ if(!open) return; const fn=e=>{if(e.key==="Escape")onClose();}; document.addEventListener("keydown",fn); return()=>document.removeEventListener("keydown",fn); },[open,onClose]);
  if(!open) return null;
  if(isMobile) {
    return (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:2000}}>
        <div onClick={e=>e.stopPropagation()} className="themed-scroll" style={{position:"absolute",inset:0,background:th.bgCard,padding:24,overflowY:"auto",display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <span style={{color:th.t1,fontWeight:600,fontSize:14}}>{title}</span>
            <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,padding:4,display:"flex"}}><X size={18}/></button>
          </div>
          {children}
        </div>
      </div>
    );
  }
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} className="themed-scroll" style={{background:th.bgCard,border:"0.5px solid "+th.border,borderRadius:12,padding:24,maxWidth:isTablet?"80%":500,width:"100%",maxHeight:"82vh",overflowY:"auto",boxShadow:sh.lg}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <span style={{color:th.t1,fontWeight:600,fontSize:16}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,padding:4,display:"flex"}}><X size={18}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ImportModal({ open, onClose, th, t, lang, beliefs, onImport, settings }) {
  const [dragOver,setDragOver]=useState(false);
  const [parsed,setParsed]=useState(null);
  const [err,setErr]=useState(null);
  const [conflictMode,setConflictMode]=useState("keepBoth");
  const [applySettings,setApplySettings]=useState(false);
  const [filterSel,setFilterSel]=useState({});
  const [conflictOpen,setConflictOpen]=useState(false);
  const fileRef=useRef(null);
  const sh = getShadows(th);
  const { showToast } = useToast();

  useEffect(()=>{ if(!open){setParsed(null);setErr(null);setConflictMode("keepBoth");setApplySettings(false);setFilterSel({});setConflictOpen(false);} },[open]);
  useEffect(()=>{ if(!open) return; const fn=e=>{if(e.key==="Escape")onClose();}; document.addEventListener("keydown",fn); return()=>document.removeEventListener("keydown",fn); },[open,onClose]);

  function processFile(file) {
    if(!file) return;
    const reader=new FileReader();
    reader.onload=e=>{
      try {
        const data=JSON.parse(e.target.result);
        if(data.type==="belief-awareness"&&data.version==="v2.0") {
          if(!Array.isArray(data.beliefs)||data.beliefs.length===0){setErr(t.emptyBeliefs);return;}
          setParsed({type:"own",data});setErr(null);
        } else if(data.type==="backup"&&(data.version==="v9"||data.version==="v10")) {
          const recs=Array.isArray(data.filterRecords)?data.filterRecords.filter(r=>r.catId==="belief"):[];
          if(recs.length===0){setErr(t.noFilterBeliefs);return;}
          const importedIds=new Set(beliefs.filter(b=>b.filterRef).map(b=>b.filterRef?.recordId));
          const sel={};
          recs.forEach(r=>{ const rid=r.id||r.recordId||String(r); sel[rid]=!importedIds.has(rid); });
          setFilterSel(sel);
          setParsed({type:"filter",data,recs});setErr(null);
        } else { setErr(t.unsupportedFormat); }
      } catch{ setErr(t.parseError); }
    };
    reader.readAsText(file);
  }

  function handleDrop(e){ e.preventDefault();setDragOver(false); const f=e.dataTransfer.files[0]; if(f)processFile(f); }
  function handleFile(e){ const f=e.target.files[0]; if(f)processFile(f); e.target.value=""; }

  function doImport() {
    if(!parsed) return;
    let count = 0;
    if(parsed.type==="own") {
      const incoming=parsed.data.beliefs;
      const existingIds=new Set(beliefs.map(b=>b.id));
      const conflicts=incoming.filter(b=>existingIds.has(b.id));
      let newBeliefs=[...beliefs];
      if(conflicts.length===0||conflictMode==="overwrite") {
        const map=new Map(newBeliefs.map(b=>[b.id,b]));
        incoming.forEach(b=>map.set(b.id,b));
        newBeliefs=Array.from(map.values());
      } else if(conflictMode==="skip") {
        const existSet=new Set(beliefs.map(b=>b.id));
        incoming.forEach(b=>{ if(!existSet.has(b.id)) newBeliefs.push(b); });
      } else {
        const existSet=new Set(beliefs.map(b=>b.id));
        incoming.forEach(b=>{
          if(!existSet.has(b.id)) newBeliefs.push(b);
          else { const newId="b_"+Date.now()+"_"+Math.random().toString(36).slice(2,7); newBeliefs.push({...b,id:newId,importedAt:new Date().toISOString()}); }
        });
      }
      const newSettings=applySettings&&parsed.data.settings?parsed.data.settings:null;
      count = incoming.length;
      onImport(newBeliefs, newSettings, count);
    } else {
      const recs=parsed.recs;
      const toImport=recs.filter(r=>{const rid=r.id||r.recordId||String(r);return filterSel[rid];});
      const newBs=toImport.map(r=>{
        const rid=r.id||r.recordId||String(r);
        const text=r.item||r.text||r.belief||r.name||"";
        return {id:"b_"+Date.now()+"_"+Math.random().toString(36).slice(2,7),belief:text,source:"filter",
          createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),
          evidence:[],evaluations:[],awareness:{note:""},
          transform:{wantToTransform:false,path:null,perspectiveText:"",newBelief:"",aiSuggestions:{perspective:[],replace:[]},records:[]},
          filterRef:{recordId:rid,item:text,alignScore:r.alignScore??null,beliefChoice:r.beliefChoice??null,result:r.result??null,answers:r.answers??null,importedAt:new Date().toISOString()},
          importedAt:new Date().toISOString()};
      });
      count = newBs.length;
      onImport([...beliefs,...newBs], null, count);
    }
    onClose();
    const msg = lang==="ja" ? t.importedToast_ja.replace("{n}",count) : t.importedToast_zh.replace("{n}",count);
    showToast({ variant:"neutral", msg });
  }

  if(!open) return null;
  const conflicts=parsed?.type==="own"?parsed.data.beliefs.filter(b=>beliefs.some(x=>x.id===b.id)):[];
  const fmtDate=iso=>{const d=new Date(iso);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");};
  const importedIds=new Set(beliefs.filter(b=>b.filterRef).map(b=>b.filterRef?.recordId));
  const btnP={background:th.accent,color:th.accentText,border:"none",borderRadius:9999,padding:"9px 20px",fontSize:13,fontWeight:600,cursor:"pointer",boxShadow:sh.sm};
  const btnS={background:"none",border:"0.5px solid "+th.borderHover,borderRadius:9999,padding:"9px 20px",fontSize:13,color:th.t1,cursor:"pointer"};
  const radioRow=(val,label)=>(
    <label key={val} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",marginBottom:8}}>
      <input type="radio" name="conflict" value={val} checked={conflictMode===val} onChange={()=>setConflictMode(val)} style={{accentColor:th.accent}}/>
      <span style={{color:th.t2,fontSize:13}}>{label}</span>
    </label>
  );
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const isTablet = typeof window !== "undefined" && window.innerWidth >= 640 && window.innerWidth <= 1024;

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:2000,display:"flex",alignItems:isMobile?"flex-end":"center",justifyContent:"center",padding:isMobile?0:16}}>
      <div onClick={e=>e.stopPropagation()} className="themed-scroll" style={{background:th.bgCard,border:isMobile?"none":"0.5px solid "+th.border,borderRadius:isMobile?0:12,padding:24,maxWidth:isMobile?"100%":isTablet?"80%":500,width:"100%",maxHeight:isMobile?"100dvh":"85vh",overflowY:"auto",boxShadow:isMobile?"none":sh.lg}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <span style={{color:th.t1,fontWeight:600,fontSize:16}}>{t.importTitle}</span>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,padding:4,display:"flex"}}><X size={18}/></button>
        </div>
        {!parsed&&(
          <>
            <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={handleDrop} onClick={()=>fileRef.current?.click()}
              style={{border:"1.5px dashed "+(dragOver?th.accent:th.border),borderRadius:12,padding:"32px 20px",textAlign:"center",cursor:"pointer",background:dragOver?th.accent+"11":"transparent",transition:"all 150ms cubic-bezier(0,0,0.2,1)",marginBottom:16}}>
              <Upload size={28} color={th.t3} style={{margin:"0 auto 8px",display:"block"}}/>
              <p style={{color:th.t3,fontSize:13,margin:0}}>{t.dropOrClick}</p>
            </div>
            <input ref={fileRef} type="file" accept=".json" style={{display:"none"}} onChange={handleFile}/>
            {err&&<p style={{color:th.coral,fontSize:13,marginTop:0,marginBottom:0}}>{err}</p>}
          </>
        )}
        {parsed?.type==="own"&&(
          <div>
            <p style={{color:th.t2,fontSize:14,marginBottom:4,fontWeight:600}}>{t.importPreviewTitle}</p>
            <p style={{color:th.t3,fontSize:13,marginBottom:4}}>{t.importTotal.replace("{n}",parsed.data.beliefs.length)}</p>
            {conflicts.length>0&&<p style={{color:"#E0AC48",fontSize:13,marginBottom:12}}>{t.importConflict.replace("{m}",conflicts.length)}</p>}
            {conflicts.length>0&&(
              <div style={{marginBottom:12}}>
                <p style={{color:th.t2,fontSize:13,fontWeight:600,marginBottom:8}}>{t.conflictHandling}</p>
                {radioRow("overwrite",t.conflictOverwrite)}
                {radioRow("skip",t.conflictSkip)}
                {radioRow("keepBoth",t.conflictKeepBoth)}
                <div style={{marginTop:8}}>
                  <button onClick={()=>setConflictOpen(v=>!v)} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,fontSize:12,padding:0,display:"flex",alignItems:"center",gap:4}}>
                    {conflictOpen?<ChevronUp size={12}/>:<ChevronDown size={12}/>}{t.conflictList}
                  </button>
                  {conflictOpen&&<div style={{marginTop:8,paddingLeft:12}}>{conflicts.map(b=><div key={b.id} style={{color:th.t3,fontSize:12,marginBottom:4}}>- 「{b.belief}」</div>)}</div>}
                </div>
              </div>
            )}
            {parsed.data.settings&&(
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",marginBottom:12}}>
                <input type="checkbox" checked={applySettings} onChange={e=>setApplySettings(e.target.checked)} style={{accentColor:th.accent}}/>
                <span style={{color:th.t2,fontSize:13}}>{t.applySettings}（{parsed.data.settings.theme||"—"} · {parsed.data.settings.lang||"—"}）</span>
              </label>
            )}
          </div>
        )}
        {parsed?.type==="filter"&&(
          <div>
            <p style={{color:th.t2,fontSize:14,marginBottom:4,fontWeight:600}}>{t.filterImportTitle}</p>
            <p style={{color:th.t3,fontSize:13,marginBottom:12}}>{t.filterImportFound.replace("{n}",parsed.recs.length)}</p>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <button onClick={()=>{const s={};parsed.recs.forEach(r=>{const rid=r.id||r.recordId||String(r);s[rid]=true;});setFilterSel(s);}} style={{background:"none",border:"0.5px solid "+th.border,borderRadius:8,cursor:"pointer",color:th.t3,padding:"4px 8px",fontSize:12}}>{t.selectAll}</button>
              <button onClick={()=>{const s={};parsed.recs.forEach(r=>{const rid=r.id||r.recordId||String(r);s[rid]=false;});setFilterSel(s);}} style={{background:"none",border:"0.5px solid "+th.border,borderRadius:8,cursor:"pointer",color:th.t3,padding:"4px 8px",fontSize:12}}>{t.deselectAll}</button>
            </div>
            <div style={{maxHeight:280,overflowY:"auto"}}>
              {parsed.recs.map((r,i)=>{
                const rid=r.id||r.recordId||String(i);
                const text=r.item||r.text||r.belief||r.name||"(?)";
                const already=importedIds.has(rid);
                return (
                  <label key={rid} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:8,cursor:"pointer",marginBottom:4,background:filterSel[rid]?th.accent+"15":"transparent",border:"0.5px solid "+(filterSel[rid]?th.accent:th.border)}}>
                    <input type="checkbox" checked={!!filterSel[rid]} onChange={e=>{setFilterSel(p=>({...p,[rid]:e.target.checked}));}} style={{accentColor:th.accent,flexShrink:0}}/>
                    <span style={{flex:1,color:th.t1,fontSize:13}}>{text}</span>
                    {r.createdAt&&<span style={{color:th.t3,fontSize:11,flexShrink:0}}>{fmtDate(r.createdAt)}</span>}
                    {already&&<span style={{color:"#E0AC48",fontSize:11,flexShrink:0}}>⚠ {t.alreadyExists}</span>}
                  </label>
                );
              })}
            </div>
          </div>
        )}
        {parsed&&(
          <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:16}}>
            <button onClick={()=>{setParsed(null);setErr(null);}} style={btnS}>{t.cancel}</button>
            <button onClick={doImport} style={btnP}>{t.confirmImport}</button>
          </div>
        )}
        {!parsed&&!err&&(<div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}><button onClick={onClose} style={btnS}>{t.cancel}</button></div>)}
        {!parsed&&err&&(<div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}><button onClick={()=>{setParsed(null);setErr(null);}} style={btnS}>{t.cancel}</button></div>)}
      </div>
    </div>
  );
}

function ScoreBadge({ belief, t, th }) {
  const s=getStatus(belief);
  const last=belief.evaluations[belief.evaluations.length-1];
  if(s==="nourishing") {
    const c=BADGE_COLORS.nourishing;
    const label=last?.score===5?t.statBadge_5:t.statBadge_4;
    return <span style={{fontSize:11,border:"0.5px solid "+c.border,borderRadius:4,padding:"2px 8px",color:c.text}}>{label}</span>;
  }
  if(s==="draining") { const c=BADGE_COLORS.draining; return <span style={{fontSize:11,border:"0.5px solid "+c.border,borderRadius:4,padding:"2px 8px",color:c.text}}>{t.statBadge_2}</span>; }
  if(s==="balanced") { const c=BADGE_COLORS.watching; return <span style={{fontSize:11,border:"0.5px solid "+c.border,borderRadius:4,padding:"2px 8px",color:c.text}}>{t.statBadge_3}</span>; }
  if(s==="unsure") return <span style={{fontSize:11,border:"0.5px solid "+th.border,borderRadius:4,padding:"2px 8px",color:th.t3}}>{t.statBadge_unsure}</span>;
  return <span style={{fontSize:11,border:"0.5px solid "+th.border,borderRadius:4,padding:"2px 8px",color:th.t3}}>{t.statBadge_none}</span>;
}

// ── ListView ──────────────────────────────────────────────────────────────────
function ListView({ th, t, settings, onSettings, beliefs, onSelect, onDelete, onAdd, onExport, onImport, onExportMD, onResetAll, user, onLogout, syncStatus, deletedBelief, onUndo }) {
  const [filter,setFilter]=useState("all");
  const sh = getShadows(th);
  const { showToast } = useToast();
  const tabs=["all","nourishing","balanced","draining","unsure","unevaluated"];
  const filtered=filter==="all"?beliefs:beliefs.filter(b=>getStatus(b)===filter);
  return (
    <div style={{background:th.bg,minHeight:"100dvh",color:th.t1,display:"flex",flexDirection:"column"}}>
      <Header th={th} t={t} settings={settings} onSettings={onSettings} title={t.appTitle} onAbout={()=>{}} onExport={onExport} onImport={onImport} onExportMD={onExportMD} onResetAll={onResetAll} user={user} onLogout={onLogout} syncStatus={syncStatus}/>
      <div style={{overflowX:"auto",borderBottom:"0.5px solid "+th.border,flexShrink:0,scrollbarWidth:"none",msOverflowStyle:"none"}} className="hide-scrollbar">
        <div style={{display:"flex",gap:0,padding:"0 16px",justifyContent:"center",minWidth:"max-content"}}>
          {tabs.map(tab=>(
            <button key={tab} onClick={()=>setFilter(tab)} style={{
              background:filter===tab?th.bgCard:"transparent",
              border:filter===tab?"0.5px solid "+th.border:"none",
              borderBottom:filter===tab?"0.5px solid "+th.bgCard:"none",
              borderRadius:"12px 12px 0 0",
              padding:"10px 14px",cursor:"pointer",
              color:filter===tab?th.accent:th.t3,
              fontSize:12,fontWeight:filter===tab?600:400,
              whiteSpace:"nowrap",transition:"all 150ms cubic-bezier(0,0,0.2,1)",marginBottom:"-0.5px"
            }}>
              {t[tab==="all"?"allBeliefs":tab]}
            </button>
          ))}
        </div>
      </div>
      <div style={{padding:"8px 16px 100px"}}>
        {filtered.length===0&&<div style={{textAlign:"center",color:th.t3,fontSize:13,marginTop:48}}>{t.noBeliefs}</div>}
        {filtered.map(b=><BeliefCard key={b.id} belief={b} th={th} t={t} sh={sh} onSelect={onSelect} onDelete={onDelete}/>)}
      </div>
      <button onClick={onAdd} style={{position:"fixed",bottom:24,right:24,width:56,height:56,borderRadius:9999,background:th.accent,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:sh.md,zIndex:50}}>
        <Plus size={24} color={th.accentText}/>
      </button>
    </div>
  );
}

function BeliefCard({ belief, th, t, sh, onSelect, onDelete }) {
  const [conf,setConf]=useState(false), [hov,setHov]=useState(false);
  const isTouch=useRef(typeof window!=="undefined"&&window.matchMedia("(pointer:coarse)").matches).current;
  const showDel=isTouch||hov;
  return (
    <div onMouseEnter={()=>!isTouch&&setHov(true)} onMouseLeave={()=>{if(!isTouch){setHov(false);setConf(false);}}} onClick={()=>{if(!conf)onSelect(belief.id);}}
      style={{background:th.bgCard,border:"0.5px solid "+(hov?th.borderHover:th.border),borderRadius:12,padding:"14px 16px",marginBottom:8,cursor:"pointer",transition:"border-color 150ms cubic-bezier(0,0,0.2,1), box-shadow 150ms cubic-bezier(0,0,0.2,1)",boxShadow:hov?sh.md:sh.sm}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
        <div style={{flex:1,overflow:"hidden"}}>
          <p style={{color:th.t1,fontSize:14,margin:"0 0 8px",lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>「{belief.belief}」</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,alignItems:"center"}}>
            <ScoreBadge belief={belief} t={t} th={th}/>
            {belief.importedAt&&<span style={{fontSize:10,color:th.accent,border:"0.5px solid "+th.accent,borderRadius:4,padding:"1px 6px"}}>{t.importedBadge}</span>}
            {belief.transform.wantToTransform&&<span style={{fontSize:11,color:th.accent,border:"0.5px solid "+th.accent,borderRadius:4,padding:"2px 6px"}}>{t.transforming}</span>}
            {(belief.evidence.length>0||belief.transform.records.length>0)&&<span style={{fontSize:11,color:th.t3}}>{belief.evidence.length>0?t.factsN.replace("{n}",belief.evidence.length):""}{belief.evidence.length>0&&belief.transform.records.length>0?" · ":""}{belief.transform.records.length>0?t.recordsN.replace("{n}",belief.transform.records.length):""}</span>}
          </div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
          {showDel&&!conf&&<button onClick={e=>{e.stopPropagation();setConf(true);}} style={{background:"none",border:"0.5px solid "+th.border,borderRadius:8,cursor:"pointer",color:th.t3,padding:"4px 6px",display:"flex"}}><Trash2 size={14}/></button>}
          {conf&&<div style={{display:"flex",gap:6}} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>onDelete(belief.id)} style={{background:th.coral,color:"#fff",border:"none",borderRadius:9999,cursor:"pointer",padding:"4px 12px",fontSize:12,fontWeight:600}}>{t.deleteYes}</button>
            <button onClick={()=>setConf(false)} style={{background:"none",border:"0.5px solid "+th.borderHover,borderRadius:9999,cursor:"pointer",color:th.t1,padding:"4px 10px",fontSize:12}}>{t.deleteNo}</button>
          </div>}
        </div>
      </div>
    </div>
  );
}

// ── AddView ───────────────────────────────────────────────────────────────────
function AddView({ th, t, settings, onSettings, beliefs, onCreate, onBack, onResetAll, user, onLogout, syncStatus }) {
  const [step,setStep]=useState("guide"), [directText,setDirectText]=useState("");
  const [evDesc,setEvDesc]=useState(""), [evReact,setEvReact]=useState("");
  const [aiBeliefs,setAiBeliefs]=useState(null), [selected,setSelected]=useState([]);
  const [loading,setLoading]=useState(false), [filterRecs,setFilterRecs]=useState([]), [filterFile,setFilterFile]=useState(null);
  const [copyEventPromptDone,setCopyEventPromptDone]=useState(false);
  const fileRef=useRef(null);
  const importedRef=useRef(new Set(beliefs.filter(b=>b.filterRef).map(b=>b.filterRef?.recordId)));
  const sh = getShadows(th);
  const { showToast } = useToast();

  function make(text,source,filterRef=null,ev=null) {
    const b={id:gid("b"),belief:text.trim(),source,createdAt:now(),updatedAt:now(),
      evidence:ev?[{id:gid("e"),text:ev,createdAt:now()}]:[],evaluations:[],awareness:{note:""},
      transform:{wantToTransform:false,path:null,perspectiveText:"",newBelief:"",aiSuggestions:{perspective:[],replace:[]},records:[]},filterRef};
    onCreate(b);
  }
  async function doAI() {
    setLoading(true);
    try { const d=await callAI(pEvent(evDesc,evReact,settings.lang)); setAiBeliefs(d.beliefs||[]); }
    catch(e){
      const msg = e?.message==="AI_NOT_CONFIGURED" ? t.aiNotConfigured : t.aiError;
      showToast({ variant:"error", msg, duration:8000, actionLabel:t.retry, onAction:doAI });
    }
    finally{ setLoading(false); }
  }
  function handleFilterFile(file) {
    if(!file) return;
    const reader=new FileReader();
    reader.onload=e=>{ try{ const data=JSON.parse(e.target.result); const recs=Array.isArray(data)?data:(data.records||data.beliefs||data.items||[]); setFilterRecs(recs); setFilterFile(file.name); }catch{ showToast({variant:"error",msg:t.importError||"格式錯誤"}); } };
    reader.readAsText(file);
  }
  function copyEventPrompt() {
    const prompt = pEvent(evDesc, evReact, settings.lang);
    navigator.clipboard.writeText(prompt).then(()=>{ setCopyEventPromptDone(true); setTimeout(()=>setCopyEventPromptDone(false),2000); });
  }

  const inp={width:"100%",background:th.bgDeep,border:"0.5px solid "+th.border,borderRadius:8,color:th.t1,padding:"12px 14px",fontSize:14,outline:"none",boxSizing:"border-box",lineHeight:1.6,fontFamily:"inherit"};
  const btnP={background:th.accent,color:th.accentText,border:"none",borderRadius:9999,padding:"11px 24px",fontSize:14,fontWeight:600,cursor:"pointer",boxShadow:sh.sm};
  const btnC={background:th.cancelBg,color:th.cancelText,border:"none",borderRadius:9999,padding:"11px 20px",fontSize:13,fontWeight:600,cursor:"pointer",boxShadow:sh.sm};
  const btnS={background:"none",border:"0.5px solid "+th.borderHover,borderRadius:9999,padding:"11px 20px",fontSize:13,color:th.t1,cursor:"pointer"};
  const guides=[
    {id:"direct",label:t.guideA,desc:t.guideDescA,icon:<Edit3 size={20}/>},
    {id:"event",label:t.guideB,desc:t.guideDescB,icon:<Sparkles size={20}/>},
    {id:"filter",label:t.guideC,desc:t.guideDescC,icon:<Filter size={20}/>},
  ];

  // canCallAI: 未輸入時 disabled
  const canAI = evDesc.trim() || evReact.trim();

  return (
    <div style={{background:th.bg,minHeight:"100dvh",color:th.t1}}>
      <Header th={th} t={t} settings={settings} onSettings={onSettings} onAbout={()=>{}}
        left={<button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:th.t2,display:"flex",alignItems:"center",gap:4,padding:"4px 0",fontSize:14,flexShrink:0}}><ArrowLeft size={16}/>{t.back}</button>}
        title={t.addBelief} onResetAll={onResetAll} user={user} onLogout={onLogout} syncStatus={syncStatus}/>
      <div style={{padding:20,maxWidth:600,margin:"0 auto"}}>
        {step==="guide"&&(<>
          <p style={{color:th.t2,fontSize:15,margin:"0 0 20px",lineHeight:1.7}}>{t.guideQ}</p>
          {guides.map(g=>(
            <button key={g.id} onClick={()=>setStep(g.id)}
              style={{display:"flex",alignItems:"flex-start",gap:16,background:th.bgCard,border:"0.5px solid "+th.border,borderRadius:12,padding:"16px 20px",cursor:"pointer",textAlign:"left",width:"100%",marginBottom:12,transition:"border-color 150ms cubic-bezier(0,0,0.2,1), box-shadow 150ms cubic-bezier(0,0,0.2,1)",boxShadow:sh.sm}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=th.accent;e.currentTarget.style.boxShadow=sh.md;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=th.border;e.currentTarget.style.boxShadow=sh.sm;}}>
              <span style={{color:th.accent,marginTop:2,flexShrink:0}}>{g.icon}</span>
              <div><div style={{color:th.t1,fontWeight:600,fontSize:15,marginBottom:4}}>{g.label}</div><div style={{color:th.t3,fontSize:13}}>{g.desc}</div></div>
            </button>
          ))}
        </>)}

        {step==="direct"&&(<>
          <button onClick={()=>setStep("guide")} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,fontSize:13,padding:0,marginBottom:16,display:"flex",alignItems:"center",gap:4}}><ArrowLeft size={13}/>{t.changeEntry}</button>
          <AutoTextarea value={directText} onChange={e=>setDirectText(e.target.value)} placeholder={t.beliefPlaceholder} minRows={3} style={inp}/>
          <div style={{display:"flex",justifyContent:"flex-end",marginTop:12}}>
            <button onClick={()=>{if(directText.trim()){make(directText,"direct");onBack();}}}
              disabled={!directText.trim()}
              aria-disabled={!directText.trim()}
              style={{...btnP,opacity:directText.trim()?1:0.4,cursor:directText.trim()?"pointer":"not-allowed"}}>
              {t.createBelief}
            </button>
          </div>
        </>)}

        {step==="event"&&!aiBeliefs&&(<>
          <button onClick={()=>setStep("guide")} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,fontSize:13,padding:0,marginBottom:16,display:"flex",alignItems:"center",gap:4}}><ArrowLeft size={13}/>{t.changeEntry}</button>
          <label style={{color:th.t2,fontSize:13,display:"block",marginBottom:8}}>{t.eventDesc}</label>
          <AutoTextarea value={evDesc} onChange={e=>setEvDesc(e.target.value)} minRows={3} style={{...inp,marginBottom:16}}/>
          <label style={{color:th.t2,fontSize:13,display:"block",marginBottom:8}}>{t.myReaction}</label>
          <AutoTextarea value={evReact} onChange={e=>setEvReact(e.target.value)} minRows={3} style={{...inp,marginBottom:16}}/>
          <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
            <button onClick={doAI}
              disabled={loading||!canAI}
              aria-disabled={loading||!canAI}
              aria-busy={loading}
              style={{...btnP,display:"flex",alignItems:"center",gap:8,opacity:loading?0.8:!canAI?0.4:1,cursor:loading?"wait":!canAI?"not-allowed":"pointer"}}>
              {loading
                ? <><Spinner size={16} color={th.accentText}/>{t.loading}</>
                : <><Sparkles size={16}/>{t.analyzeWithAI}</>
              }
            </button>
          </div>
          <div style={{display:"flex",justifyContent:"center"}}>
            <button onClick={copyEventPrompt} disabled={!canAI}
              style={{...btnS,display:"flex",alignItems:"center",gap:6,opacity:!canAI?0.4:1,cursor:!canAI?"not-allowed":"pointer"}}>
              <Copy size={13}/>{copyEventPromptDone?t.promptCopied:t.copyPrompt}
            </button>
          </div>
        </>)}

        {step==="event"&&aiBeliefs&&(<>
          <p style={{color:th.t2,fontSize:14,margin:"0 0 4px"}}>{t.selectBeliefs}</p>
          <p style={{color:th.t3,fontSize:12,margin:"0 0 16px"}}>{t.selectHint}</p>
          {aiBeliefs.map((item,i)=>{ const isSel=selected.some(s=>s.text===item.text); return (
            <div key={i} onClick={()=>setSelected(p=>isSel?p.filter(s=>s.text!==item.text):[...p,item])}
              style={{background:isSel?th.accent+"22":th.bgCard,border:"0.5px solid "+(isSel?th.accent:th.border),borderRadius:12,padding:"12px 16px",marginBottom:8,cursor:"pointer",transition:"all 150ms cubic-bezier(0,0,0.2,1)",boxShadow:sh.sm}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                <div><p style={{color:th.t1,fontSize:14,margin:"0 0 4px"}}>「{item.text}」</p><p style={{color:th.t3,fontSize:12,margin:0}}>{item.explanation}</p></div>
                {isSel&&<Check size={16} color={th.accent} style={{flexShrink:0,marginTop:2}}/>}
              </div>
            </div>
          );})}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8,gap:8}}>
            <button onClick={()=>{setAiBeliefs(null);setSelected([]);}} style={btnS}><ArrowLeft size={13} style={{verticalAlign:"middle",marginRight:4}}/>{t.changeEntry}</button>
            <button onClick={()=>{selected.forEach(item=>make(item.text,"event",null,evDesc.trim()||null));onBack();}} disabled={selected.length===0}
              style={{...btnP,opacity:selected.length>0?1:0.4,cursor:selected.length>0?"pointer":"not-allowed"}}>{t.addSelected} ({selected.length})</button>
          </div>
        </>)}

        {step==="filter"&&(<>
          <button onClick={()=>setStep("guide")} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,fontSize:13,padding:0,marginBottom:16,display:"flex",alignItems:"center",gap:4}}><ArrowLeft size={13}/>{t.changeEntry}</button>
          {!filterFile?(
            <div style={{textAlign:"center",padding:"40px 20px"}}>
              <p style={{color:th.t2,fontSize:14,marginBottom:16,lineHeight:1.6}}>{t.filterImportDesc}</p>
              <input ref={fileRef} type="file" accept=".json" style={{display:"none"}} onChange={e=>handleFilterFile(e.target.files[0])}/>
              <button onClick={()=>fileRef.current?.click()} style={{...btnP,display:"inline-flex",alignItems:"center",gap:8}}><Upload size={16}/>{t.importBtn}</button>
            </div>
          ):(
            <>
              <p style={{color:th.t3,fontSize:12,marginBottom:12}}>{filterFile}</p>
              {filterRecs.length===0
                ?<div style={{color:th.t3,fontSize:13,textAlign:"center",marginTop:40}}>{t.noFilterData}</div>
                :filterRecs.map((rec,i)=>{ const rid=rec.id||rec.recordId||String(i); const text=rec.item||rec.text||rec.belief||rec.name||"(無)"; const done=importedRef.current.has(rid); return(
                  <div key={rid} style={{background:th.bgCard,border:"0.5px solid "+th.border,borderRadius:12,padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,boxShadow:sh.sm}}>
                    <div style={{flex:1,overflow:"hidden"}}><p style={{color:th.t1,fontSize:14,margin:"0 0 4px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{text}</p>{rec.result&&<span style={{fontSize:11,color:th.t3}}>{rec.result}</span>}</div>
                    {done?<span style={{fontSize:12,color:th.t3,flexShrink:0}}>{t.imported}</span>
                      :<button onClick={()=>{make(text,"filter",{recordId:rid,item:text,alignScore:rec.alignScore||null,result:rec.result||null,importedAt:now()});importedRef.current.add(rid);}} style={{background:th.accent,color:th.accentText,border:"none",borderRadius:9999,padding:"5px 14px",fontSize:12,cursor:"pointer",flexShrink:0}}>{t.bringIn}</button>}
                  </div>
                );})
              }
            </>
          )}
        </>)}
      </div>
    </div>
  );
}

// ── DetailView ────────────────────────────────────────────────────────────────
function DetailView({ th, t, settings, onSettings, belief, onUpdate, onBack, onResetAll, user, onLogout, syncStatus }) {
  const [editB,setEditB]=useState(false), [bDraft,setBDraft]=useState(belief.belief);
  const [newFact,setNewFact]=useState(""), [editFactId,setEditFactId]=useState(null), [editFactText,setEditFactText]=useState("");
  const [evalScore,setEvalScore]=useState(null), [evalUnsure,setEvalUnsure]=useState(false), [evalNote,setEvalNote]=useState("");
  const [editEvalId,setEditEvalId]=useState(null), [editEvalScore,setEditEvalScore]=useState(null), [editEvalUnsure,setEditEvalUnsure]=useState(false), [editEvalNote,setEditEvalNote]=useState("");
  const [deleteEvalId,setDeleteEvalId]=useState(null);
  const [awareness,setAwareness]=useState(belief.awareness.note||"");
  const [expandTr,setExpandTr]=useState(belief.transform.wantToTransform);
  const [aiLoad,setAiLoad]=useState(false), [cd,setCd]=useState(0);
  const [showRec,setShowRec]=useState(false), [recEv,setRecEv]=useState(""), [recRx,setRecRx]=useState(""), [recDir,setRecDir]=useState("new");
  const [fHov,setFHov]=useState(null), [fConf,setFConf]=useState(null);
  const isTouch=useRef(typeof window!=="undefined"&&window.matchMedia("(pointer:coarse)").matches).current;
  const [fltExp,setFltExp]=useState(false), [histOpen,setHistOpen]=useState(false);
  const [saved,setSaved]=useState(false), [copied,setCopied]=useState(false);
  const cdRef=useRef(null);
  const sh = getShadows(th);
  const { showToast } = useToast();

  // All hooks before any conditional returns
  const saveAware=useDebounce(v=>onUpdate(b=>({...b,awareness:{note:v}})),1000);
  useEffect(()=>{ saveAware(awareness); },[awareness]);
  useEffect(()=>{ if(cd<=0) return; cdRef.current=setInterval(()=>setCd(p=>{ if(p<=1){clearInterval(cdRef.current);return 0;} return p-1;}),1000); return()=>clearInterval(cdRef.current); },[cd>0]);

  const cur=belief.evaluations[belief.evaluations.length-1]||null;
  const status=getStatus(belief);

  const inp={width:"100%",background:th.bgDeep,border:"0.5px solid "+th.border,borderRadius:8,color:th.t1,padding:"10px 12px",fontSize:14,outline:"none",boxSizing:"border-box",lineHeight:1.6,fontFamily:"inherit"};
  const blk={background:th.bgCard,border:"0.5px solid "+th.border,borderRadius:12,padding:16,marginBottom:12,boxShadow:sh.sm};
  const btnP={background:th.accent,color:th.accentText,border:"none",borderRadius:9999,padding:"9px 20px",fontSize:13,fontWeight:600,cursor:"pointer",boxShadow:sh.sm};
  const btnC={background:th.cancelBg,color:th.cancelText,border:"none",borderRadius:9999,padding:"9px 20px",fontSize:13,fontWeight:600,cursor:"pointer",boxShadow:sh.sm};
  const btnS={background:"none",border:"0.5px solid "+th.borderHover,borderRadius:9999,padding:"9px 20px",fontSize:13,color:th.t1,cursor:"pointer"};
  const blkL={color:th.accent,fontWeight:600,fontSize:13,display:"block",marginBottom:8};
  const sOpts=[{v:1,l:t.score1},{v:2,l:t.score2},{v:3,l:t.score3},{v:4,l:t.score4},{v:5,l:t.score5}];
  const dOpts=[{id:"new",l:t.dirNew,c:dirColor("new",th)},{id:"old",l:t.dirOld,c:dirColor("old",th)},{id:"mixed",l:t.dirMixed,c:dirColor("mixed",th)}];
  const rStat={new:belief.transform.records.filter(r=>r.direction==="new").length,old:belief.transform.records.filter(r=>r.direction==="old").length,mixed:belief.transform.records.filter(r=>r.direction==="mixed").length};
  const cp=belief.transform.path, ais=belief.transform.aiSuggestions;

  function addFact(){ if(!newFact.trim()) return; onUpdate(b=>({...b,evidence:[...b.evidence,{id:gid("e"),text:newFact.trim(),createdAt:now()}]})); setNewFact(""); }
  function rmFact(id){ onUpdate(b=>({...b,evidence:b.evidence.filter(e=>e.id!==id)})); setFConf(null);setFHov(null); }
  function startEditFact(ev){ setEditFactId(ev.id);setEditFactText(ev.text); }
  function saveEditFact(){ if(!editFactText.trim()) return; onUpdate(b=>({...b,evidence:b.evidence.map(e=>e.id===editFactId?{...e,text:editFactText.trim()}:e)})); setEditFactId(null);setEditFactText(""); }
  function saveEval(){ if(evalScore===null&&!evalUnsure) return; onUpdate(b=>({...b,evaluations:[...b.evaluations,{id:gid("ev"),score:evalUnsure?null:evalScore,isUnsure:evalUnsure,note:evalNote.trim(),createdAt:now()}]})); setEvalScore(null);setEvalUnsure(false);setEvalNote(""); }
  function startEditEval(ev){ setEditEvalId(ev.id);setEditEvalScore(ev.isUnsure?null:ev.score);setEditEvalUnsure(ev.isUnsure||false);setEditEvalNote(ev.note||""); }
  function saveEditEval(){ onUpdate(b=>({...b,evaluations:b.evaluations.map(ev=>ev.id===editEvalId?{...ev,score:editEvalUnsure?null:editEvalScore,isUnsure:editEvalUnsure,note:editEvalNote.trim()}:ev)})); setEditEvalId(null); }
  function deleteEval(id){ onUpdate(b=>({...b,evaluations:b.evaluations.filter(ev=>ev.id!==id)})); setDeleteEvalId(null); }
  function setPath(p){ onUpdate(b=>({...b,transform:{...b.transform,path:p}})); }
  function startTr(){ onUpdate(b=>({...b,transform:{...b.transform,wantToTransform:true}})); setExpandTr(true); }
  function stopTr(){ onUpdate(b=>({...b,transform:{...b.transform,wantToTransform:false}})); setExpandTr(false); }

  async function runAI(type){ if(cd>0||aiLoad) return; setAiLoad(true);
    try{ const s=cur?.isUnsure?null:cur?.score??null,n=cur?.note||"",a=belief.awareness.note||"";
      const d=await callAI(type==="perspective"?pPersp(belief.belief,s,n,a,settings.lang):pReplace(belief.belief,s,n,a,settings.lang));
      onUpdate(b=>({...b,transform:{...b.transform,aiSuggestions:{...b.transform.aiSuggestions,[type]:d.perspectives||d.beliefs||[]}}}));
      setCd(10);
      showToast({ variant:"neutral", msg: t.aiAnalysisDone });
    }catch(e){
      const msg = e?.message==="AI_NOT_CONFIGURED" ? t.aiNotConfigured : t.aiError;
      showToast({ variant:"error", msg, duration:8000, actionLabel:t.retry, onAction:()=>runAI(type) });
    }
    finally{ setAiLoad(false); }
  }

  function copyPrompt(type){ const p=buildCopyPrompt(type,belief.belief,cur,belief.awareness.note,settings.lang); navigator.clipboard.writeText(p).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);}); }
  function saveTrText(field,val){ onUpdate(b=>({...b,transform:{...b.transform,[field]:val}})); setSaved(true);setTimeout(()=>setSaved(false),2000); }
  function addRec(){ if(!recEv.trim()) return; onUpdate(b=>({...b,transform:{...b.transform,records:[...b.transform.records,{id:gid("r"),event:recEv.trim(),reaction:recRx.trim(),direction:recDir,createdAt:now()}]}})); setRecEv("");setRecRx("");setRecDir("new");setShowRec(false); }

  const awPrompt=(evalUnsure||cur?.isUnsure)?t.awarenessPromptUnsure:t.awarenessPrompt;

  // canSaveEval: disabled unless score/unsure selected
  const canSaveEval = evalScore !== null || evalUnsure;

  return (
    <div style={{background:th.bg,minHeight:"100dvh",color:th.t1}}>
      <Header th={th} t={t} settings={settings} onSettings={onSettings} onAbout={()=>{}} onHistory={()=>setHistOpen(true)} showHistory
        left={<button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:th.t2,display:"flex",alignItems:"center",gap:4,padding:"4px 0",fontSize:14,flexShrink:0}}><ArrowLeft size={16}/>{t.back}</button>}
        title={t.appTitle}
        onExportSingleMD={()=>exportSingleMD(belief,settings.lang)}
        onResetAll={onResetAll} user={user} onLogout={onLogout} syncStatus={syncStatus}/>

      <div style={{padding:"12px 16px 100px"}}>
        {/* Block 1 */}
        <div style={blk}>
          <span style={blkL}>{t.block1}</span>
          {editB?(
            <div>
              <AutoTextarea value={bDraft} onChange={e=>setBDraft(e.target.value)} minRows={2} style={{...inp,marginBottom:8}}/>
              <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
                <button onClick={()=>{setBDraft(belief.belief);setEditB(false);}} style={btnS}>{t.cancel}</button>
                <button onClick={()=>{onUpdate(b=>({...b,belief:bDraft.trim()}));setEditB(false);}} style={btnP}><Check size={14}/></button>
              </div>
            </div>
          ):(
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:12}}>
              <p style={{color:th.t1,fontSize:15,margin:0,lineHeight:1.7,flex:1}}>「{belief.belief}」</p>
              <button onClick={()=>setEditB(true)} style={{background:"none",border:"0.5px solid "+th.border,borderRadius:8,cursor:"pointer",color:th.t3,padding:"6px 8px",flexShrink:0,display:"flex",alignItems:"center"}}><Edit3 size={14}/></button>
            </div>
          )}
          <span style={{color:th.t2,fontSize:12,display:"block",marginBottom:8}}>{t.supportingFacts}</span>
          {belief.evidence.length===0&&<p style={{color:th.t3,fontSize:12,margin:"0 0 8px"}}>—</p>}
          {belief.evidence.map(ev=>(
            <div key={ev.id}>
              {editFactId===ev.id?(
                <div style={{background:th.bgDeep,borderRadius:8,padding:"10px 12px",marginBottom:8}}>
                  <AutoTextarea value={editFactText} onChange={e=>setEditFactText(e.target.value)} minRows={1} style={{...inp,marginBottom:8,padding:"8px 10px"}}/>
                  <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
                    <button onClick={()=>setEditFactId(null)} style={{...btnS,padding:"6px 14px",fontSize:12}}>{t.cancel}</button>
                    <button onClick={saveEditFact} style={{...btnP,padding:"6px 14px",fontSize:12}}>{t.saveEdit}</button>
                  </div>
                </div>
              ):(
                <div onMouseEnter={()=>!isTouch&&setFHov(ev.id)} onMouseLeave={()=>{if(!isTouch){setFHov(null);if(fConf===ev.id)setFConf(null);}}}
                  style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:th.bgDeep,borderRadius:8,padding:"9px 12px",marginBottom:8}}>
                  <span style={{color:th.t2,fontSize:13,flex:1,lineHeight:1.5}}>{ev.text}</span>
                  <div style={{display:"flex",gap:4,flexShrink:0,marginLeft:8}}>
                    {(isTouch||fHov===ev.id)&&fConf!==ev.id&&<button onClick={()=>startEditFact(ev)} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,padding:"2px 4px",display:"flex"}}><Edit3 size={13}/></button>}
                    {(isTouch||fHov===ev.id)&&fConf!==ev.id&&<button onClick={()=>setFConf(ev.id)} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,padding:"2px 4px",display:"flex"}}><Trash2 size={13}/></button>}
                    {fConf===ev.id&&<>
                      <button onClick={()=>rmFact(ev.id)} style={{background:th.coral,color:"#fff",border:"none",borderRadius:9999,cursor:"pointer",padding:"2px 12px",fontSize:12,fontWeight:600}}>{t.deleteYes}</button>
                      <button onClick={()=>setFConf(null)} style={{background:"none",border:"0.5px solid "+th.borderHover,borderRadius:9999,cursor:"pointer",color:th.t1,padding:"2px 10px",fontSize:12}}>{t.deleteNo}</button>
                    </>}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <input value={newFact} onChange={e=>setNewFact(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addFact()} placeholder={t.factPlaceholder} style={{flex:1,background:th.bgDeep,border:"0.5px solid "+th.border,borderRadius:8,color:th.t1,padding:"9px 12px",fontSize:14,outline:"none",boxSizing:"border-box"}}/>
            <button onClick={addFact} disabled={!newFact.trim()} style={{...btnP,padding:"9px 14px",opacity:newFact.trim()?1:0.4,flexShrink:0,display:"flex",alignItems:"center",cursor:newFact.trim()?"pointer":"not-allowed"}}><Plus size={16}/></button>
          </div>
        </div>

        {/* Block 2 */}
        <div style={blk}>
          <span style={blkL}>{t.block2}</span>
          <p style={{color:th.t2,fontSize:13,margin:"0 0 12px"}}>{t.howAffect}</p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
            {sOpts.map(o=>{const a=!evalUnsure&&evalScore===o.v;const sc=scoreColor(o.v,th);return(
              <button key={o.v} onClick={()=>{setEvalScore(o.v);setEvalUnsure(false);}} style={{flex:"1 1 68px",minWidth:60,padding:"10px 4px",borderRadius:8,border:(a?2:1)+"px solid "+(a?sc:th.border),background:a?sc+"22":"transparent",color:a?sc:th.t3,cursor:"pointer",fontSize:11,fontWeight:a?700:400,transition:"all 150ms cubic-bezier(0,0,0.2,1)",textAlign:"center"}}>
                <div style={{fontSize:17,fontWeight:700,marginBottom:2}}>{o.v}</div><div style={{lineHeight:1.3}}>{o.l}</div>
              </button>);})}
            <button onClick={()=>{setEvalUnsure(true);setEvalScore(null);}} style={{flex:"1 1 55px",minWidth:50,padding:"10px 4px",borderRadius:8,border:(evalUnsure?2:1)+"px solid "+(evalUnsure?th.t3:th.border),background:evalUnsure?th.t3+"22":"transparent",color:evalUnsure?th.t2:th.t3,cursor:"pointer",fontSize:11,textAlign:"center",transition:"all 150ms cubic-bezier(0,0,0.2,1)"}}>
              <div style={{fontSize:17,fontWeight:700,marginBottom:2}}>?</div><div style={{lineHeight:1.3}}>{t.scoreUnsure}</div>
            </button>
          </div>
          <label style={{color:th.t3,fontSize:12,display:"block",marginBottom:8}}>{t.whyScore}</label>
          <AutoTextarea value={evalNote} onChange={e=>setEvalNote(e.target.value)} placeholder={t.whyPlaceholder} minRows={2} style={{...inp,marginBottom:12}}/>
          <div style={{display:"flex",justifyContent:"flex-end"}}>
            <button onClick={saveEval}
              disabled={!canSaveEval}
              aria-disabled={!canSaveEval}
              style={{...btnP,opacity:canSaveEval?1:0.4,cursor:canSaveEval?"pointer":"not-allowed"}}>
              {t.saveEval}
            </button>
          </div>
          {belief.evaluations.length>0&&(
            <div style={{marginTop:12,paddingTop:12,borderTop:"0.5px solid "+th.border,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <ScoreBadge belief={belief} t={t} th={th}/>
              <button onClick={()=>setHistOpen(true)} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,fontSize:12,padding:0}}>{t.evalHistory.replace("{n}",belief.evaluations.length)} · {t.seeHistory}</button>
            </div>
          )}
        </div>

        {/* Block 3 */}
        <div style={blk}>
          <span style={blkL}>{t.block3}</span>
          <p style={{color:th.t2,fontSize:13,margin:"0 0 12px",lineHeight:1.6}}>{awPrompt}</p>
          <AutoTextarea value={awareness} onChange={e=>setAwareness(e.target.value)} placeholder={t.awarenessPlaceholder} minRows={4} style={inp}/>
        </div>

        {/* Block 4 */}
        <div style={blk}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:expandTr?12:0}}>
            <span style={blkL}>{t.block4}</span>
            {expandTr&&<button onClick={stopTr} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,fontSize:12,padding:0}}>{t.stopTransform}</button>}
          </div>
          {!expandTr&&(<div><p style={{color:th.t3,fontSize:13,margin:"0 0 12px",lineHeight:1.6}}>{t["transformHint_"+status]}</p><button onClick={startTr} style={btnP}>{t.tryIt}</button></div>)}
          {expandTr&&(
            <div>
              <p style={{color:th.t2,fontSize:13,margin:"0 0 12px"}}>{t.choosePath}</p>
              <div style={{display:"flex",gap:8,marginBottom:20}}>
                {[{id:"perspective",l:t.pathA},{id:"replace",l:t.pathB}].map(p=>(
                  <button key={p.id} onClick={()=>setPath(p.id)} style={{flex:1,padding:"12px 10px",borderRadius:8,border:(cp===p.id?"1.5px":"0.5px")+" solid "+(cp===p.id?th.accent:th.border),background:cp===p.id?th.accent+"22":"transparent",color:cp===p.id?th.accent:th.t2,cursor:"pointer",fontSize:13,fontWeight:cp===p.id?600:400,transition:"all 150ms cubic-bezier(0,0,0.2,1)",textAlign:"left",lineHeight:1.4}}>{p.l}</button>
                ))}
              </div>
              {cp&&(
                <div>
                  <div style={{background:th.bgDeep,borderRadius:8,padding:"10px 12px",marginBottom:16}}>
                    <span style={{color:th.t3,fontSize:11}}>{t.block1}</span>
                    <p style={{color:th.t2,fontSize:13,margin:"4px 0 0"}}>「{belief.belief}」</p>
                  </div>
                  {(ais[cp]||[]).map((item,i)=>{ const sv=cp==="perspective"?belief.transform.perspectiveText:belief.transform.newBelief; const isSel=sv===item.text; return(
                    <div key={i} onClick={()=>saveTrText(cp==="perspective"?"perspectiveText":"newBelief",item.text)}
                      style={{background:isSel?th.accent+"22":th.bgDeep,border:"0.5px solid "+(isSel?th.accent:th.border),borderRadius:8,padding:"12px 14px",marginBottom:8,cursor:"pointer",transition:"all 150ms cubic-bezier(0,0,0.2,1)"}}>
                      <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
                        <div><p style={{color:th.t1,fontSize:13,margin:"0 0 4px"}}>「{item.text}」</p><p style={{color:th.t3,fontSize:12,margin:0}}>{item.explanation}</p></div>
                        {isSel&&<Check size={15} color={th.accent} style={{flexShrink:0,marginTop:2}}/>}
                      </div>
                    </div>
                  );})}
                  <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
                    <button onClick={()=>runAI(cp)}
                      disabled={aiLoad||cd>0}
                      aria-disabled={aiLoad||cd>0}
                      aria-busy={aiLoad}
                      style={{flex:1,minWidth:120,...btnP,display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:(aiLoad||cd>0)?0.8:1,cursor:(aiLoad||cd>0)?"wait":"pointer"}}>
                      {aiLoad
                        ? <><Spinner size={14} color={th.accentText}/>{t.loading}</>
                        : cd>0 ? t.cooldown+" "+cd+"s"
                        : <><Sparkles size={14}/>{cp==="perspective"?t.getAIPerspective:t.getAIBelief}</>
                      }
                    </button>
                    <button onClick={()=>copyPrompt(cp)} style={{...btnS,display:"flex",alignItems:"center",gap:6,padding:"9px 14px"}}>
                      <Copy size={13}/>{copied?t.promptCopied:t.copyPrompt}
                    </button>
                  </div>
                  <label style={{color:th.t3,fontSize:12,display:"block",marginBottom:8}}>{t.yourVersion}</label>
                  <AutoTextarea value={cp==="perspective"?belief.transform.perspectiveText:belief.transform.newBelief}
                    onChange={e=>{const f=cp==="perspective"?"perspectiveText":"newBelief";onUpdate(b=>({...b,transform:{...b.transform,[f]:e.target.value}}));}}
                    placeholder={cp==="perspective"?t.yourPerspectivePlaceholder:t.yourBeliefPlaceholder} minRows={2} style={{...inp,marginBottom:8}}/>
                  {saved&&<span style={{color:th.accent,fontSize:12}}>{t.choiceSaved}</span>}
                  <div style={{marginTop:20,paddingTop:16,borderTop:"0.5px solid "+th.border}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                      <span style={{color:th.t2,fontSize:13,fontWeight:600}}>{t.practiceTitle}</span>
                      <div style={{fontSize:11,display:"flex",gap:8}}>
                        {rStat.new>0&&<span style={{color:th.accent}}>{t.dirNew} {rStat.new}</span>}
                        {rStat.old>0&&<span style={{color:th.coral}}>{t.dirOld} {rStat.old}</span>}
                        {rStat.mixed>0&&<span style={{color:th.t3}}>{t.dirMixed} {rStat.mixed}</span>}
                      </div>
                    </div>
                    {belief.transform.records.map((rec,i)=>(
                      <div key={rec.id} style={{background:th.bgDeep,borderRadius:8,padding:"10px 12px",marginBottom:8}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                          <span style={{color:th.t3,fontSize:11}}>{"#"+(i+1)+" · "+fmt(rec.createdAt)}</span>
                          <span style={{fontSize:11,color:dirColor(rec.direction,th),border:"0.5px solid "+dirColor(rec.direction,th),borderRadius:4,padding:"1px 8px"}}>
                            {rec.direction==="new"?t.dirNew:rec.direction==="old"?t.dirOld:t.dirMixed}
                          </span>
                        </div>
                        {rec.event&&<p style={{color:th.t2,fontSize:13,margin:"0 0 2px"}}>{rec.event}</p>}
                        {rec.reaction&&<p style={{color:th.t3,fontSize:12,margin:0}}>{rec.reaction}</p>}
                      </div>
                    ))}
                    {!showRec
                      ?<button onClick={()=>setShowRec(true)} style={{...btnS,fontSize:13,padding:"8px 16px"}}>{t.addRecord}</button>
                      :(
                        <div style={{background:th.bgDeep,borderRadius:8,padding:12}}>
                          <label style={{color:th.t3,fontSize:12,display:"block",marginBottom:8}}>{t.recordEvent}</label>
                          <AutoTextarea value={recEv} onChange={e=>setRecEv(e.target.value)} minRows={2} style={{...inp,marginBottom:8}}/>
                          <label style={{color:th.t3,fontSize:12,display:"block",marginBottom:8}}>{t.recordReaction}</label>
                          <AutoTextarea value={recRx} onChange={e=>setRecRx(e.target.value)} minRows={2} style={{...inp,marginBottom:8}}/>
                          <div style={{display:"flex",gap:8,marginBottom:12}}>
                            {dOpts.map(d=><button key={d.id} onClick={()=>setRecDir(d.id)} style={{flex:1,padding:"7px 4px",borderRadius:8,border:(recDir===d.id?"1.5px":"0.5px")+" solid "+(recDir===d.id?d.c:th.border),background:recDir===d.id?d.c+"22":"transparent",color:recDir===d.id?d.c:th.t3,cursor:"pointer",fontSize:12}}>{d.l}</button>)}
                          </div>
                          <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
                            <button onClick={()=>setShowRec(false)} style={{...btnS,padding:"8px 16px",fontSize:13}}>{t.cancel}</button>
                            <button onClick={addRec} disabled={!recEv.trim()} style={{...btnP,opacity:recEv.trim()?1:0.4,cursor:recEv.trim()?"pointer":"not-allowed"}}>{t.saveRecord}</button>
                          </div>
                        </div>
                      )
                    }
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filter reference block */}
        {belief.filterRef&&(
          <div style={blk}>
            <button onClick={()=>setFltExp(v=>!v)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",background:"none",border:"none",cursor:"pointer",padding:0}}>
              <span style={{color:th.t2,fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:6}}><Filter size={13}/>{t.filterRef}</span>
              {fltExp?<ChevronUp size={15} color={th.t3}/>:<ChevronDown size={15} color={th.t3}/>}
            </button>
            {fltExp&&(
              <div style={{marginTop:12,borderTop:"0.5px solid "+th.border,paddingTop:12}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  {belief.filterRef.alignScore&&<div style={{background:th.bgDeep,borderRadius:8,padding:"10px 12px"}}><div style={{color:th.t3,fontSize:11,marginBottom:4}}>{t.alignScore}</div><div style={{color:th.t1,fontSize:20,fontWeight:700}}>{belief.filterRef.alignScore}<span style={{color:th.t3,fontSize:13}}>/5</span></div></div>}
                  {belief.filterRef.result&&<div style={{background:th.bgDeep,borderRadius:8,padding:"10px 12px"}}><div style={{color:th.t3,fontSize:11,marginBottom:4}}>{t.beliefResult}</div><div style={{color:th.t1,fontSize:16,fontWeight:600}}>{belief.filterRef.result}</div></div>}
                </div>
                <div style={{color:th.t3,fontSize:11}}>{t.importedAt}：{fmt(belief.filterRef.importedAt)}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* History Modal */}
      <Modal open={histOpen} onClose={()=>{setHistOpen(false);setEditEvalId(null);setDeleteEvalId(null);}} title={t.historyTitle} th={th}>
        {belief.evaluations.length===0?<p style={{color:th.t3,fontSize:13}}>{t.noHistory}</p>:
        [...belief.evaluations].reverse().map(ev=>{
          const sl=ev.isUnsure?t.scoreUnsure:ev.score?ev.score+" — "+[t.score1,t.score2,t.score3,t.score4,t.score5][ev.score-1]:t.scoreUnsure;
          const isEditing=editEvalId===ev.id;
          const isDeleting=deleteEvalId===ev.id;
          return(
            <div key={ev.id} style={{borderBottom:"0.5px solid "+th.border,paddingBottom:12,marginBottom:12}}>
              {isEditing?(
                <div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
                    {sOpts.map(o=>{const a=!editEvalUnsure&&editEvalScore===o.v;const sc=scoreColor(o.v,th);return(
                      <button key={o.v} onClick={()=>{setEditEvalScore(o.v);setEditEvalUnsure(false);}} style={{flex:"1 1 50px",padding:"8px 4px",borderRadius:8,border:(a?2:1)+"px solid "+(a?sc:th.border),background:a?sc+"22":"transparent",color:a?sc:th.t3,cursor:"pointer",fontSize:11,textAlign:"center"}}>
                        <div style={{fontSize:14,fontWeight:700}}>{o.v}</div><div style={{fontSize:10,lineHeight:1.3}}>{o.l}</div>
                      </button>);})}
                    <button onClick={()=>{setEditEvalUnsure(true);setEditEvalScore(null);}} style={{flex:"1 1 40px",padding:"8px 4px",borderRadius:8,border:(editEvalUnsure?2:1)+"px solid "+(editEvalUnsure?th.t3:th.border),background:editEvalUnsure?th.t3+"22":"transparent",color:editEvalUnsure?th.t2:th.t3,cursor:"pointer",fontSize:11,textAlign:"center"}}>
                      <div style={{fontSize:14,fontWeight:700}}>?</div><div style={{fontSize:10}}>{t.scoreUnsure}</div>
                    </button>
                  </div>
                  <AutoTextarea value={editEvalNote} onChange={e=>setEditEvalNote(e.target.value)} placeholder={t.whyPlaceholder} minRows={2} style={{...inp,fontSize:16,marginBottom:8}}/>
                  <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
                    <button onClick={()=>setEditEvalId(null)} style={{...btnS,padding:"6px 14px",fontSize:12}}>{t.cancel}</button>
                    <button onClick={saveEditEval} style={{...btnP,padding:"6px 14px",fontSize:12}}>{t.saveEdit}</button>
                  </div>
                </div>
              ):isDeleting?(
                <div>
                  <p style={{color:th.coral,fontSize:13,margin:"0 0 8px"}}>{t.confirmDeleteEval}</p>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>setDeleteEvalId(null)} style={{...btnS,padding:"6px 14px",fontSize:12}}>{t.cancel}</button>
                    <button onClick={()=>deleteEval(ev.id)} style={{...btnC,padding:"6px 14px",fontSize:12,background:th.coral,color:"#fff"}}>{t.deleteBtn}</button>
                  </div>
                </div>
              ):(
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{color:th.t3,fontSize:12}}>{fmt(ev.createdAt)}</span>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:13,fontWeight:600,color:ev.isUnsure?th.t3:scoreColor(ev.score,th)}}>{sl}</span>
                      <button onClick={()=>{ setEditEvalId(ev.id); startEditEval(ev); }} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,padding:2,display:"flex"}}><Edit3 size={13}/></button>
                      <button onClick={()=>setDeleteEvalId(ev.id)} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,padding:2,display:"flex"}}><Trash2 size={13}/></button>
                    </div>
                  </div>
                  <p style={{color:th.t3,fontSize:13,margin:0,fontStyle:"italic"}}>{ev.note||t.noNote}</p>
                </div>
              )}
            </div>
          );
        })}
      </Modal>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function BeliefApp({ user, onLogout }) {
  const { beliefs, settings, syncStatus, addBelief, updateBelief, deleteBelief, updateSettings, replaceBeliefs } = useSync(user);
  const [themeKey, setThemeKey] = useState(ldTheme);
  const [view,setView]=useState("list");
  const [selId,setSelId]=useState(null);
  const [importModal,setImportModal]=useState(false);
  const t=T[settings.lang];
  const th=THEMES[themeKey]||THEMES.d1;

  // Track prev syncStatus to detect error transition
  const prevSyncRef = useRef(syncStatus);
  const { showToast } = useToast ? useContext(ToastContext) || {} : {};

  function handleThemeChange(key) { setThemeKey(key); svTheme(key); }
  function handleSettings(newSettings) {
    if(newSettings.theme && newSettings.theme !== themeKey) handleThemeChange(newSettings.theme);
    const { theme: _t, ...rest } = newSettings;
    updateSettings(rest);
  }

  function delBelief(id) {
    const b=beliefs.find(x=>x.id===id); if(!b) return;
    deleteBelief(id);
    if(view==="detail"){setView("list");setSelId(null);}
    // Toast with undo action
    if(showToast) {
      const beliefText = b.belief.length > 15 ? b.belief.slice(0,15)+"…" : b.belief;
      const msg = (settings.lang==="ja" ? "「"+beliefText+"」を削除しました" : "已刪除「"+beliefText+"」");
      showToast({ variant:"action", msg, actionLabel:t.undo, onAction:()=>{ addBelief(b); } });
    }
  }
  function update(id,fn){ updateBelief(id,fn); }
  function resetAll(){ replaceBeliefs([],{lang:settings.lang}); handleThemeChange("d1"); setView("list"); setSelId(null); }

  function handleImport(newBeliefs, newSettings, count) {
    const { theme: importedTheme, ...restSettings } = newSettings || {};
    replaceBeliefs(newBeliefs, Object.keys(restSettings).length ? restSettings : settings);
    if(importedTheme) handleThemeChange(importedTheme);
  }

  const sel=beliefs.find(b=>b.id===selId)||null;
  const ff = settings.lang === "ja"
    ? "'Noto Sans JP','Noto Sans TC',system-ui,sans-serif"
    : "'Noto Sans TC','Noto Sans JP',system-ui,sans-serif";

  const settingsWithTheme = { ...settings, theme: themeKey };

  return (
    <div style={{fontFamily:ff,background:th.bg,minHeight:"100dvh"}}>
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes toastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .hide-scrollbar::-webkit-scrollbar{display:none}
        .themed-scroll::-webkit-scrollbar{width:6px}
        .themed-scroll::-webkit-scrollbar-track{background:transparent}
        .themed-scroll::-webkit-scrollbar-thumb{background:${th.border};border-radius:3px}
        .themed-scroll::-webkit-scrollbar-thumb:hover{background:${th.borderHover}}
        button:focus-visible,input:focus-visible,textarea:focus-visible,select:focus-visible,a:focus-visible,[tabindex]:focus-visible{outline:2px solid ${th.accent};outline-offset:2px;}
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;transition-duration:0.01ms!important}}
      `}</style>
      {view==="list"&&<ListView th={th} t={t} settings={settingsWithTheme} onSettings={handleSettings} beliefs={beliefs}
        onSelect={id=>{setSelId(id);setView("detail");}} onDelete={delBelief} onAdd={()=>setView("add")}
        onExport={()=>exportJSON(beliefs,settingsWithTheme)}
        onExportMD={()=>exportAllMD(beliefs,settings.lang)}
        onImport={()=>setImportModal(true)}
        onResetAll={resetAll}
        user={user} onLogout={onLogout} syncStatus={syncStatus}/>}
      {view==="add"&&<AddView th={th} t={t} settings={settingsWithTheme} onSettings={handleSettings} beliefs={beliefs} onCreate={addBelief} onBack={()=>setView("list")} onResetAll={resetAll} user={user} onLogout={onLogout} syncStatus={syncStatus}/>}
      {view==="detail"&&sel&&<DetailView th={th} t={t} settings={settingsWithTheme} onSettings={handleSettings} belief={sel} onUpdate={fn=>update(selId,fn)} onBack={()=>{setView("list");setSelId(null);}} onResetAll={resetAll} user={user} onLogout={onLogout} syncStatus={syncStatus}/>}
      <ImportModal open={importModal} onClose={()=>setImportModal(false)} th={th} t={t} lang={settings.lang} beliefs={beliefs} onImport={handleImport} settings={settingsWithTheme}/>
    </div>
  );
}

// ── AppWithToast: wrap root with ToastProvider ────────────────────────────────
// Usage: replace <BeliefApp> with <AppWithToast> at the entry point
export function AppWithToast({ user, onLogout }) {
  const [themeKey] = useState(ldTheme);
  const th = THEMES[themeKey] || THEMES.d1;
  return (
    <ToastProvider th={th}>
      <BeliefAppInner user={user} onLogout={onLogout}/>
    </ToastProvider>
  );
}

// Inner component that has access to ToastContext
function BeliefAppInner({ user, onLogout }) {
  const { beliefs, settings, syncStatus, addBelief, updateBelief, deleteBelief, updateSettings, replaceBeliefs } = useSync(user);
  const [themeKey, setThemeKey] = useState(ldTheme);
  const [view,setView]=useState("list");
  const [selId,setSelId]=useState(null);
  const [importModal,setImportModal]=useState(false);
  const { showToast } = useToast();
  const t=T[settings.lang];
  const th=THEMES[themeKey]||THEMES.d1;
  const prevSyncRef = useRef(syncStatus);

  // Firebase sync error toast
  useEffect(() => {
    if(prevSyncRef.current !== "error" && syncStatus === "error") {
      showToast({ variant:"error", msg: t.syncErrorToast });
    }
    prevSyncRef.current = syncStatus;
  }, [syncStatus]);

  function handleThemeChange(key) { setThemeKey(key); svTheme(key); }
  function handleSettings(newSettings) {
    if(newSettings.theme && newSettings.theme !== themeKey) handleThemeChange(newSettings.theme);
    const { theme: _t, ...rest } = newSettings;
    updateSettings(rest);
  }
  function delBelief(id) {
    const b=beliefs.find(x=>x.id===id); if(!b) return;
    deleteBelief(id);
    if(view==="detail"){setView("list");setSelId(null);}
    const beliefText = b.belief.length > 15 ? b.belief.slice(0,15)+"…" : b.belief;
    const msg = settings.lang==="ja" ? "「"+beliefText+"」を削除しました" : "已刪除「"+beliefText+"」";
    showToast({ variant:"action", msg, actionLabel:t.undo, onAction:()=>{ addBelief(b); } });
  }
  function update(id,fn){ updateBelief(id,fn); }
  function resetAll(){ replaceBeliefs([],{lang:settings.lang}); handleThemeChange("d1"); setView("list"); setSelId(null); }
  function handleImport(newBeliefs, newSettings, count) {
    const { theme: importedTheme, ...restSettings } = newSettings || {};
    replaceBeliefs(newBeliefs, Object.keys(restSettings).length ? restSettings : settings);
    if(importedTheme) handleThemeChange(importedTheme);
  }

  const sel=beliefs.find(b=>b.id===selId)||null;
  const ff = settings.lang==="ja" ? "'Noto Sans JP','Noto Sans TC',system-ui,sans-serif" : "'Noto Sans TC','Noto Sans JP',system-ui,sans-serif";
  const settingsWithTheme = { ...settings, theme: themeKey };

  return (
    <div style={{fontFamily:ff,background:th.bg,minHeight:"100dvh"}}>
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes toastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .hide-scrollbar::-webkit-scrollbar{display:none}
        .themed-scroll::-webkit-scrollbar{width:6px}
        .themed-scroll::-webkit-scrollbar-track{background:transparent}
        .themed-scroll::-webkit-scrollbar-thumb{background:${th.border};border-radius:3px}
        .themed-scroll::-webkit-scrollbar-thumb:hover{background:${th.borderHover}}
        button:focus-visible,input:focus-visible,textarea:focus-visible,select:focus-visible,a:focus-visible,[tabindex]:focus-visible{outline:2px solid ${th.accent};outline-offset:2px;}
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;transition-duration:0.01ms!important}}
      `}</style>
      {view==="list"&&<ListView th={th} t={t} settings={settingsWithTheme} onSettings={handleSettings} beliefs={beliefs}
        onSelect={id=>{setSelId(id);setView("detail");}} onDelete={delBelief} onAdd={()=>setView("add")}
        onExport={()=>exportJSON(beliefs,settingsWithTheme)}
        onExportMD={()=>exportAllMD(beliefs,settings.lang)}
        onImport={()=>setImportModal(true)}
        onResetAll={resetAll}
        user={user} onLogout={onLogout} syncStatus={syncStatus}/>}
      {view==="add"&&<AddView th={th} t={t} settings={settingsWithTheme} onSettings={handleSettings} beliefs={beliefs} onCreate={addBelief} onBack={()=>setView("list")} onResetAll={resetAll} user={user} onLogout={onLogout} syncStatus={syncStatus}/>}
      {view==="detail"&&sel&&<DetailView th={th} t={t} settings={settingsWithTheme} onSettings={handleSettings} belief={sel} onUpdate={fn=>update(selId,fn)} onBack={()=>{setView("list");setSelId(null);}} onResetAll={resetAll} user={user} onLogout={onLogout} syncStatus={syncStatus}/>}
      <ImportModal open={importModal} onClose={()=>setImportModal(false)} th={th} t={t} lang={settings.lang} beliefs={beliefs} onImport={handleImport} settings={settingsWithTheme}/>
    </div>
  );
}

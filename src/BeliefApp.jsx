// v3.0
import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Info, Clock, ChevronDown, ChevronUp, X, Check, Trash2, Sparkles, ArrowLeft, Filter, Edit3, RefreshCw, Upload, Download, Copy, Settings, LogOut, User } from "lucide-react";
import { useSync } from "./useSync";

const THEMES = {
  d1: { bg:"#23232E", bgDeep:"#1A1A24", bgCard:"#2A2A38", border:"#3A3848", borderHover:"#5A5870", accent:"#6B63D4", t1:"#E8E6F4", t2:"#C0BDDA", t3:"#9B98B0", coral:"#D85A30", shadow:"rgba(0,0,0,0.4)", name:"炭灰紫", nameJa:"パープル" },
  d2: { bg:"#1C1C1E", bgDeep:"#111113", bgCard:"#222224", border:"#333336", borderHover:"#555558", accent:"#A78BFA", t1:"#F0F0F0", t2:"#BBBBBB", t3:"#888888", coral:"#FB7185", shadow:"rgba(0,0,0,0.5)", name:"黑曜石", nameJa:"ブラック" },
  l1: { bg:"#F4F2FC", bgDeep:"#FFFFFF", bgCard:"#EDEAF8", border:"#D8D4F0", borderHover:"#B0AADC", accent:"#6B5FD4", t1:"#2A2840", t2:"#504E70", t3:"#8888AA", coral:"#D85A30", shadow:"rgba(100,90,180,0.15)", name:"薰衣草白", nameJa:"ラベンダー" },
  l2: { bg:"#F7F4EE", bgDeep:"#FEFCF8", bgCard:"#EDE8DC", border:"#DDD8CC", borderHover:"#C0B8A8", accent:"#8B6FD4", t1:"#2E2A20", t2:"#5A5040", t3:"#9A9080", coral:"#C85820", shadow:"rgba(0,0,0,0.1)", name:"奶霧米", nameJa:"ベージュ" },
};
const SC = { 1:"#A04848", 2:"#E07A8A", 3:"#E0AC48", 4:"#6DDDB4", 5:"#4EAD88" };

const T = {
  zh: {
    appTitle:"信念覺察", about:"關於這個工具", export:"匯出", importBtn:"匯入",
    allBeliefs:"全部", nourishing:"滋養的", balanced:"一半一半", draining:"消耗的",
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
    loading:"AI 思考中…", aiError:"AI 回應失敗，請重試", aiNotConfigured:"AI 功能尚未啟用（需設定 API key）", retry:"重試",
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
  },
  ja: {
    appTitle:"ビリーフ・アウェアネス", about:"このツールについて", export:"エクスポート", importBtn:"インポート",
    allBeliefs:"すべて", nourishing:"力になっている", balanced:"半々", draining:"消耗している",
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
    score1:"害になっている", score2:"消耗の方が多い", score3:"半々", score4:"助けの方が多い", score5:"力になっている", scoreUnsure:"わからない",
    whyScore:"なぜ？（任意）", whyPlaceholder:"書きたければ書く、書かなくてもいい",
    saveEval:"評価を保存", evalHistory:"評価 {n} 回", seeHistory:"履歴を表示 →",
    awarenessPrompt:"どう影響していますか？助けになっていますか、それとも消耗していますか？",
    awarenessPromptUnsure:"ゆっくりで大丈夫です。どう影響していますか？助けになっていますか、消耗していますか？",
    awarenessPlaceholder:"自由に書いてください…",
    transformHint_nourishing:"現在の評価は「力になっている」。違う視点や新しいビリーフを試すこともできます。",
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
    practiceTitle:"新しい視点を日常で実践する", addRecord:"+ 記録を追加",
    recordEvent:"今回何が起きましたか？", recordReaction:"私の反応",
    dirNew:"新しい視点を使えた", dirOld:"使えなかった", dirMixed:"半々", saveRecord:"記録を保存",
    filterRef:"フィルター参照", alignScore:"一致スコア", beliefResult:"フィルター結果", importedAt:"取り込み日時",
    historyTitle:"評価履歴", noHistory:"まだ評価記録がありません", noNote:"（メモなし）",
    saveEdit:"保存",
    deleted:"ビリーフを削除しました", undo:"元に戻す", imported:"取り込み済み", bringIn:"取り込む",
    noFilterData:"フィルターのビリーフ記録が見つかりません",
    loading:"AIが考えています…", aiError:"AIの応答に失敗しました。再試行してください", aiNotConfigured:"AI機能は現在利用できません（APIキーが必要です）", retry:"再試行",
    deleteYes:"削除", deleteNo:"キャンセル",
    noBeliefs:"まだビリーフがありません。右下の + で最初のビリーフを追加してください。",
    factsN:"事実 {n}", recordsN:"記録 {n}",
    statBadge_5:"✓ 力に", statBadge_4:"力になる", statBadge_3:"半々",
    statBadge_2:"消耗", statBadge_1:"害に", statBadge_unsure:"わからない", statBadge_none:"未評価",
    importTitle:"ビリーフをインポート", importDesc:"このツールからエクスポートしたJSONファイルを選択", importSuccess:"インポート成功 ✓", importError:"ファイル形式が正しくありません",
    filterImportDesc:"フィルターからエクスポートしたJSONファイルを選択してください",
    exportAll_json:"バックアップ", exportAll_md:"ノートとして出力", exportThis_md:"このビリーフをノート出力",
    dropOrClick:"ファイルをドラッグまたはクリックして選択",
    unsupportedFormat:"サポートされていないファイル形式。このツールはビリーフ・アウェアネスツールのエクスポートファイル、またはライフフィルターのバックアップファイル（backup）のみ受け付けます。",
    parseError:"ファイル形式エラー、解析できません",
    emptyBeliefs:"ファイルにインポート可能なビリーフがありません",
    noFilterBeliefs:"このバックアップファイルにはビリーフカテゴリの記録が含まれていません",
    importPreviewTitle:"信念覚察ツールバックアップをインポート",
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
  }
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const gid = (p) => `${p}_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
const now = () => new Date().toISOString();
const fmt = (iso) => { const d=new Date(iso); return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}`; };
const getStatus = (b) => { const e=b.evaluations[b.evaluations.length-1]; if(!e) return "unevaluated"; if(e.isUnsure) return "unsure"; if(e.score>=4) return "nourishing"; if(e.score<=2) return "draining"; return "balanced"; };

function useDebounce(fn, ms) {
  const t = useRef(null); const f = useRef(fn); f.current = fn;
  return useCallback((...a) => { clearTimeout(t.current); t.current = setTimeout(()=>f.current(...a), ms); }, [ms]);
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
  ? "私は出来事を経験しました。背後にあるビリーフを3〜5個分析してください。\n出来事："+ev+"\n反応："+rx+"\n一人称、簡潔、多様で中立。JSONのみ："+JB
  : "我經歷了一個事件，請分析3-5個背後的信念。\n事件："+ev+"\n反應："+rx+"\n一人稱、簡潔、多樣化、中性。只回傳JSON："+JB;
const pPersp = (b,s,n,a,l) => l==="ja"
  ? "ビリーフを変えずに違う視点を3〜5個提案してください。\n元のビリーフ："+b+"\n評価："+(s!==null&&s!==undefined?s:"不明")+"/5、"+(n||"なし")+"\n気づき："+(a||"なし")+"\nJSONのみ："+JP
  : "幫使用者換個角度看信念，給3-5個不同視角。\n原信念："+b+"\n評估："+(s!==null&&s!==undefined?s:"不確定")+"/5，"+(n||"無")+"\n覺察："+(a||"無")+"\n只回傳JSON："+JP;
const pReplace = (b,s,n,a,l) => l==="ja"
  ? "ユーザーが置き換えたいビリーフについて新しいビリーフを3〜5個提案してください。\n元のビリーフ："+b+"\n評価："+(s!==null&&s!==undefined?s:"不明")+"/5、"+(n||"なし")+"\n気づき："+(a||"なし")+"\nJSONのみ："+JB
  : "幫使用者想3-5個替換的新信念。\n原信念："+b+"\n評估："+(s!==null&&s!==undefined?s:"不確定")+"/5，"+(n||"無")+"\n覺察："+(a||"無")+"\n只回傳JSON："+JB;
const buildCopyPrompt = (type,belief,cur,awareness,lang) => {
  const s=cur?.isUnsure?null:cur?.score??null, n=cur?.note||"", a=awareness||"";
  return type==="perspective"?pPersp(belief,s,n,a,lang):pReplace(belief,s,n,a,lang);
};

// ── Export (Netlify deploy: use download, not clipboard restriction) ───────────
function exportJSON(beliefs, settings) {
  const data = { type:"belief-awareness", version:"v2.0", exportedAt:now(), settings, beliefs };
  const blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=`belief-awareness-v3_${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
}
const SC_LABELS_ZH = {1:"傷害我",2:"消耗多於幫助",3:"一半一半",4:"幫助多於消耗",5:"滋養我"};
const SC_LABELS_JA = {1:"害になっている",2:"消耗の方が多い",3:"半々",4:"助けの方が多い",5:"力になっている"};
const DIR_LABELS_ZH = {new:"用了新角度",old:"沒用上",mixed:"一半一半"};
const DIR_LABELS_JA = {new:"新しい視点を使えた",old:"使えなかった",mixed:"半々"};
function beliefToMD(b, lang) {
  const isZh = lang !== "ja";
  const scl = isZh ? SC_LABELS_ZH : SC_LABELS_JA;
  const dirl = isZh ? DIR_LABELS_ZH : DIR_LABELS_JA;
  const srcMap = isZh ? {direct:"直接輸入",filter:"從篩選器",event:"從事件反推"} : {direct:"直接入力",filter:"フィルターから",event:"出来事から"};
  const last = b.evaluations[b.evaluations.length-1]||null;
  const scoreLabel = last ? (last.isUnsure ? (isZh?"不確定":"わからない") : `${last.score}（${scl[last.score]||""}）`) : (isZh?"還沒評估":"未評価");
  const fmtDate = iso => { const d=new Date(iso); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
  let md = `**${isZh?"狀態":"状態"}**：${scoreLabel} · **${isZh?"來源":"出典"}**：${srcMap[b.source]||b.source} · **${isZh?"建立":"作成"}**：${fmtDate(b.createdAt)}\n\n`;
  if (b.evidence.length > 0) {
    md += `### ${isZh?"支持這個信念的事實":"このビリーフを支持する事実"}\n`;
    b.evidence.forEach(e => { md += `- ${e.text}\n`; });
    md += "\n";
  }
  if (b.evaluations.length > 0) {
    md += `### ${isZh?"評估歷史":"評価履歴"}\n`;
    b.evaluations.forEach(ev => {
      const sl = ev.isUnsure ? (isZh?"不確定":"わからない") : `${ev.score}（${scl[ev.score]||""}）`;
      md += `- ${fmtDate(ev.createdAt)} · **${sl}**${ev.note ? ` — 「${ev.note}」` : ""}\n`;
    });
    md += "\n";
  }
  if (b.awareness.note) { md += `### ${isZh?"覺察":"気づき"}\n${b.awareness.note}\n\n`; }
  const tr = b.transform;
  if (tr.perspectiveText || tr.newBelief || (tr.records && tr.records.length > 0)) {
    md += `### ${isZh?"轉化":"書き換え"}\n`;
    if (tr.perspectiveText) md += `**${isZh?"新角度":"新しい視点"}**：${tr.perspectiveText}\n`;
    if (tr.newBelief) md += `**${isZh?"新信念":"新しいビリーフ"}**：${tr.newBelief}\n`;
    if (tr.records && tr.records.length > 0) {
      md += `\n**${isZh?"紀錄":"記録"}**：\n`;
      tr.records.forEach((r,i) => { md += `${i+1}. ${fmtDate(r.createdAt)} · ${dirl[r.direction]||r.direction}${r.event ? ` — ${r.event}` : ""}\n`; });
    }
    md += "\n";
  }
  if (b.filterRef) {
    md += `### ${isZh?"來自篩選器":"フィルターから"}\n`;
    if (b.filterRef.alignScore !== undefined && b.filterRef.alignScore !== null) md += `${isZh?"言行一致度":"一致スコア"} ${b.filterRef.alignScore}/5`;
    if (b.filterRef.result) md += ` · ${isZh?"結果":"結果"}：${b.filterRef.result}`;
    md += "\n\n";
  }
  return md;
}
function exportAllMD(beliefs, lang) {
  const isZh = lang !== "ja";
  const fmtDate = iso => { const d=new Date(iso); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
  let md = `# ${isZh?"信念覺察紀錄":"ビリーフ覚察記録"}\n${isZh?"匯出時間":"エクスポート日時"}：${fmtDate(now())}\n\n---\n\n`;
  beliefs.forEach(b => { md += `## 「${b.belief}」\n`; md += beliefToMD(b, lang); md += "---\n\n"; });
  const blob = new Blob([md],{type:"text/markdown;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=`belief-awareness_${new Date().toISOString().slice(0,10)}.md`; a.click(); URL.revokeObjectURL(url);
}
function exportSingleMD(b, lang) {
  let md = `# 「${b.belief}」\n\n`; md += beliefToMD(b, lang);
  const safe = b.belief.replace(/[^\u4e00-\u9fa5\u3040-\u30ff\u3400-\u4dbfa-zA-Z0-9]/g,"_").slice(0,10);
  const fmtDate = iso => new Date(iso).toISOString().slice(0,10);
  const blob = new Blob([md],{type:"text/markdown;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=`belief_${safe}_${fmtDate(now())}.md`; a.click(); URL.revokeObjectURL(url);
}

// ── AutoGrow Textarea ─────────────────────────────────────────────────────────
function AutoTextarea({ value, onChange, placeholder, style, onKeyDown, minRows=2 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [value]);
  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      rows={minRows}
      style={{ ...style, resize: "none", overflow: "hidden" }}
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
    : [["5","力になっている"],["4","助けの方が多い"],["3","半々"],["2","消耗の方が多い"],["1","害になっている"],["?","わからない"]];
  const scoreColors = { "5":SC[5],"4":SC[4],"3":SC[3],"2":SC[2],"1":SC[1],"?":th.t3 };
  const intro1 = isZh ? "信念本身沒有好壞，只看它目前對你的影響是幫助還是消耗。" : "ビリーフ自体に良い悪いはなく、今のあなたへの影響が助けになっているか消耗しているかだけを見ます。";
  const intro2 = isZh ? "這個工具不告訴你哪些信念該改、哪些該留，而是陪你持續觀察信念跟你的關係。" : "このツールはどのビリーフを変えるべきか教えるものではなく、ビリーフとあなたの関係を継続的に観察する場所です。";
  const tagline = isZh ? "它不是要修正你，而是幫你看見自己。" : "それはあなたを修正するためではなく、自分自身を見るための場所です。";
  return (
    <div>
      <p style={{color:th.t2,fontSize:14,lineHeight:1.8,margin:"0 0 10px"}}>{intro1}</p>
      <p style={{color:th.t2,fontSize:14,lineHeight:1.8,margin:"0 0 20px"}}>{intro2}</p>
      <p style={{color:th.t1,fontWeight:600,fontSize:13,margin:"0 0 10px"}}>{isZh?"四個區塊":"四つのブロック"}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
        {blocks.map((b,i)=>(
          <div key={i} style={{background:th.bgCard,border:"0.5px solid "+th.border,borderRadius:10,padding:12}}>
            <div style={{color:th.accent,fontSize:12,fontWeight:600,marginBottom:4}}>{b.title}</div>
            <div style={{color:th.t3,fontSize:12,lineHeight:1.5}}>{b.desc}</div>
          </div>
        ))}
      </div>
      <p style={{color:th.t1,fontWeight:600,fontSize:13,margin:"0 0 10px"}}>{isZh?"評分標準":"評価基準"}</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:20}}>
        {scoreRows.map(([num,label])=>(
          <div key={num} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:8,background:th.bgDeep}}>
            <span style={{color:scoreColors[num]||th.t3,fontSize:15,fontWeight:700,minWidth:16,textAlign:"center"}}>{num}</span>
            <span style={{color:th.t2,fontSize:12}}>{label}</span>
          </div>
        ))}
      </div>
      <p style={{color:th.t3,fontSize:13,lineHeight:1.8,textAlign:"center",fontStyle:"italic",padding:"10px 0 14px"}}>{tagline}</p>
      <p style={{color:th.t3,fontSize:11,textAlign:"center",margin:0}}>v3.0</p>
    </div>
  );
}

// ── SyncDot ───────────────────────────────────────────────────────────────────
function SyncDot({ status, t }) {
  const colors = { synced:"#4EAD88", syncing:"#E0AC48", offline:"#9B98B0", loading:"#9B98B0", error:"#E07A8A" };
  const label = t[`syncStatus_${status}`] || status;
  return (
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <div style={{
        width:7, height:7, borderRadius:"50%",
        background: colors[status] || "#9B98B0",
        animation: status==="syncing" ? "pulse 1s ease-in-out infinite" : "none",
      }}/>
      <span style={{fontSize:11,color: colors[status] || "#9B98B0"}}>{label}</span>
    </div>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
function Header({ th, t, settings, onSettings, onAbout, onHistory, showHistory, left, title, onExport, onImport, onExportMD, onExportSingleMD, onResetAll, user, onLogout, syncStatus }) {
  const [settingsOpen,setSettingsOpen]=useState(false);
  const [confirmReset,setConfirmReset]=useState(false);
  const drawerRef=useRef(null);

  useEffect(()=>{
    if(!settingsOpen) return;
    const fn=e=>{ if(e.key==="Escape"){setSettingsOpen(false);setConfirmReset(false);} };
    document.addEventListener("keydown",fn);
    return()=>document.removeEventListener("keydown",fn);
  },[settingsOpen]);

  function handleReset(){ onResetAll&&onResetAll(); setSettingsOpen(false); setConfirmReset(false); }
  function closeDrawer(){ setSettingsOpen(false); setConfirmReset(false); }

  const ib={background:"none",border:"none",cursor:"pointer",color:th.t3,padding:4,display:"flex"};
  const sb={background:"none",border:"0.5px solid "+th.border,borderRadius:8,cursor:"pointer",color:th.t2,padding:"4px 9px",fontSize:12,display:"flex",alignItems:"center",gap:5};
  const fullBtn={width:"100%",display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderRadius:8,background:"none",border:"0.5px solid "+th.border,cursor:"pointer",color:th.t2,fontSize:13,marginBottom:8,textAlign:"left",boxSizing:"border-box"};
  const secLabel={color:th.t3,fontSize:11,fontWeight:600,marginBottom:10,display:"block",letterSpacing:"0.04em"};
  const secDiv={borderBottom:"0.5px solid "+th.border,paddingBottom:18,marginBottom:18};
  const langBtnStyle=(l)=>({flex:1,padding:"8px 0",borderRadius:8,border:"0.5px solid "+(settings.lang===l?th.accent:th.border),background:settings.lang===l?th.accent:"transparent",color:settings.lang===l?"#fff":th.t2,cursor:"pointer",fontSize:13,fontWeight:settings.lang===l?600:400,transition:"all 0.15s"});

  return (
    <>
      <div style={{position:"sticky",top:0,zIndex:100,background:th.bg,borderBottom:"0.5px solid "+th.border,padding:"0 12px",display:"flex",alignItems:"center",gap:8,height:54,flexShrink:0}}>
        {left}
        <span style={{color:th.t1,fontWeight:600,fontSize:15,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{title}</span>
        {showHistory&&<button onClick={onHistory} style={ib}><Clock size={18}/></button>}
        {onExportSingleMD&&<button onClick={onExportSingleMD} style={sb}><Download size={13}/>{t.exportThis_md}</button>}
        <button onClick={()=>{setSettingsOpen(v=>!v);setConfirmReset(false);}} style={{...ib,background:settingsOpen?th.accent+"22":"none",border:"0.5px solid "+(settingsOpen?th.accent:th.border),color:settingsOpen?th.accent:th.t2,borderRadius:8,padding:6}}><Settings size={18}/></button>
        <button onClick={onAbout} style={ib}><Info size={18}/></button>
      </div>

      {settingsOpen&&(
        <>
          <div onClick={closeDrawer} style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.45)"}}/>
          <div ref={drawerRef} className="themed-scroll" style={{position:"fixed",top:0,right:0,bottom:0,zIndex:201,width:280,background:th.bgCard,borderLeft:"0.5px solid "+th.border,overflowY:"auto",display:"flex",flexDirection:"column"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px 14px",borderBottom:"0.5px solid "+th.border,flexShrink:0}}>
              <span style={{color:th.t1,fontWeight:600,fontSize:15}}>{t.settings}</span>
              <button onClick={closeDrawer} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,padding:4,display:"flex"}}><X size={18}/></button>
            </div>

            <div style={{padding:"20px",flex:1}}>
              {/* Language */}
              <div style={secDiv}>
                <span style={secLabel}>{t.section_language}</span>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>onSettings({...settings,lang:"zh"})} style={langBtnStyle("zh")}>中文</button>
                  <button onClick={()=>onSettings({...settings,lang:"ja"})} style={langBtnStyle("ja")}>日本語</button>
                </div>
              </div>

              {/* Appearance */}
              <div style={secDiv}>
                <span style={secLabel}>{t.section_appearance}</span>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {Object.entries(THEMES).map(([k,v])=>{
                    const isSelected=settings.theme===k;
                    return(
                      <button key={k} onClick={()=>onSettings({...settings,theme:k})} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:(isSelected?"1.5px":"0.5px")+" solid "+(isSelected?v.accent:th.border),background:isSelected?v.accent+"18":th.bgDeep,cursor:"pointer",transition:"all 0.15s",textAlign:"left"}}>
                        <div style={{width:24,height:24,borderRadius:"50%",background:v.bg,border:"0.5px solid "+(isSelected?v.accent:th.border),flexShrink:0}}/>
                        <span style={{color:isSelected?v.accent:th.t2,fontSize:12,fontWeight:isSelected?600:400,lineHeight:1.3}}>{settings.lang==="ja"?v.nameJa:v.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Data */}
              <div style={secDiv}>
                <span style={secLabel}>{t.section_data}</span>
                <button onClick={()=>onExport&&onExport()} style={fullBtn}><Download size={14}/>{t.exportAll_json}</button>
                <button onClick={()=>onExportMD&&onExportMD()} style={fullBtn}><Download size={14}/>{t.exportAll_md}</button>
                <button onClick={()=>{closeDrawer();onImport&&onImport();}} style={{...fullBtn,marginBottom:0}}><Upload size={14}/>{t.importBtn}</button>
              </div>

              {/* Account */}
              <div style={secDiv}>
                <span style={secLabel}>{t.section_account}</span>
                {user && (
                  <div style={{marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                      {user.photoURL
                        ? <img src={user.photoURL} style={{width:32,height:32,borderRadius:"50%",flexShrink:0}} alt="avatar"/>
                        : <div style={{width:32,height:32,borderRadius:"50%",background:th.accent+"33",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><User size={16} color={th.accent}/></div>
                      }
                      <div>
                        <div style={{color:th.t1,fontSize:13,fontWeight:500}}>{user.displayName||"—"}</div>
                        <div style={{color:th.t3,fontSize:11}}>{user.email}</div>
                      </div>
                    </div>
                    <SyncDot status={syncStatus} t={t}/>
                  </div>
                )}
                <button onClick={()=>{closeDrawer();onLogout&&onLogout();}} style={{...fullBtn,marginBottom:0,color:th.coral,borderColor:th.coral+"66"}}>
                  <LogOut size={14}/>{t.logout}
                </button>
              </div>

              {/* Reset */}
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <span style={{...secLabel,color:th.coral}}>{t.section_reset}</span>
                {!confirmReset
                  ?<button onClick={()=>setConfirmReset(true)} style={{background:"none",border:"0.5px solid "+th.coral,borderRadius:8,cursor:"pointer",color:th.coral,padding:"8px 16px",fontSize:13}}>{t.resetBtn}</button>
                  :<div>
                    <p style={{color:th.coral,fontSize:13,margin:"0 0 12px",lineHeight:1.5}}>⚠ {t.confirmReset}</p>
                    <div style={{display:"flex",gap:8}}>
                      <button onClick={()=>setConfirmReset(false)} style={{flex:1,padding:"8px 0",borderRadius:8,border:"0.5px solid "+th.border,background:"none",cursor:"pointer",color:th.t2,fontSize:13}}>{t.cancel}</button>
                      <button onClick={handleReset} style={{flex:1,padding:"8px 0",borderRadius:8,border:"none",background:th.coral,cursor:"pointer",color:"#fff",fontSize:13,fontWeight:600}}>{t.confirmResetBtn}</button>
                    </div>
                  </div>
                }
              </div>
            </div>

            <div style={{padding:"12px 20px",borderTop:"0.5px solid "+th.border,flexShrink:0}}/>
          </div>
        </>
      )}
    </>
  );
}

function Modal({ open, onClose, title, th, children }) {
  useEffect(()=>{ if(!open) return; const fn=e=>{if(e.key==="Escape")onClose();}; document.addEventListener("keydown",fn); return()=>document.removeEventListener("keydown",fn); },[open,onClose]);
  if(!open) return null;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} className="themed-scroll" style={{background:th.bgCard,border:"0.5px solid "+th.border,borderRadius:16,padding:24,maxWidth:520,width:"100%",maxHeight:"82vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <span style={{color:th.t1,fontWeight:600,fontSize:16}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,padding:4,display:"flex"}}><X size={18}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Toast({ msg, onUndo, countdown, th, t }) {
  return (
    <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",zIndex:3000,background:th.bgCard,border:"0.5px solid "+th.border,borderRadius:12,padding:"12px 20px",display:"flex",alignItems:"center",gap:16,boxShadow:"0 4px 20px "+th.shadow,minWidth:240}}>
      <span style={{color:th.t1,fontSize:14}}>{msg}</span>
      <button onClick={onUndo} style={{background:th.coral,color:"#fff",border:"none",borderRadius:8,padding:"4px 12px",cursor:"pointer",fontSize:13,fontWeight:600}}>{t.undo}</button>
      <span style={{color:th.t3,fontSize:12}}>{countdown}s</span>
    </div>
  );
}

function ImportToast({ msg, th }) {
  return (
    <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",zIndex:3000,background:th.bgCard,border:"0.5px solid "+th.border,borderRadius:12,padding:"12px 24px",display:"flex",alignItems:"center",boxShadow:"0 4px 20px "+th.shadow}}>
      <span style={{color:th.t1,fontSize:14}}>{msg}</span>
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
          else { const newId=`b_${Date.now()}_${Math.random().toString(36).slice(2,7)}`; newBeliefs.push({...b,id:newId,importedAt:new Date().toISOString()}); }
        });
      }
      const newSettings=applySettings&&parsed.data.settings?parsed.data.settings:null;
      onImport(newBeliefs, newSettings, incoming.length);
    } else {
      const recs=parsed.recs;
      const importedIds=new Set(beliefs.filter(b=>b.filterRef).map(b=>b.filterRef?.recordId));
      const toImport=recs.filter(r=>{const rid=r.id||r.recordId||String(r);return filterSel[rid];});
      const newBs=toImport.map(r=>{
        const rid=r.id||r.recordId||String(r);
        const text=r.item||r.text||r.belief||r.name||"";
        return {id:`b_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,belief:text,source:"filter",
          createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),
          evidence:[],evaluations:[],awareness:{note:""},
          transform:{wantToTransform:false,path:null,perspectiveText:"",newBelief:"",aiSuggestions:{perspective:[],replace:[]},records:[]},
          filterRef:{recordId:rid,item:text,alignScore:r.alignScore??null,beliefChoice:r.beliefChoice??null,result:r.result??null,answers:r.answers??null,importedAt:new Date().toISOString()},
          importedAt:new Date().toISOString()};
      });
      onImport([...beliefs,...newBs], null, newBs.length);
    }
    onClose();
  }

  if(!open) return null;
  const conflicts=parsed?.type==="own"?parsed.data.beliefs.filter(b=>beliefs.some(x=>x.id===b.id)):[];
  const fmtDate=iso=>{const d=new Date(iso);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;};
  const importedIds=new Set(beliefs.filter(b=>b.filterRef).map(b=>b.filterRef?.recordId));
  const btnP={background:th.accent,color:"#fff",border:"none",borderRadius:20,padding:"9px 20px",fontSize:13,fontWeight:600,cursor:"pointer"};
  const btnS={background:"none",border:"0.5px solid "+th.border,borderRadius:20,padding:"9px 20px",fontSize:13,color:th.t3,cursor:"pointer"};
  const radioRow=(val,label)=>(
    <label key={val} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",marginBottom:6}}>
      <input type="radio" name="conflict" value={val} checked={conflictMode===val} onChange={()=>setConflictMode(val)} style={{accentColor:th.accent}}/>
      <span style={{color:th.t2,fontSize:13}}>{label}</span>
    </label>
  );

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} className="themed-scroll" style={{background:th.bgCard,border:"0.5px solid "+th.border,borderRadius:16,padding:24,maxWidth:520,width:"100%",maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <span style={{color:th.t1,fontWeight:600,fontSize:16}}>{t.importTitle}</span>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,padding:4,display:"flex"}}><X size={18}/></button>
        </div>

        {!parsed&&(
          <>
            <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={handleDrop} onClick={()=>fileRef.current?.click()}
              style={{border:`1.5px dashed ${dragOver?th.accent:th.border}`,borderRadius:12,padding:"32px 20px",textAlign:"center",cursor:"pointer",background:dragOver?th.accent+"11":"transparent",transition:"all 0.15s",marginBottom:16}}>
              <Upload size={28} color={th.t3} style={{margin:"0 auto 10px",display:"block"}}/>
              <p style={{color:th.t3,fontSize:13,margin:0}}>{t.dropOrClick}</p>
            </div>
            <input ref={fileRef} type="file" accept=".json" style={{display:"none"}} onChange={handleFile}/>
            {err&&<p style={{color:"#E07A8A",fontSize:13,marginTop:0,marginBottom:0}}>{err}</p>}
          </>
        )}

        {parsed?.type==="own"&&(
          <div>
            <p style={{color:th.t2,fontSize:14,marginBottom:4,fontWeight:600}}>{t.importPreviewTitle}</p>
            <p style={{color:th.t3,fontSize:13,marginBottom:4}}>{t.importTotal.replace("{n}",parsed.data.beliefs.length)}</p>
            {conflicts.length>0&&<p style={{color:"#E0AC48",fontSize:13,marginBottom:12}}>{t.importConflict.replace("{m}",conflicts.length)}</p>}
            {conflicts.length>0&&(
              <div style={{marginBottom:14}}>
                <p style={{color:th.t2,fontSize:13,fontWeight:600,marginBottom:8}}>{t.conflictHandling}</p>
                {radioRow("overwrite",t.conflictOverwrite)}
                {radioRow("skip",t.conflictSkip)}
                {radioRow("keepBoth",t.conflictKeepBoth)}
                <div style={{marginTop:10}}>
                  <button onClick={()=>setConflictOpen(v=>!v)} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,fontSize:12,padding:0,display:"flex",alignItems:"center",gap:4}}>
                    {conflictOpen?<ChevronUp size={12}/>:<ChevronDown size={12}/>}{t.conflictList}
                  </button>
                  {conflictOpen&&<div style={{marginTop:8,paddingLeft:12}}>{conflicts.map(b=><div key={b.id} style={{color:th.t3,fontSize:12,marginBottom:4}}>- 「{b.belief}」</div>)}</div>}
                </div>
              </div>
            )}
            {parsed.data.settings&&(
              <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",marginBottom:14}}>
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
            <div style={{display:"flex",gap:12,marginBottom:10}}>
              <button onClick={()=>{const s={};parsed.recs.forEach(r=>{const rid=r.id||r.recordId||String(r);s[rid]=true;});setFilterSel(s);}} style={{background:"none",border:"0.5px solid "+th.border,borderRadius:8,cursor:"pointer",color:th.t3,padding:"4px 10px",fontSize:12}}>{t.selectAll}</button>
              <button onClick={()=>{const s={};parsed.recs.forEach(r=>{const rid=r.id||r.recordId||String(r);s[rid]=false;});setFilterSel(s);}} style={{background:"none",border:"0.5px solid "+th.border,borderRadius:8,cursor:"pointer",color:th.t3,padding:"4px 10px",fontSize:12}}>{t.deselectAll}</button>
            </div>
            <div style={{maxHeight:280,overflowY:"auto"}}>
              {parsed.recs.map((r,i)=>{
                const rid=r.id||r.recordId||String(i);
                const text=r.item||r.text||r.belief||r.name||"(?)";
                const already=importedIds.has(rid);
                return (
                  <label key={rid} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,cursor:"pointer",marginBottom:4,background:filterSel[rid]?th.accent+"15":"transparent",border:"0.5px solid "+(filterSel[rid]?th.accent:th.border)}}>
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
          <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:16}}>
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
  const map={nourishing:{b:"#4EAD88",c:"#6DDDB4",l:t.statBadge_4},unevaluated:{b:th.border,c:th.t3,l:t.statBadge_none},unsure:{b:th.border,c:th.t3,l:t.statBadge_unsure},draining:{b:"#A04848",c:"#E08888",l:t.statBadge_2},balanced:{b:"#A87E2A",c:"#E0AC48",l:t.statBadge_3}};
  const last=belief.evaluations[belief.evaluations.length-1];
  if(s==="nourishing"&&last?.score===5) return <span style={{fontSize:11,border:"0.5px solid #4EAD88",borderRadius:10,padding:"2px 8px",color:"#6DDDB4"}}>{t.statBadge_5}</span>;
  const m=map[s]||map.unevaluated;
  return <span style={{fontSize:11,border:"0.5px solid "+m.b,borderRadius:10,padding:"2px 8px",color:m.c}}>{m.l}</span>;
}

// ── ListView ──────────────────────────────────────────────────────────────────
function ListView({ th, t, settings, onSettings, beliefs, onSelect, onDelete, onAdd, toast, onUndo, onExport, onImport, onExportMD, onResetAll, user, onLogout, syncStatus }) {
  const [filter,setFilter]=useState("all"), [about,setAbout]=useState(false);
  const tabs=["all","nourishing","balanced","draining","unsure","unevaluated"];
  const filtered=filter==="all"?beliefs:beliefs.filter(b=>getStatus(b)===filter);
  return (
    <div style={{background:th.bg,minHeight:"100vh",color:th.t1,display:"flex",flexDirection:"column"}}>
      <Header th={th} t={t} settings={settings} onSettings={onSettings} onAbout={()=>setAbout(true)} title={t.appTitle} onExport={onExport} onImport={onImport} onExportMD={onExportMD} onResetAll={onResetAll} user={user} onLogout={onLogout} syncStatus={syncStatus}/>
      <div style={{overflowX:"auto",borderBottom:"0.5px solid "+th.border,flexShrink:0,scrollbarWidth:"none",msOverflowStyle:"none"}} className="hide-scrollbar">
        <div style={{display:"flex",gap:0,padding:"0 16px",justifyContent:"center",minWidth:"max-content"}}>
          {tabs.map(tab=>(
            <button key={tab} onClick={()=>setFilter(tab)} style={{background:filter===tab?th.bgCard:"transparent",border:filter===tab?"0.5px solid "+th.border:"0.5px solid transparent",borderBottom:filter===tab?"0.5px solid "+th.bgCard:"none",borderRadius:"8px 8px 0 0",padding:"10px 14px",cursor:"pointer",color:filter===tab?th.accent:th.t3,fontSize:12,fontWeight:filter===tab?600:400,whiteSpace:"nowrap",transition:"all 0.15s",marginBottom:"-0.5px"}}>
              {t[tab==="all"?"allBeliefs":tab]}
            </button>
          ))}
        </div>
      </div>
      <div style={{padding:"8px 16px 100px"}}>
        {filtered.length===0&&<div style={{textAlign:"center",color:th.t3,fontSize:13,marginTop:60}}>{t.noBeliefs}</div>}
        {filtered.map(b=><BeliefCard key={b.id} belief={b} th={th} t={t} onSelect={onSelect} onDelete={onDelete}/>)}
      </div>
      <button onClick={onAdd} style={{position:"fixed",bottom:24,right:24,width:56,height:56,borderRadius:28,background:th.accent,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px "+th.shadow,zIndex:50}}><Plus size={24} color="#fff"/></button>
      {toast&&<Toast msg={t.deleted} onUndo={onUndo} countdown={toast.countdown} th={th} t={t}/>}
      <Modal open={about} onClose={()=>setAbout(false)} title={t.about} th={th}>
        <AboutContent th={th} t={t} lang={settings.lang}/>
      </Modal>
    </div>
  );
}

function BeliefCard({ belief, th, t, onSelect, onDelete }) {
  const [conf,setConf]=useState(false), [hov,setHov]=useState(false);
  const isTouch=useRef(typeof window!=="undefined"&&window.matchMedia("(pointer:coarse)").matches).current;
  const showDel=isTouch||hov;
  return (
    <div onMouseEnter={()=>!isTouch&&setHov(true)} onMouseLeave={()=>{if(!isTouch){setHov(false);setConf(false);}}} onClick={()=>{if(!conf)onSelect(belief.id);}}
      style={{background:th.bgCard,border:"0.5px solid "+(hov?th.borderHover:th.border),borderRadius:12,padding:"14px 16px",marginBottom:10,cursor:"pointer",transition:"border-color 0.15s"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
        <div style={{flex:1,overflow:"hidden"}}>
          <p style={{color:th.t1,fontSize:14,margin:"0 0 8px",lineHeight:1.5,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>「{belief.belief}」</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,alignItems:"center"}}>
            <ScoreBadge belief={belief} t={t} th={th}/>
            {belief.importedAt&&<span style={{fontSize:10,color:th.accent,border:"0.5px solid "+th.accent,borderRadius:8,padding:"1px 6px"}}>{t.importedBadge}</span>}
            {belief.transform.wantToTransform&&<span style={{fontSize:11,color:th.accent,border:"0.5px solid "+th.accent,borderRadius:10,padding:"2px 8px"}}>{t.transforming}</span>}
            {(belief.evidence.length>0||belief.transform.records.length>0)&&<span style={{fontSize:11,color:th.t3}}>{belief.evidence.length>0?t.factsN.replace("{n}",belief.evidence.length):""}{belief.evidence.length>0&&belief.transform.records.length>0?" · ":""}{belief.transform.records.length>0?t.recordsN.replace("{n}",belief.transform.records.length):""}</span>}
          </div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
          {showDel&&!conf&&<button onClick={e=>{e.stopPropagation();setConf(true);}} style={{background:"none",border:"0.5px solid "+th.border,borderRadius:6,cursor:"pointer",color:th.t3,padding:"4px 6px",display:"flex"}}><Trash2 size={14}/></button>}
          {conf&&<div style={{display:"flex",gap:6}} onClick={e=>e.stopPropagation()}>
            <button onClick={()=>onDelete(belief.id)} style={{background:"#A04848",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",padding:"4px 10px",fontSize:12}}>{t.deleteYes}</button>
            <button onClick={()=>setConf(false)} style={{background:"none",border:"0.5px solid "+th.border,borderRadius:6,cursor:"pointer",color:th.t3,padding:"4px 10px",fontSize:12}}>{t.deleteNo}</button>
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
  const [loading,setLoading]=useState(false), [err,setErr]=useState(null);
  const [filterRecs,setFilterRecs]=useState([]), [filterFile,setFilterFile]=useState(null);
  const [copyEventPromptDone,setCopyEventPromptDone]=useState(false);
  const fileRef=useRef(null);
  const importedRef=useRef(new Set(beliefs.filter(b=>b.filterRef).map(b=>b.filterRef?.recordId)));
  const [about,setAbout]=useState(false);

  function make(text,source,filterRef=null,ev=null) {
    const b={id:gid("b"),belief:text.trim(),source,createdAt:now(),updatedAt:now(),
      evidence:ev?[{id:gid("e"),text:ev,createdAt:now()}]:[],evaluations:[],awareness:{note:""},
      transform:{wantToTransform:false,path:null,perspectiveText:"",newBelief:"",aiSuggestions:{perspective:[],replace:[]},records:[]},filterRef};
    onCreate(b);
  }
  async function doAI() {
    setLoading(true);setErr(null);
    try { const d=await callAI(pEvent(evDesc,evReact,settings.lang)); setAiBeliefs(d.beliefs||[]); }
    catch(e){ setErr(e?.message==="AI_NOT_CONFIGURED"?t.aiNotConfigured:t.aiError); }
    finally{ setLoading(false); }
  }
  function handleFilterFile(file) {
    if(!file) return;
    const reader=new FileReader();
    reader.onload=e=>{ try{ const data=JSON.parse(e.target.result); const recs=Array.isArray(data)?data:(data.records||data.beliefs||data.items||[]); setFilterRecs(recs); setFilterFile(file.name); }catch{ setErr(t.importError||"格式錯誤"); } };
    reader.readAsText(file);
  }
  function copyEventPrompt() {
    const prompt = pEvent(evDesc, evReact, settings.lang);
    navigator.clipboard.writeText(prompt).then(()=>{ setCopyEventPromptDone(true); setTimeout(()=>setCopyEventPromptDone(false),2000); });
  }

  const inp={width:"100%",background:th.bgDeep,border:"0.5px solid "+th.border,borderRadius:10,color:th.t1,padding:"12px 14px",fontSize:14,outline:"none",boxSizing:"border-box",lineHeight:1.6,fontFamily:"inherit"};
  const btnP={background:th.accent,color:"#fff",border:"none",borderRadius:20,padding:"11px 24px",fontSize:14,fontWeight:600,cursor:"pointer"};
  const btnS={background:"none",border:"0.5px solid "+th.border,borderRadius:20,padding:"11px 20px",fontSize:13,color:th.t3,cursor:"pointer"};
  const guides=[
    {id:"direct",label:t.guideA,desc:t.guideDescA,icon:<Edit3 size={20}/>},
    {id:"event",label:t.guideB,desc:t.guideDescB,icon:<Sparkles size={20}/>},
    {id:"filter",label:t.guideC,desc:t.guideDescC,icon:<Filter size={20}/>},
  ];

  return (
    <div style={{background:th.bg,minHeight:"100vh",color:th.t1}}>
      <Header th={th} t={t} settings={settings} onSettings={onSettings} onAbout={()=>setAbout(true)}
        left={<button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:th.t2,display:"flex",alignItems:"center",gap:5,padding:"4px 0",fontSize:14,flexShrink:0}}><ArrowLeft size={16}/>{t.back}</button>}
        title={t.addBelief} onResetAll={onResetAll} user={user} onLogout={onLogout} syncStatus={syncStatus}/>
      <div style={{padding:20,maxWidth:600,margin:"0 auto"}}>
        {step==="guide"&&(<>
          <p style={{color:th.t2,fontSize:15,margin:"0 0 20px",lineHeight:1.7}}>{t.guideQ}</p>
          {guides.map(g=>(
            <button key={g.id} onClick={()=>setStep(g.id)}
              style={{display:"flex",alignItems:"flex-start",gap:16,background:th.bgCard,border:"0.5px solid "+th.border,borderRadius:14,padding:"18px 20px",cursor:"pointer",textAlign:"left",width:"100%",marginBottom:12,transition:"border-color 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=th.accent}
              onMouseLeave={e=>e.currentTarget.style.borderColor=th.border}>
              <span style={{color:th.accent,marginTop:2,flexShrink:0}}>{g.icon}</span>
              <div><div style={{color:th.t1,fontWeight:600,fontSize:15,marginBottom:4}}>{g.label}</div><div style={{color:th.t3,fontSize:13}}>{g.desc}</div></div>
            </button>
          ))}
        </>)}

        {step==="direct"&&(<>
          <button onClick={()=>setStep("guide")} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,fontSize:13,padding:0,marginBottom:16,display:"flex",alignItems:"center",gap:4}}><ArrowLeft size={13}/>{t.changeEntry}</button>
          <AutoTextarea value={directText} onChange={e=>setDirectText(e.target.value)} placeholder={t.beliefPlaceholder} minRows={3} style={inp}/>
          <div style={{display:"flex",justifyContent:"flex-end",marginTop:12}}>
            <button onClick={()=>{if(directText.trim()){make(directText,"direct");onBack();}}} disabled={!directText.trim()} style={{...btnP,opacity:directText.trim()?1:0.4}}>{t.createBelief}</button>
          </div>
        </>)}

        {step==="event"&&!aiBeliefs&&(<>
          <button onClick={()=>setStep("guide")} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,fontSize:13,padding:0,marginBottom:16,display:"flex",alignItems:"center",gap:4}}><ArrowLeft size={13}/>{t.changeEntry}</button>
          <label style={{color:th.t2,fontSize:13,display:"block",marginBottom:6}}>{t.eventDesc}</label>
          <AutoTextarea value={evDesc} onChange={e=>setEvDesc(e.target.value)} minRows={3} style={{...inp,marginBottom:14}}/>
          <label style={{color:th.t2,fontSize:13,display:"block",marginBottom:6}}>{t.myReaction}</label>
          <AutoTextarea value={evReact} onChange={e=>setEvReact(e.target.value)} minRows={3} style={{...inp,marginBottom:16}}/>
          {err&&<div style={{color:"#E07A8A",fontSize:13,marginBottom:12}}>{err}</div>}
          <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
            <button onClick={doAI} disabled={loading||(!evDesc.trim()&&!evReact.trim())} style={{...btnP,display:"flex",alignItems:"center",gap:8,opacity:loading?0.6:1}}>
              {loading?<><RefreshCw size={16} style={{animation:"spin 1s linear infinite"}}/>{t.loading}</>:<><Sparkles size={16}/>{t.analyzeWithAI}</>}
            </button>
          </div>
          <div style={{display:"flex",justifyContent:"center"}}>
            <button onClick={copyEventPrompt} disabled={!evDesc.trim()&&!evReact.trim()} style={{...btnS,display:"flex",alignItems:"center",gap:6,opacity:(!evDesc.trim()&&!evReact.trim())?0.4:1}}>
              <Copy size={13}/>{copyEventPromptDone?t.promptCopied:t.copyPrompt}
            </button>
          </div>
        </>)}

        {step==="event"&&aiBeliefs&&(<>
          <p style={{color:th.t2,fontSize:14,margin:"0 0 4px"}}>{t.selectBeliefs}</p>
          <p style={{color:th.t3,fontSize:12,margin:"0 0 16px"}}>{t.selectHint}</p>
          {aiBeliefs.map((item,i)=>{ const isSel=selected.some(s=>s.text===item.text); return (
            <div key={i} onClick={()=>setSelected(p=>isSel?p.filter(s=>s.text!==item.text):[...p,item])}
              style={{background:isSel?th.accent+"22":th.bgCard,border:"0.5px solid "+(isSel?th.accent:th.border),borderRadius:12,padding:"14px 16px",marginBottom:10,cursor:"pointer",transition:"all 0.15s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                <div><p style={{color:th.t1,fontSize:14,margin:"0 0 4px"}}>「{item.text}」</p><p style={{color:th.t3,fontSize:12,margin:0}}>{item.explanation}</p></div>
                {isSel&&<Check size={16} color={th.accent} style={{flexShrink:0,marginTop:2}}/>}
              </div>
            </div>
          );})}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8,gap:10}}>
            <button onClick={()=>{setAiBeliefs(null);setSelected([]);}} style={btnS}><ArrowLeft size={13} style={{verticalAlign:"middle",marginRight:4}}/>{t.changeEntry}</button>
            <button onClick={()=>{selected.forEach(item=>make(item.text,"event",null,evDesc.trim()||null));onBack();}} disabled={selected.length===0}
              style={{...btnP,opacity:selected.length>0?1:0.4}}>{t.addSelected} ({selected.length})</button>
          </div>
        </>)}

        {step==="filter"&&(<>
          <button onClick={()=>setStep("guide")} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,fontSize:13,padding:0,marginBottom:16,display:"flex",alignItems:"center",gap:4}}><ArrowLeft size={13}/>{t.changeEntry}</button>
          {!filterFile?(
            <div style={{textAlign:"center",padding:"40px 20px"}}>
              <p style={{color:th.t2,fontSize:14,marginBottom:16,lineHeight:1.6}}>{t.filterImportDesc}</p>
              <input ref={fileRef} type="file" accept=".json" style={{display:"none"}} onChange={e=>handleFilterFile(e.target.files[0])}/>
              <button onClick={()=>fileRef.current?.click()} style={{...btnP,display:"inline-flex",alignItems:"center",gap:8}}><Upload size={16}/>{t.importBtn}</button>
              {err&&<p style={{color:"#E07A8A",fontSize:13,marginTop:12}}>{err}</p>}
            </div>
          ):(
            <>
              <p style={{color:th.t3,fontSize:12,marginBottom:12}}>{filterFile}</p>
              {filterRecs.length===0
                ?<div style={{color:th.t3,fontSize:13,textAlign:"center",marginTop:40}}>{t.noFilterData}</div>
                :filterRecs.map((rec,i)=>{ const rid=rec.id||rec.recordId||String(i); const text=rec.item||rec.text||rec.belief||rec.name||"(無)"; const done=importedRef.current.has(rid); return(
                  <div key={rid} style={{background:th.bgCard,border:"0.5px solid "+th.border,borderRadius:12,padding:"14px 16px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
                    <div style={{flex:1,overflow:"hidden"}}><p style={{color:th.t1,fontSize:14,margin:"0 0 4px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{text}</p>{rec.result&&<span style={{fontSize:11,color:th.t3}}>{rec.result}</span>}</div>
                    {done?<span style={{fontSize:12,color:th.t3,flexShrink:0}}>{t.imported}</span>
                      :<button onClick={()=>{make(text,"filter",{recordId:rid,item:text,alignScore:rec.alignScore||null,result:rec.result||null,importedAt:now()});importedRef.current.add(rid);}} style={{background:th.accent,color:"#fff",border:"none",borderRadius:14,padding:"5px 14px",fontSize:12,cursor:"pointer",flexShrink:0}}>{t.bringIn}</button>}
                  </div>
                );})
              }
            </>
          )}
        </>)}
      </div>
      <Modal open={about} onClose={()=>setAbout(false)} title={t.about} th={th}>
        <AboutContent th={th} t={t} lang={settings.lang}/>
      </Modal>
    </div>
  );
}

// ── DetailView ────────────────────────────────────────────────────────────────
function DetailView({ th, t, settings, onSettings, belief, onUpdate, onBack, toast, onUndo, onResetAll, user, onLogout, syncStatus }) {
  const [editB,setEditB]=useState(false), [bDraft,setBDraft]=useState(belief.belief);
  const [newFact,setNewFact]=useState(""), [editFactId,setEditFactId]=useState(null), [editFactText,setEditFactText]=useState("");
  const [evalScore,setEvalScore]=useState(null), [evalUnsure,setEvalUnsure]=useState(false), [evalNote,setEvalNote]=useState("");
  const [editEvalId,setEditEvalId]=useState(null), [editEvalScore,setEditEvalScore]=useState(null), [editEvalUnsure,setEditEvalUnsure]=useState(false), [editEvalNote,setEditEvalNote]=useState("");
  const [deleteEvalId,setDeleteEvalId]=useState(null);
  const [awareness,setAwareness]=useState(belief.awareness.note||"");
  const [expandTr,setExpandTr]=useState(belief.transform.wantToTransform);
  const [aiLoad,setAiLoad]=useState(false), [aiErr,setAiErr]=useState(null), [cd,setCd]=useState(0);
  const [showRec,setShowRec]=useState(false), [recEv,setRecEv]=useState(""), [recRx,setRecRx]=useState(""), [recDir,setRecDir]=useState("new");
  const [fHov,setFHov]=useState(null), [fConf,setFConf]=useState(null);
  const isTouch=useRef(typeof window!=="undefined"&&window.matchMedia("(pointer:coarse)").matches).current;
  const [fltExp,setFltExp]=useState(false), [histOpen,setHistOpen]=useState(false), [about,setAbout]=useState(false);
  const [saved,setSaved]=useState(false), [copied,setCopied]=useState(false);
  const cdRef=useRef(null);

  const saveAware=useDebounce(v=>onUpdate(b=>({...b,awareness:{note:v}})),1000);
  useEffect(()=>{ saveAware(awareness); },[awareness]);
  useEffect(()=>{ if(cd<=0) return; cdRef.current=setInterval(()=>setCd(p=>{ if(p<=1){clearInterval(cdRef.current);return 0;} return p-1;}),1000); return()=>clearInterval(cdRef.current); },[cd>0]);

  const cur=belief.evaluations[belief.evaluations.length-1]||null;
  const status=getStatus(belief);
  const inp={width:"100%",background:th.bgDeep,border:"0.5px solid "+th.border,borderRadius:8,color:th.t1,padding:"10px 12px",fontSize:14,outline:"none",boxSizing:"border-box",lineHeight:1.6,fontFamily:"inherit"};
  const blk={background:th.bgCard,border:"0.5px solid "+th.border,borderRadius:12,padding:16,marginBottom:12};
  const btnP={background:th.accent,color:"#fff",border:"none",borderRadius:20,padding:"9px 20px",fontSize:13,fontWeight:600,cursor:"pointer"};
  const btnS={background:"none",border:"0.5px solid "+th.border,borderRadius:20,padding:"9px 20px",fontSize:13,color:th.t3,cursor:"pointer"};
  const blkL={color:th.accent,fontWeight:600,fontSize:13,display:"block",marginBottom:10};
  const sOpts=[{v:1,l:t.score1},{v:2,l:t.score2},{v:3,l:t.score3},{v:4,l:t.score4},{v:5,l:t.score5}];
  const dOpts=[{id:"new",l:t.dirNew,c:SC[5]},{id:"old",l:t.dirOld,c:SC[1]},{id:"mixed",l:t.dirMixed,c:SC[3]}];
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
  async function runAI(type){ if(cd>0||aiLoad) return; setAiLoad(true);setAiErr(null);
    try{ const s=cur?.isUnsure?null:cur?.score??null,n=cur?.note||"",a=belief.awareness.note||"";
      const d=await callAI(type==="perspective"?pPersp(belief.belief,s,n,a,settings.lang):pReplace(belief.belief,s,n,a,settings.lang));
      onUpdate(b=>({...b,transform:{...b.transform,aiSuggestions:{...b.transform.aiSuggestions,[type]:d.perspectives||d.beliefs||[]}}})); setCd(10);
    }catch(e){ setAiErr(e?.message==="AI_NOT_CONFIGURED"?t.aiNotConfigured:t.aiError); }
    finally{ setAiLoad(false); }
  }
  function copyPrompt(type){ const p=buildCopyPrompt(type,belief.belief,cur,belief.awareness.note,settings.lang); navigator.clipboard.writeText(p).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);}); }
  function saveTrText(field,val){ onUpdate(b=>({...b,transform:{...b.transform,[field]:val}})); setSaved(true);setTimeout(()=>setSaved(false),2000); }
  function addRec(){ if(!recEv.trim()) return; onUpdate(b=>({...b,transform:{...b.transform,records:[...b.transform.records,{id:gid("r"),event:recEv.trim(),reaction:recRx.trim(),direction:recDir,createdAt:now()}]}})); setRecEv("");setRecRx("");setRecDir("new");setShowRec(false); }

  const awPrompt=(evalUnsure||cur?.isUnsure)?t.awarenessPromptUnsure:t.awarenessPrompt;

  return (
    <div style={{background:th.bg,minHeight:"100vh",color:th.t1}}>
      <Header th={th} t={t} settings={settings} onSettings={onSettings} onAbout={()=>setAbout(true)} onHistory={()=>setHistOpen(true)} showHistory
        left={<button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",color:th.t2,display:"flex",alignItems:"center",gap:5,padding:"4px 0",fontSize:14,flexShrink:0}}><ArrowLeft size={16}/>{t.back}</button>}
        title={t.appTitle}
        onExportSingleMD={()=>exportSingleMD(belief,settings.lang)}
        onResetAll={onResetAll} user={user} onLogout={onLogout} syncStatus={syncStatus}/>
      <div style={{padding:"12px 16px 100px"}}>

        {/* Block 1 */}
        <div style={blk}>
          <span style={blkL}>{t.block1}</span>
          {editB?(
            <div>
              <AutoTextarea value={bDraft} onChange={e=>setBDraft(e.target.value)} minRows={2} style={{...inp,marginBottom:10}}/>
              <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
                <button onClick={()=>{setBDraft(belief.belief);setEditB(false);}} style={btnS}>{t.cancel}</button>
                <button onClick={()=>{onUpdate(b=>({...b,belief:bDraft.trim()}));setEditB(false);}} style={btnP}><Check size={14}/></button>
              </div>
            </div>
          ):(
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:14}}>
              <p style={{color:th.t1,fontSize:15,margin:0,lineHeight:1.7,flex:1}}>「{belief.belief}」</p>
              <button onClick={()=>setEditB(true)} style={{background:"none",border:"0.5px solid "+th.border,borderRadius:8,cursor:"pointer",color:th.t3,padding:"6px 8px",flexShrink:0,display:"flex",alignItems:"center"}}><Edit3 size={14}/></button>
            </div>
          )}
          <span style={{color:th.t2,fontSize:12,display:"block",marginBottom:10}}>{t.supportingFacts}</span>
          {belief.evidence.length===0&&<p style={{color:th.t3,fontSize:12,margin:"0 0 10px"}}>—</p>}
          {belief.evidence.map(ev=>(
            <div key={ev.id}>
              {editFactId===ev.id?(
                <div style={{background:th.bgDeep,borderRadius:8,padding:"10px 12px",marginBottom:6}}>
                  <AutoTextarea value={editFactText} onChange={e=>setEditFactText(e.target.value)} minRows={1} style={{...inp,marginBottom:8,padding:"8px 10px"}}/>
                  <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
                    <button onClick={()=>setEditFactId(null)} style={{...btnS,padding:"6px 14px",fontSize:12}}>{t.cancel}</button>
                    <button onClick={saveEditFact} style={{...btnP,padding:"6px 14px",fontSize:12}}>{t.saveEdit}</button>
                  </div>
                </div>
              ):(
                <div onMouseEnter={()=>!isTouch&&setFHov(ev.id)} onMouseLeave={()=>{if(!isTouch){setFHov(null);if(fConf===ev.id)setFConf(null);}}}
                  style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:th.bgDeep,borderRadius:8,padding:"9px 12px",marginBottom:6}}>
                  <span style={{color:th.t2,fontSize:13,flex:1,lineHeight:1.5}}>{ev.text}</span>
                  <div style={{display:"flex",gap:4,flexShrink:0,marginLeft:8}}>
                    {(isTouch||fHov===ev.id)&&fConf!==ev.id&&<button onClick={()=>startEditFact(ev)} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,padding:"2px 4px",display:"flex"}}><Edit3 size={13}/></button>}
                    {(isTouch||fHov===ev.id)&&fConf!==ev.id&&<button onClick={()=>setFConf(ev.id)} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,padding:"2px 4px",display:"flex"}}><Trash2 size={13}/></button>}
                    {fConf===ev.id&&<>
                      <button onClick={()=>rmFact(ev.id)} style={{background:"#A04848",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",padding:"2px 10px",fontSize:12}}>{t.deleteYes}</button>
                      <button onClick={()=>setFConf(null)} style={{background:"none",border:"0.5px solid "+th.border,borderRadius:6,cursor:"pointer",color:th.t3,padding:"2px 10px",fontSize:12}}>{t.deleteNo}</button>
                    </>}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <input value={newFact} onChange={e=>setNewFact(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addFact()} placeholder={t.factPlaceholder} style={{flex:1,background:th.bgDeep,border:"0.5px solid "+th.border,borderRadius:8,color:th.t1,padding:"9px 12px",fontSize:13,outline:"none",boxSizing:"border-box"}}/>
            <button onClick={addFact} disabled={!newFact.trim()} style={{...btnP,padding:"9px 14px",opacity:newFact.trim()?1:0.4,flexShrink:0,display:"flex",alignItems:"center"}}><Plus size={16}/></button>
          </div>
        </div>

        {/* Block 2 */}
        <div style={blk}>
          <span style={blkL}>{t.block2}</span>
          <p style={{color:th.t2,fontSize:13,margin:"0 0 14px"}}>{t.howAffect}</p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
            {sOpts.map(o=>{const a=!evalUnsure&&evalScore===o.v;return(
              <button key={o.v} onClick={()=>{setEvalScore(o.v);setEvalUnsure(false);}} style={{flex:"1 1 68px",minWidth:60,padding:"10px 4px",borderRadius:10,border:`${a?2:1}px solid ${a?SC[o.v]:th.border}`,background:a?SC[o.v]+"22":"transparent",color:a?SC[o.v]:th.t3,cursor:"pointer",fontSize:11,fontWeight:a?700:400,transition:"all 0.15s",textAlign:"center"}}>
                <div style={{fontSize:17,fontWeight:700,marginBottom:2}}>{o.v}</div><div style={{lineHeight:1.3}}>{o.l}</div>
              </button>);})}
            <button onClick={()=>{setEvalUnsure(true);setEvalScore(null);}} style={{flex:"1 1 55px",minWidth:50,padding:"10px 4px",borderRadius:10,border:`${evalUnsure?2:1}px solid ${evalUnsure?th.t3:th.border}`,background:evalUnsure?th.t3+"22":"transparent",color:evalUnsure?th.t2:th.t3,cursor:"pointer",fontSize:11,textAlign:"center",transition:"all 0.15s"}}>
              <div style={{fontSize:17,fontWeight:700,marginBottom:2}}>?</div><div style={{lineHeight:1.3}}>{t.scoreUnsure}</div>
            </button>
          </div>
          <label style={{color:th.t3,fontSize:12,display:"block",marginBottom:6}}>{t.whyScore}</label>
          <AutoTextarea value={evalNote} onChange={e=>setEvalNote(e.target.value)} placeholder={t.whyPlaceholder} minRows={2} style={{...inp,marginBottom:12}}/>
          <div style={{display:"flex",justifyContent:"flex-end"}}>
            <button onClick={saveEval} disabled={evalScore===null&&!evalUnsure} style={{...btnP,opacity:(evalScore!==null||evalUnsure)?1:0.4,cursor:(evalScore!==null||evalUnsure)?"pointer":"not-allowed"}}>{t.saveEval}</button>
          </div>
          {belief.evaluations.length>0&&(
            <div style={{marginTop:14,paddingTop:14,borderTop:"0.5px solid "+th.border,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
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
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:expandTr?14:0}}>
            <span style={blkL}>{t.block4}</span>
            {expandTr&&<button onClick={stopTr} style={{background:"none",border:"none",cursor:"pointer",color:th.t3,fontSize:12,padding:0}}>{t.stopTransform}</button>}
          </div>
          {!expandTr&&(<div><p style={{color:th.t3,fontSize:13,margin:"0 0 14px",lineHeight:1.6}}>{t[`transformHint_${status}`]}</p><button onClick={startTr} style={btnP}>{t.tryIt}</button></div>)}
          {expandTr&&(
            <div>
              <p style={{color:th.t2,fontSize:13,margin:"0 0 12px"}}>{t.choosePath}</p>
              <div style={{display:"flex",gap:10,marginBottom:20}}>
                {[{id:"perspective",l:t.pathA},{id:"replace",l:t.pathB}].map(p=>(
                  <button key={p.id} onClick={()=>setPath(p.id)} style={{flex:1,padding:"12px 10px",borderRadius:10,border:(cp===p.id?"1.5px":"0.5px")+" solid "+(cp===p.id?th.accent:th.border),background:cp===p.id?th.accent+"22":"transparent",color:cp===p.id?th.accent:th.t2,cursor:"pointer",fontSize:13,fontWeight:cp===p.id?600:400,transition:"all 0.15s",textAlign:"left",lineHeight:1.4}}>{p.l}</button>
                ))}
              </div>
              {cp&&(
                <div>
                  <div style={{background:th.bgDeep,borderRadius:8,padding:"10px 14px",marginBottom:16}}>
                    <span style={{color:th.t3,fontSize:11}}>{t.block1}</span>
                    <p style={{color:th.t2,fontSize:13,margin:"4px 0 0"}}>「{belief.belief}」</p>
                  </div>
                  {(ais[cp]||[]).map((item,i)=>{ const sv=cp==="perspective"?belief.transform.perspectiveText:belief.transform.newBelief; const isSel=sv===item.text; return(
                    <div key={i} onClick={()=>saveTrText(cp==="perspective"?"perspectiveText":"newBelief",item.text)}
                      style={{background:isSel?th.accent+"22":th.bgDeep,border:"0.5px solid "+(isSel?th.accent:th.border),borderRadius:10,padding:"12px 14px",marginBottom:8,cursor:"pointer",transition:"all 0.15s"}}>
                      <div style={{display:"flex",justifyContent:"space-between",gap:12}}>
                        <div><p style={{color:th.t1,fontSize:13,margin:"0 0 4px"}}>「{item.text}」</p><p style={{color:th.t3,fontSize:12,margin:0}}>{item.explanation}</p></div>
                        {isSel&&<Check size={15} color={th.accent} style={{flexShrink:0,marginTop:2}}/>}
                      </div>
                    </div>
                  );})}
                  {aiErr&&<div style={{color:"#E07A8A",fontSize:13,marginBottom:12}}>{aiErr} <button onClick={()=>runAI(cp)} style={{...btnS,padding:"4px 12px",fontSize:12,display:"inline-flex"}}>{t.retry}</button></div>}
                  <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
                    <button onClick={()=>runAI(cp)} disabled={aiLoad||cd>0} style={{flex:1,minWidth:120,...btnP,background:"transparent",border:"0.5px solid "+th.accent,color:th.accent,display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:(aiLoad||cd>0)?0.5:1}}>
                      {aiLoad?<><RefreshCw size={14} style={{animation:"spin 1s linear infinite"}}/>{t.loading}</>:cd>0?`${t.cooldown} ${cd}s`:<><Sparkles size={14}/>{cp==="perspective"?t.getAIPerspective:t.getAIBelief}</>}
                    </button>
                    <button onClick={()=>copyPrompt(cp)} style={{...btnS,display:"flex",alignItems:"center",gap:6,padding:"9px 14px"}}>
                      <Copy size={13}/>{copied?t.promptCopied:t.copyPrompt}
                    </button>
                  </div>
                  <label style={{color:th.t3,fontSize:12,display:"block",marginBottom:6}}>{t.yourVersion}</label>
                  <AutoTextarea value={cp==="perspective"?belief.transform.perspectiveText:belief.transform.newBelief}
                    onChange={e=>{const f=cp==="perspective"?"perspectiveText":"newBelief";onUpdate(b=>({...b,transform:{...b.transform,[f]:e.target.value}}));}}
                    placeholder={cp==="perspective"?t.yourPerspectivePlaceholder:t.yourBeliefPlaceholder} minRows={2} style={{...inp,marginBottom:6}}/>
                  {saved&&<span style={{color:SC[5],fontSize:12}}>{t.choiceSaved}</span>}
                  <div style={{marginTop:20,paddingTop:16,borderTop:"0.5px solid "+th.border}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                      <span style={{color:th.t2,fontSize:13,fontWeight:600}}>{t.practiceTitle}</span>
                      <div style={{fontSize:11,display:"flex",gap:8}}>
                        {rStat.new>0&&<span style={{color:SC[5]}}>{t.dirNew} {rStat.new}</span>}
                        {rStat.old>0&&<span style={{color:SC[1]}}>{t.dirOld} {rStat.old}</span>}
                        {rStat.mixed>0&&<span style={{color:SC[3]}}>{t.dirMixed} {rStat.mixed}</span>}
                      </div>
                    </div>
                    {belief.transform.records.map((rec,i)=>(
                      <div key={rec.id} style={{background:th.bgDeep,borderRadius:8,padding:"10px 12px",marginBottom:8}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                          <span style={{color:th.t3,fontSize:11}}>#{i+1} · {fmt(rec.createdAt)}</span>
                          <span style={{fontSize:11,color:rec.direction==="new"?SC[5]:rec.direction==="old"?SC[1]:SC[3],border:"0.5px solid "+(rec.direction==="new"?SC[5]:rec.direction==="old"?SC[1]:SC[3]),borderRadius:8,padding:"1px 8px"}}>
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
                        <div style={{background:th.bgDeep,borderRadius:10,padding:14}}>
                          <label style={{color:th.t3,fontSize:12,display:"block",marginBottom:6}}>{t.recordEvent}</label>
                          <AutoTextarea value={recEv} onChange={e=>setRecEv(e.target.value)} minRows={2} style={{...inp,marginBottom:10}}/>
                          <label style={{color:th.t3,fontSize:12,display:"block",marginBottom:6}}>{t.recordReaction}</label>
                          <AutoTextarea value={recRx} onChange={e=>setRecRx(e.target.value)} minRows={2} style={{...inp,marginBottom:10}}/>
                          <div style={{display:"flex",gap:8,marginBottom:12}}>
                            {dOpts.map(d=><button key={d.id} onClick={()=>setRecDir(d.id)} style={{flex:1,padding:"7px 4px",borderRadius:8,border:(recDir===d.id?"1.5px":"0.5px")+" solid "+(recDir===d.id?d.c:th.border),background:recDir===d.id?d.c+"22":"transparent",color:recDir===d.id?d.c:th.t3,cursor:"pointer",fontSize:12}}>{d.l}</button>)}
                          </div>
                          <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
                            <button onClick={()=>setShowRec(false)} style={{...btnS,padding:"8px 16px",fontSize:13}}>{t.cancel}</button>
                            <button onClick={addRec} disabled={!recEv.trim()} style={{...btnP,opacity:recEv.trim()?1:0.4}}>{t.saveRecord}</button>
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

        {belief.filterRef&&(
          <div style={blk}>
            <button onClick={()=>setFltExp(v=>!v)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",background:"none",border:"none",cursor:"pointer",padding:0}}>
              <span style={{color:th.t2,fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:6}}><Filter size={13}/>{t.filterRef}</span>
              {fltExp?<ChevronUp size={15} color={th.t3}/>:<ChevronDown size={15} color={th.t3}/>}
            </button>
            {fltExp&&(
              <div style={{marginTop:14,borderTop:"0.5px solid "+th.border,paddingTop:14}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
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
          const sl=ev.isUnsure?t.scoreUnsure:ev.score?`${ev.score} — ${[t.score1,t.score2,t.score3,t.score4,t.score5][ev.score-1]}`:t.scoreUnsure;
          const isEditing=editEvalId===ev.id;
          const isDeleting=deleteEvalId===ev.id;
          return(
            <div key={ev.id} style={{borderBottom:"0.5px solid "+th.border,paddingBottom:14,marginBottom:14}}>
              {isEditing?(
                <div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
                    {sOpts.map(o=>{const a=!editEvalUnsure&&editEvalScore===o.v;return(
                      <button key={o.v} onClick={()=>{setEditEvalScore(o.v);setEditEvalUnsure(false);}} style={{flex:"1 1 50px",padding:"8px 4px",borderRadius:8,border:`${a?2:1}px solid ${a?SC[o.v]:th.border}`,background:a?SC[o.v]+"22":"transparent",color:a?SC[o.v]:th.t3,cursor:"pointer",fontSize:11,textAlign:"center"}}>
                        <div style={{fontSize:14,fontWeight:700}}>{o.v}</div><div style={{fontSize:10,lineHeight:1.3}}>{o.l}</div>
                      </button>);})}
                    <button onClick={()=>{setEditEvalUnsure(true);setEditEvalScore(null);}} style={{flex:"1 1 40px",padding:"8px 4px",borderRadius:8,border:`${editEvalUnsure?2:1}px solid ${editEvalUnsure?th.t3:th.border}`,background:editEvalUnsure?th.t3+"22":"transparent",color:editEvalUnsure?th.t2:th.t3,cursor:"pointer",fontSize:11,textAlign:"center"}}>
                      <div style={{fontSize:14,fontWeight:700}}>?</div><div style={{fontSize:10}}>{t.scoreUnsure}</div>
                    </button>
                  </div>
                  <AutoTextarea value={editEvalNote} onChange={e=>setEditEvalNote(e.target.value)} placeholder={t.whyPlaceholder} minRows={2} style={{...inp,fontSize:13,marginBottom:8}}/>
                  <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
                    <button onClick={()=>setEditEvalId(null)} style={{...btnS,padding:"6px 14px",fontSize:12}}>{t.cancel}</button>
                    <button onClick={saveEditEval} style={{...btnP,padding:"6px 14px",fontSize:12}}>{t.saveEdit}</button>
                  </div>
                </div>
              ):isDeleting?(
                <div>
                  <p style={{color:th.coral,fontSize:13,margin:"0 0 10px"}}>{t.confirmDeleteEval}</p>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>setDeleteEvalId(null)} style={{...btnS,padding:"6px 14px",fontSize:12}}>{t.cancel}</button>
                    <button onClick={()=>deleteEval(ev.id)} style={{background:th.coral,color:"#fff",border:"none",borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>{t.deleteBtn}</button>
                  </div>
                </div>
              ):(
                <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <span style={{color:th.t3,fontSize:12}}>{fmt(ev.createdAt)}</span>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:13,fontWeight:600,color:ev.isUnsure?th.t3:SC[ev.score]}}>{sl}</span>
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
      <Modal open={about} onClose={()=>setAbout(false)} title={t.about} th={th}>
        <AboutContent th={th} t={t} lang={settings.lang}/>
      </Modal>
      {toast&&<Toast msg={t.deleted} onUndo={onUndo} countdown={toast.countdown} th={th} t={t}/>}
    </div>
  );
}

// ── Root (BeliefApp) ──────────────────────────────────────────────────────────
export default function BeliefApp({ user, onLogout }) {
  const { beliefs, settings, syncStatus, addBelief, updateBelief, deleteBelief, updateSettings, replaceBeliefs } = useSync(user);
  const [view,setView]=useState("list");
  const [selId,setSelId]=useState(null);
  const [toast,setToast]=useState(null);
  const [delB,setDelB]=useState(null);
  const [importModal,setImportModal]=useState(false);
  const [importToast,setImportToast]=useState(null);
  const cdRef=useRef(null);
  const t=T[settings.lang], th=THEMES[settings.theme]||THEMES.d1;

  useEffect(()=>{
    if(!toast) return;
    clearInterval(cdRef.current);
    cdRef.current=setInterval(()=>setToast(p=>{if(!p)return null;if(p.countdown<=1){clearInterval(cdRef.current);setDelB(null);return null;}return{...p,countdown:p.countdown-1};}),1000);
    return()=>clearInterval(cdRef.current);
  },[toast?.belief?.id]);

  function delBelief(id){ const b=beliefs.find(x=>x.id===id); if(!b) return; deleteBelief(id); setDelB(b); setToast({belief:b,countdown:8}); if(view==="detail"){setView("list");setSelId(null);} }
  function undo(){ if(!delB)return; addBelief(delB); setDelB(null); setToast(null); clearInterval(cdRef.current); }
  function update(id,fn){ updateBelief(id,fn); }
  function resetAll(){ replaceBeliefs([],{theme:"d1",lang:settings.lang}); setView("list"); setSelId(null); }

  function handleImport(newBeliefs, newSettings, count) {
    replaceBeliefs(newBeliefs, newSettings || settings);
    const msg = settings.lang==="ja" ? t.importedToast_ja.replace("{n}",count) : t.importedToast_zh.replace("{n}",count);
    setImportToast(msg);
    setTimeout(()=>setImportToast(null),3000);
  }

  const sel=beliefs.find(b=>b.id===selId)||null;
  const ff = settings.lang === "ja"
    ? "'Noto Sans JP','Noto Sans TC',system-ui,sans-serif"
    : "'Noto Sans TC','Noto Sans JP',system-ui,sans-serif";

  return (
    <div style={{fontFamily:ff,background:th.bg,minHeight:"100vh"}}>
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .hide-scrollbar::-webkit-scrollbar{display:none}
        .themed-scroll::-webkit-scrollbar{width:6px}
        .themed-scroll::-webkit-scrollbar-track{background:transparent}
        .themed-scroll::-webkit-scrollbar-thumb{background:${th.border};border-radius:3px}
        .themed-scroll::-webkit-scrollbar-thumb:hover{background:${th.borderHover}}
      `}</style>
      {view==="list"&&<ListView th={th} t={t} settings={settings} onSettings={updateSettings} beliefs={beliefs}
        onSelect={id=>{setSelId(id);setView("detail");}} onDelete={delBelief} onAdd={()=>setView("add")}
        toast={toast} onUndo={undo}
        onExport={()=>exportJSON(beliefs,settings)}
        onExportMD={()=>exportAllMD(beliefs,settings.lang)}
        onImport={()=>setImportModal(true)}
        onResetAll={resetAll}
        user={user} onLogout={onLogout} syncStatus={syncStatus}/>}
      {view==="add"&&<AddView th={th} t={t} settings={settings} onSettings={updateSettings} beliefs={beliefs} onCreate={addBelief} onBack={()=>setView("list")} onResetAll={resetAll} user={user} onLogout={onLogout} syncStatus={syncStatus}/>}
      {view==="detail"&&sel&&<DetailView th={th} t={t} settings={settings} onSettings={updateSettings} belief={sel} onUpdate={fn=>update(selId,fn)} onBack={()=>{setView("list");setSelId(null);}} toast={toast} onUndo={undo} onResetAll={resetAll} user={user} onLogout={onLogout} syncStatus={syncStatus}/>}

      <ImportModal open={importModal} onClose={()=>setImportModal(false)} th={th} t={t} lang={settings.lang} beliefs={beliefs} onImport={handleImport} settings={settings}/>
      {importToast&&<ImportToast msg={importToast} th={th}/>}
    </div>
  );
}

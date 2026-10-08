/* Kiểm tra hiểu thật (chống học vẹt).
   Làm đúng bài vừa học chưa chắc là hiểu. Mỗi bài có 4 DẠNG câu hỏi mà người học CHƯA từng thấy:
   same = cùng ý, số khác | flip = đi ngược chiều | new = bối cảnh khác | verdict = tự phán đúng/sai và nói vì sao.
   Qua 4/4 (hoặc 3/4 rồi đúng câu thêm) mới được đánh dấu xong. Trượt: rút dấu xong, học lại từ bước đầu.
   Thêm bài mới: PRB.<idBai> = {same, flip, new, verdict}, mỗi hàm trả {q, a, w} hoặc {q, o:[...], a:chỉ số đúng, w, why?:{q,o,a}}. */
P.pr = P.pr || {}; P.weak = P.weak || {}; P.shaky = P.shaky || {};
const pShuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a };
const pDistinct = (n, m) => pShuf(Array.from({ length: m }, (_, i) => i + 1)).slice(0, n);
const pYN = ["Đúng", "Sai"];
const pSHAPE = { same: "áp dụng với số khác", flip: "đi ngược chiều (từ kết quả suy ra vị trí)", new: "đem ý tưởng sang bối cảnh khác", verdict: "tự phán đúng/sai và nói được vì sao", read: "đọc kỹ đề trước khi tính" };
const pJ = JSON.stringify;
const PRB = {
  l1: {
    same: () => { const a = pDistinct(5, 9), k = R(5) - 1; return { q: `Mảng ${pJ(a)}. Hộp có chỉ số ${k} chứa số mấy?`, a: a[k], w: `Chỉ số ${k} là hộp thứ ${k + 1} tính từ trái, chứa ${a[k]}.` } },
    flip: () => { const a = pDistinct(5, 9), k = R(5) - 1; return { q: `Mảng ${pJ(a)}. Số ${a[k]} nằm ở hộp có chỉ số mấy?`, a: k, w: `Đếm từ 0: ${a[k]} đứng sau ${k} hộp nên chỉ số là ${k}.` } },
    new: () => { const n = R(6) + 3, m = R(n - 1); return { q: `${n} bạn xếp hàng, đánh số bắt đầu từ 0. Có đúng ${m} bạn đứng trước Lan. Chỉ số của Lan là mấy?`, a: m, w: `Chỉ số = số người đứng trước = ${m}.` } },
    read: () => { const n = R(6) + 3; return { q: `Mảng có ${n} hộp. Hộp có chỉ số ${n} chứa số mấy?`, o: [`Số nằm ở hộp thứ ${n}`, `Không có hộp nào như vậy: chỉ số lớn nhất chỉ là ${n - 1}`, "0"], a: 1, w: `Đề hỏi chỉ số ${n}, nhưng ${n} hộp thì chỉ số lớn nhất là ${n - 1}. Phải đọc kỹ con số trong đề trước khi tính.` } },
    verdict: () => { const n = R(6) + 3; return { q: `An nói: "Mảng có ${n} hộp thì các chỉ số là 1, 2, ..., ${n}". An nói đúng hay sai?`, o: pYN, a: 1, w: `Sai: máy đếm từ 0, nên chỉ số là 0 đến ${n - 1}.`, why: { q: "Vì sao?", o: [`Máy đếm từ 0 nên chỉ số là 0 đến ${n - 1}`, "Chỉ số phải bằng số hộp", "Mảng không có chỉ số"], a: 0 } } }
  },
  l2: {
    same: () => { const n = R(90) + 10; return { q: `Mảng ${n} hộp, số cần tìm nằm ở hộp cuối. Mở từ trái sang phải, phải mở bao nhiêu hộp?`, a: n, w: `Phải mở cả ${n} hộp.` } },
    flip: () => { const k = R(40) + 2; return { q: `Số cần tìm nằm ở hộp có chỉ số ${k}. Mở từ trái sang phải, phải mở bao nhiêu hộp mới thấy nó?`, a: k + 1, w: `Chỉ số ${k} là hộp thứ ${k + 1} (vì chỉ số bắt đầu từ 0).` } },
    new: () => { const n = R(900) + 100; return { q: `Danh bạ có ${n} người, chưa sắp xếp. Tên "Minh" không có trong đó. Phải xem bao nhiêu người mới CHẮC CHẮN là không có?`, a: n, w: `Chỉ khi xem hết ${n} người mới dám kết luận không có.` } },
    read: () => { const n = R(90) + 10; return { q: `Mảng ${n} hộp. Số cần tìm nằm ở hộp ĐẦU TIÊN. Tìm từ trái sang phải, phải mở bao nhiêu hộp?`, o: ["1", `${n}`, `${Math.floor(n / 2)}`], a: 0, w: `Đề nói số đó nằm ở hộp đầu, không phải trường hợp xấu nhất. Đọc đúng điều kiện trước khi dùng công thức quen.` } },
    verdict: () => ({ q: `Nam nói: "Mảng 1000 hộp chưa sắp xếp. Mở 10 hộp đầu không thấy số 9 thì chắc chắn mảng không có số 9". Nam nói đúng hay sai?`, o: pYN, a: 1, w: "Sai: còn 990 hộp chưa mở.", why: { q: "Vì sao?", o: ["Còn 990 hộp chưa mở, số 9 có thể nằm ở đó", "Mảng 1000 hộp luôn có số 9", "Mở 10 hộp là quá nhiều"], a: 0 } })
  },
  l3: {
    same: () => { const a = Array.from({ length: 5 }, () => R(9)), k = R(4), m = Math.max(...a.slice(0, k + 1)); return { q: `Mảng ${pJ(a)}. Sau khi xét xong hộp chỉ số ${k}, tờ giấy "lớn nhất đã thấy" ghi số mấy?`, a: m, w: `Lớn nhất của ${pJ(a.slice(0, k + 1))} là ${m}.` } },
    flip: () => { const a = Array.from({ length: 5 }, () => R(9)), k = R(4), m = Math.min(...a.slice(0, k + 1)); return { q: `Lần này giấy ghi "số NHỎ nhất đã thấy". Mảng ${pJ(a)}. Sau khi xét xong hộp chỉ số ${k}, giấy ghi số mấy?`, a: m, w: `Nhỏ nhất của ${pJ(a.slice(0, k + 1))} là ${m}. Cùng cách nghĩ, chỉ đổi chiều so sánh.` } },
    new: () => { const a = pDistinct(3, 9).map(x => -x); return { q: `Mảng ${pJ(a)}. Bạn ghi số 0 lên giấy từ đầu, rồi so từng hộp theo luật "lớn hơn thì ghi đè". Cuối cùng giấy ghi số mấy?`, a: 0, w: "Không hộp nào lớn hơn 0 nên giấy giữ 0, dù 0 không có trong mảng. Vì vậy phải lấy hộp đầu làm mốc." } },
    read: () => { const a = pDistinct(3, 9).map(x => -x), mx = Math.max(...a), mn = Math.min(...a), md = a.find(x => x != mx && x != mn); return { q: `Mảng ${pJ(a)}. Số LỚN nhất trong mảng là số nào?`, o: [`${mx}`, `${mn}`, `${md}`], a: 0, w: `Với số âm, ${mx} lớn hơn ${md} và ${mn}: lớn nhất là số gần 0 nhất, không phải số trông "to" nhất.` } },
    verdict: () => ({ q: `Hoa nói: "Tìm số lớn nhất của 1000 hộp thì chỉ cần so hộp đầu với hộp cuối". Hoa nói đúng hay sai?`, o: pYN, a: 1, w: "Sai: số lớn nhất có thể nằm ở bất kỳ hộp nào.", why: { q: "Vì sao?", o: ["Số lớn nhất có thể nằm ở hộp giữa, phải xem hết", "Hộp đầu luôn lớn nhất", "Hộp cuối luôn lớn nhất"], a: 0 } })
  }
};

/* Đồ thị tiền đề: bài nào dựa trên bài nào. Sai ở bài lớn thì lần ngược về gốc (như lớp 9 sai phép cộng thì phải học lại phép cộng). */
const PREQ = { l2: ["l1"], l3: ["l1", "l2"], w1: ["l3"], w2: ["l2"], w3: ["l3"] };
const anc = id => { const o = []; const v = x => (PREQ[x] || []).forEach(y => { v(y); if (!o.includes(y)) o.push(y) }); v(id); return o };
const tmr = () => { const d = new Date(Date.now() + 864e5); return d.toISOString().slice(0, 10) };
/* bài Python cơ bản gần nhất trong chuỗi tiền đề: dùng khi người học "hiểu ý nhưng không biết viết Python" */
const pyRef = id => { const py = ["b1", "b2", "b3", "b4"]; const a = anc(id).filter(x => py.includes(x) && LES[x]); return a.length ? a[a.length - 1] : id };
const deps = id => Object.keys(LES).filter(x => anc(x).includes(id));
const testable = id => anc(id).filter(y => PRB[y] && P.done[y]);
function rootcheck(id) {
  const L = testable(id), p = $("#panel"); let k = 0; p.className = "panel";
  const nxt = () => {
    if (k >= L.length) { p.innerHTML = `<h2>Kiểm tra nền</h2><div class="fb ok">Các bài nền đều vững. Vậy chỗ chưa chắc nằm ngay ở bài «${LES[id].t}».</div><p><button class="go" id="rl">Học lại bài này từ đầu</button></p>`; $("#rl").onclick = () => start(id); return }
    const y = L[k++];
    probe(y, 0, { shapes: ["flip", "verdict"], title: "Kiểm tra nền", onEnd: ok => {
      if (ok) return nxt();
      delete P.done[y]; P.weak[y] = (P.weak[y] || 0) + 1; delete P.done[id];
      const dd = deps(y).filter(z => P.done[z]); dd.forEach(z => P.shaky[z] = 1); save(); road();
      p.innerHTML = `<h2>Kiểm tra nền</h2><div class="fb"><b>Tìm ra gốc rồi: «${LES[y].t}».</b> Việc sai ở bài «${LES[id].t}» có thể không phải vì bài đó khó, mà vì nền chưa chắc. Giống học hàm số ở lớp 9 mà phép cộng còn sai: phải quay lại phép cộng, không thể xây tiếp trên chỗ nứt.</div><p class="sub">Mình rút dấu "xong" của «${LES[y].t}» và mở lại từ bước đầu.${dd.length ? " Các bài dựa trên nó (" + dd.map(z => LES[z].t).join("; ") + ") được đánh dấu cần kiểm tra lại, bạn không mất tiến độ nhưng sẽ phải chứng minh lại." : ""}</p><p><button class="go" id="rl">Học lại «${LES[y].t}»</button></p>`;
      $("#rl").onclick = () => start(y) } })
  };
  p.innerHTML = `<h2>Kiểm tra nền</h2><p class="sub">Mình nghi ngờ lỗ hổng nằm ở kiến thức nền. Mình kiểm tra nhanh từng bài nền, từ gốc lên: ${L.map(y => "«" + LES[y].t + "»").join(" → ")}.</p><p><button class="go" id="gs">Bắt đầu</button></p>`; $("#gs").onclick = nxt
}

function probe(id, fromHub, opt) {
  const L = LES[id], G = PRB[id], p = $("#panel"), shapes = (opt && opt.shapes) || ["same", "flip", "new", "verdict", "read"];
  let i = 0, res = {}, flags = {}, conf = 0, extra = false, solo = false, viaAssist = false, assisted = {}, list = shapes.slice();
  p.className = "panel";
  const opts = (arr, cb) => { const o = pShuf(arr.map((t, j) => ({ t, c: j }))); $("#in").innerHTML = `<div class="opts">${o.map((x, j) => `<button data-o="${j}">${x.t}</button>`).join("")}</div>`; $("#in").querySelectorAll("button").forEach(b => b.onclick = () => cb(o[+b.dataset.o].c)) };
  const rec = (ok, weakEv) => { const r = P.pr[id] || (P.pr[id] = { p: 0, f: 0, miss: {} }); ok ? r.p++ : r.f++; if (!ok) shapes.filter(s => !res[s]).forEach(s => r.miss[s] = (r.miss[s] || 0) + 1); r.last = today(); r.days = r.days || []; if (ok && !weakEv && !r.days.includes(r.last)) r.days.push(r.last); save() };
  const ask = re => {
    if (i >= list.length) return end();
    const s = list[i], q = re || G[s](); let t0 = Date.now(); conf = 0;
    const canBook = !opt && !solo; // vòng solo retest / chế độ ôn: không giở sổ tay giữa câu hỏi
    p.innerHTML = `<h2>${opt ? opt.title : "Kiểm tra hiểu thật"}: ${L.t}</h2><p class="sub">${extra ? "Câu thêm để chắc chắn" : (opt && opt.tag) || `Câu ${i + 1}/${list.length}`}. Làm đúng bài vừa học chưa chắc là hiểu, nên mình đổi số, đổi chiều, đổi bối cảnh. Không có gợi ý từng bước, nhưng bạn luôn được giở sổ tay khi chưa hiểu.</p><div class="q">${q.q}</div><div id="in"></div><div id="fb"></div>`;
    const nxt = (ok0, msg) => { let ok = ok0, tag = "";
      if (ok0 && conf == 1) { ok = false; flags[s] = "lucky"; const rl = P.pr[id] || (P.pr[id] = { p: 0, f: 0, miss: {} }); rl.lucky = (rl.lucky || 0) + 1; save(); tag = " Đúng, nhưng bạn chọn «Đoán» nên câu này không được tính: đúng nhờ may mắn thì chưa phải hiểu." }
      else if (ok0 && assisted[s]) { ok = true; flags[s] = "assisted"; tag = " Bạn đã giở sổ tay: đó là cách học đúng. Câu này sẽ được hỏi lại bằng đề MỚI, không có sổ tay, để chắc là bạn tự làm được." }
      else if (!ok0) { flags[s] = s == "read" ? "misread" : assisted[s] ? "" : conf == 3 ? "overconfident" : (Date.now() - t0 < 4000 ? "careless" : ""); tag = { misread: " Đây là lỗi ĐỌC SAI ĐỀ: thói quen này phải sửa từ gốc.", overconfident: " Bạn chọn «Chắc chắn» mà vẫn sai: đây là hiểu lầm sâu, đáng chú ý nhất.", careless: " Bạn trả lời trong chưa đầy 4 giây và sai: dấu hiệu CẨU THẢ hoặc đoán." }[flags[s]] || "" }
      res[s] = ok; msg += tag; $("#in").innerHTML = ""; fb((ok0 ? "Đúng. " : "Chưa đúng. ") + msg, ok); $("#fb").insertAdjacentHTML("beforeend", `<p><button class="go" id="nx2">Tiếp</button></p>`); $("#nx2").onclick = () => { i++; ask() } };
    const show = () => { t0 = Date.now();
    if (q.o) opts(q.o, c => { if (q.o[c] === q.o[q.a]) c = q.a; if (c != q.a) return nxt(false, q.w); if (!q.why) return nxt(true, q.w); $("#fb").innerHTML = ""; $(".q").insertAdjacentHTML("afterend", `<div class="q" id="wq">${q.why.q}</div>`); opts(q.why.o, c2 => { $("#wq").remove(); nxt(c2 == q.why.a, q.w + " " + q.why.o[q.why.a] + ".") }) });
    else { $("#in").innerHTML = `<input id="v" type="number" aria-label="Câu trả lời"> <button class="go" id="ok">Kiểm tra</button>`; const go = () => { const v = $("#v").value; if (v === "") return; nxt(+v === q.a, q.w) }; $("#ok").onclick = go; $("#v").onkeydown = e => { if (e.key == "Enter") go() }; $("#v").focus() }
    };
    $("#in").innerHTML = `<p class="sub">Trước khi trả lời: bạn chắc đến mức nào?</p><div class="opts"><button data-c="3">Chắc chắn</button><button data-c="2">Hơi chắc</button><button data-c="1">Đoán</button><button data-c="0" class="ghost">Chưa hiểu / chưa nhớ</button></div><p class="sub">Không hiểu thì đừng điền bừa. Bấm «Chưa hiểu / chưa nhớ»: nói thật không bị tính là sai.</p>${canBook ? `<p><button class="ghost" id="nbk">📖 Giở sổ tay xem lại lý thuyết</button></p>` : ""}`;
    const lookupRef = (refId, fk) => { assisted[s] = true; const r = P.pr[id] || (P.pr[id] = { p: 0, f: 0, miss: {} }); r.unk = (r.unk || 0) + 1; if (fk) { r.fk = r.fk || {}; r.fk[fk] = (r.fk[fk] || 0) + 1 } save(); notebook(refId, () => tinyCheck(tinyFor(id, fk), id, () => ask(q)), "Đã đọc, kiểm tra nhanh") };
    const lookup = () => lookupRef(id, null);
    const failKind = () => { // "Chưa hiểu" là learning signal: hỏi rõ vướng ở đâu rồi mở đúng reference
      const kinds = [["de", "Tôi không hiểu đề đang hỏi gì", "rd1"], ["concept", "Tôi không hiểu từ / khái niệm trong đề", id], ["start", "Tôi hiểu đề nhưng không biết bắt đầu từ đâu", id], ["python", "Tôi hiểu ý nhưng không biết viết Python", pyRef(id)], ["theory", "Tôi không hiểu lý thuyết phía sau", id], ["unsure", "Tôi chỉ không chắc đáp án", null]];
      p.innerHTML = `<h2>${L.t}</h2><p class="sub">Bạn đang vướng ở đâu? Nói đúng chỗ thì mình mở đúng trang sách — không cần đoán mò.</p><div class="opts">${kinds.map((k, j) => `<button data-fk="${j}">${k[1]}</button>`).join("")}</div><p><button class="ghost" id="fkb">Quay lại</button></p>`;
      p.querySelectorAll("[data-fk]").forEach(b => b.onclick = () => { const k = kinds[+b.dataset.fk]; if (!k[2]) return ask(); lookupRef(k[2], k[0]) });
      $("#fkb").onclick = () => ask();
    };
    $("#in").querySelectorAll("[data-c]").forEach(b => b.onclick = () => {
      if (+b.dataset.c == 0) { if (!canBook) { flags[s] = "unknown"; res[s] = false; const r = P.pr[id] || (P.pr[id] = { p: 0, f: 0, miss: {} }); r.unk = (r.unk || 0) + 1; save(); i++; return ask() } return failKind() }
      conf = +b.dataset.c; show() });
    if ($("#nbk")) $("#nbk").onclick = lookup
  };
  const end = () => {
    const bad = shapes.filter(s => !res[s]), hab = bad.map(s => flags[s]).filter(h => h && h != "lucky" && h != "unknown");
    if (opt) { if (!bad.length || bad.some(s => flags[s] != "unknown")) { if (!opt.noRec) rec(!bad.length) } return opt.onEnd(!bad.length, { flags, bad, shapes: shapes.slice() }) }
    if (!extra && bad.length == 1 && !hab.length && !bad.some(s => flags[s] == "unknown")) { extra = true; list = [bad[0]]; i = 0; return ask() }
    const asst = shapes.filter(s => res[s] && flags[s] == "assisted");
    if (!bad.length && asst.length && !solo) { solo = true; viaAssist = true; list = asst.slice(); i = 0; assisted = {}; asst.forEach(s => { delete res[s]; delete flags[s] });
      p.innerHTML = `<h2>${L.t}</h2><div class="fb ok"><b>Gần xong rồi.</b> Bạn trả lời đúng ${asst.length} câu nhờ giở sổ tay, và đó là cách học đúng. Giờ làm lại đúng những câu đó bằng đề MỚI, lần này tự nghĩ, để chắc là bạn nắm được.</div><p class="sub">Chỗ đã dùng sổ tay: ${asst.map(s => pSHAPE[s]).join("; ")}.</p><p><button class="go" id="so">Làm lại</button></p>`;
      $("#so").onclick = () => ask(); return }
    if (!bad.length) { const weakEv = asst.length > 0 || viaAssist; rec(true, weakEv); if (weakEv) { P.pr[id].asst = (P.pr[id].asst || 0) + 1; const lt = P.lt || (P.lt = {}); const it = lt[id] || (lt[id] = { box: 1, due: "", n: 0, lapse: 0, cl: 0, ls: "", seen: "" }); it.box = 1; it.due = tmr() } L.pd = 1; delete P.shaky[id]; P.done[id] = 1; save(); road(); p.innerHTML = `<h2>${L.t}</h2><div class="fb ok"><b>Qua kiểm tra hiểu thật.</b> Bạn làm đúng cả khi đổi số, đổi chiều, đổi bối cảnh và tự phán đúng/sai. Đó là hiểu, không phải nhớ máy móc.</div><p><button class="go" id="gn">Tiếp tục</button></p>`; $("#gn").onclick = () => fromHub ? hub(id) : draw(); return }
    hab.forEach(h => { P.hab = P.hab || {}; P.hab[h] = (P.hab[h] || 0) + 1 }); rec(false); delete P.done[id]; P.weak[id] = (P.weak[id] || 0) + 1; save(); road();
    if (testable(id).length) return rootcheck(id);
    p.innerHTML = `<h2>${L.t}</h2><div class="fb">${hab.length ? `<b>Không qua, và lần này không có câu cứu.</b> ${hab.includes("misread") ? "Bạn đọc sai đề: nếu đọc đề chưa chắc thì bài khó nào cũng sai ngay từ đầu. " : ""}${hab.includes("careless") ? "Bạn trả lời quá nhanh và sai: làm ẩu ở đây thì ở công việc thật sẽ thành lỗi gửi đi. " : ""}${hab.includes("overconfident") ? "Bạn rất chắc chắn mà vẫn sai: hiểu lầm nằm sâu hơn lỗi bất cẩn. " : ""}Cẩu thả và đọc ẩu không được bỏ qua.` : `<b>Chưa chắc là hiểu.</b> Có thể bạn đã nhớ các câu trong bài nhưng chưa nắm được ý bên dưới.`} Chỗ chưa vững: ${bad.map(s => pSHAPE[s]).join("; ")}.</div><p class="sub">Mình rút dấu "xong" của bài này và cho học lại từ bước đầu. Lần này, trước mỗi câu hãy tự gạch chân điều đề hỏi và các con số trong đề, rồi mới trả lời. Không hết ý thì chưa sang bài sau.</p><p><button class="go" id="rl">Học lại từ đầu</button></p>`;
    $("#rl").onclick = () => start(id)
  };
  ask()
}
const pD0 = draw; draw = function () { const L = cur && LES[cur]; if (L && PRB[cur] && si >= L.steps.length && !(L.dr && !L.dd) && !L.pd) return probe(cur); return pD0() };
const pS0 = start; start = function (id) { if (LES[id]) LES[id].pd = 0; return pS0(id) };
const pH0 = hub; hub = function (id) { pH0(id); if (!PRB[id]) return; const r = P.pr[id] || { p: 0, f: 0 }; $("#panel").insertAdjacentHTML("beforeend", `<p><button class="go" id="hpb">Kiểm tra hiểu thật (đề mới)</button></p><p class="sub">Đã qua ${r.p} lần, trượt ${r.f} lần. ${(r.days || []).length >= 2 ? "Vững: đã qua đề ở hai ngày khác nhau." : "Chưa vững: cần qua thêm một đề vào một ngày khác."} Trượt thì bài phải học lại từ đầu: nhớ chưa phải là hiểu.</p>`); $("#hpb").onclick = () => probe(id, 1); $("#panel").insertAdjacentHTML("beforeend", `<p><button class="ghost" id="hnb">📖 Sổ tay: xem lại lý thuyết bài này</button></p>`); $("#hnb").onclick = () => notebook(id, () => hub(id), "Quay lại") };

const c0 = check; check = function (v) { c0(v); if (cur && tries >= 3 && testable(cur).length && !$("#rcb")) { $("#fb").insertAdjacentHTML("beforeend", `<p><button class="ghost" id="rcb">Sai nhiều lần: kiểm tra xem kiến thức nền có bị hổng không</button></p>`); $("#rcb").onclick = () => rootcheck(cur) } };
const r1 = road; road = function () { r1(); document.querySelectorAll("#road [data-id]").forEach(b => { if (P.shaky[b.dataset.id]) b.insertAdjacentText("beforeend", " ⚠ kiểm tra lại") }) };
const h1 = hub; hub = function (id) { h1(id); if (P.shaky[id]) $("#panel").insertAdjacentHTML("afterbegin", `<div class="fb"><b>Cần kiểm tra lại.</b> Một bài nền của bài này vừa bị phát hiện còn hổng. Hãy bấm "Kiểm tra hiểu thật" để chứng minh bài này vẫn vững.</div>`) };

function okPre(id) { return anc(id).every(y => !PRB[y] || P.done[y]) }
/* Ngân hàng mẫu: mỗi dạng có nhiều mẫu, không lặp lại mẫu vừa dùng. Thêm mẫu bằng bank(id, dạng, [hàm...]). */
const pLast = {};
let pBankN = 0;
const bank = (id, shape, extra) => { const fns = [PRB[id][shape], ...extra], key = id + shape + (++pBankN); PRB[id][shape] = () => { let k; do { k = Math.floor(Math.random() * fns.length) } while (fns.length > 1 && pLast[key] === k); pLast[key] = k; return fns[k]() } };
const why = (a, b, c) => ({ q: "Vì sao?", o: [a, b, c], a: 0 });
bank("l1", "new", [() => { const n = R(5) + 4, k = R(n - 1); return { q: `Một dãy ${n} ghế đánh số từ 0. Nam ngồi ghế số ${k}. Có bao nhiêu ghế ở TRƯỚC Nam?`, a: k, w: `Ghế số ${k} đứng sau ${k} ghế (số 0 đến ${k - 1}).` } }]);
bank("l1", "verdict", [() => { const n = R(6) + 3; return { q: `Mai nói: "Mảng có ${n} hộp thì hộp cuối có chỉ số ${n}". Mai nói đúng hay sai?`, o: pYN, a: 1, w: `Sai: hộp cuối có chỉ số ${n - 1}.`, why: why(`Chỉ số bắt đầu từ 0 nên hộp cuối là ${n - 1}`, "Hộp cuối không có chỉ số", "Chỉ số cuối luôn là 1") } }]);
bank("l1", "read", [() => { const a = pDistinct(4, 9); return { q: `Mảng ${pJ(a)}. Phần tử ở chỉ số 1 là số nào?`, o: [`${a[1]}`, `${a[0]}`, `${a[2]}`], a: 0, w: `Chỉ số 1 là hộp thứ hai: ${a[1]}, không phải ${a[0]}.` } }]);
bank("l2", "new", [() => { const n = R(40) + 10; return { q: `${n} chiếc chìa khóa, chỉ một chiếc mở được cửa, bạn thử lần lượt. Tệ nhất phải thử bao nhiêu chiếc?`, a: n, w: `Tệ nhất chiếc đúng nằm cuối: thử ${n} chiếc.` } }]);
bank("l2", "verdict", [() => ({ q: `Linh nói: "Mảng 50 hộp, tôi mở hộp đầu đã thấy số cần tìm, vậy tìm tuyến tính luôn nhanh". Linh nói đúng hay sai?`, o: pYN, a: 1, w: "Sai: may mắn một lần không đại diện cho trường hợp xấu nhất.", why: why("Số có thể nằm ở hộp cuối hoặc không có, khi đó phải mở cả 50 hộp", "Mở hộp đầu luôn thấy", "Tìm tuyến tính luôn mất đúng 1 bước") })]);
bank("l2", "read", [() => { const n = R(90) + 10; return { q: `Mảng ${n} hộp. Số cần tìm KHÔNG có trong mảng. Phải mở bao nhiêu hộp để chắc chắn?`, o: [`${n}`, "1", `${n - 1}`], a: 0, w: `Muốn chắc là không có thì phải mở hết ${n} hộp.` } }]);
bank("l3", "new", [() => { const a = pDistinct(4, 9), t = a.reduce((x, y) => x + y, 0); return { q: `Giấy ghi tổng đang có. Bắt đầu từ 0, cộng lần lượt các số của ${pJ(a)}. Cuối cùng giấy ghi số mấy?`, a: t, w: `Cùng cách nghĩ "giữ một giá trị đang có rồi cập nhật": tổng là ${t}.` } }]);
bank("l3", "verdict", [() => ({ q: `Bình nói: "Tôi đặt giấy bằng 0 rồi tìm số lớn nhất, vậy là luôn đúng". Bình nói đúng hay sai?`, o: pYN, a: 1, w: "Sai: nếu mọi số đều âm thì 0 thắng sai.", why: why("Với mảng toàn số âm thì 0 lớn hơn mọi số trong mảng", "0 luôn là số lớn nhất", "Giấy không thể bằng 0") })]);
bank("l3", "read", [() => { let a, m, k; do { a = pDistinct(4, 9); m = Math.max(...a); k = a.indexOf(m) } while (m == k || m == k + 1); return { q: `Mảng ${pJ(a)}. VỊ TRÍ (chỉ số) của số lớn nhất là mấy?`, o: [`${k}`, `${m}`, `${k + 1}`], a: 0, w: `Đề hỏi chỉ số, không phải giá trị: số lớn nhất là ${m}, nằm ở chỉ số ${k}.` } }]);
/* Sao lưu tiến độ + khả năng tiếp cận */
(() => { const bar = document.createElement("div"); bar.style.cssText = "position:fixed;right:8px;bottom:8px;font-size:12px;z-index:9";
  bar.innerHTML = `<button id="bx" class="ghost">Xuất tiến độ</button> <label class="ghost" style="cursor:pointer">Nhập <input id="bi" type="file" accept=".json" hidden></label>`; document.body.appendChild(bar);
  $("#panel").setAttribute("aria-live", "polite");
  $("#bx").onclick = () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(P)], { type: "application/json" })); a.download = "dsa-tien-do-" + today() + ".json"; a.click() };
  $("#bi").onchange = e => { const f = e.target.files[0]; if (!f) return; f.text().then(t => { const d = JSON.parse(t); if (!d || typeof d != "object" || !d.done) throw 0; Object.keys(P).forEach(k => delete P[k]); Object.assign(P, d); P.g = P.g || {}; P.u = P.u || {}; P.pr = P.pr || {}; P.weak = P.weak || {}; P.shaky = P.shaky || {}; save(); road(); draw() }).catch(() => alert("File tiến độ không hợp lệ.")) } })();

const $=s=>document.querySelector(s);
const STAGES=[
{n:"Giai đoạn 1: Mảng",d:"Hiểu bằng tay trước, rồi viết Python theo quy trình thực tế",L:["l1","l2","l3","w1","w2","w3"]},
{n:"Giai đoạn 2: Đếm và bảng tra",d:"Hash map: đổi thời gian lấy bộ nhớ"},
{n:"Giai đoạn 3: Hai con trỏ, cửa sổ trượt",d:"Một vòng lặp thay cho hai"},
{n:"Giai đoạn 4: Stack, Queue",d:"Vào sau ra trước, vào trước ra trước"},
{n:"Giai đoạn 5: Đệ quy",d:"Bài toán nhỏ hơn giống hệt bài toán lớn"},
{n:"Giai đoạn 6: Sắp xếp, tìm kiếm nhị phân",d:"Chia đôi mỗi lần"},
{n:"Giai đoạn 7: Linked list, cây",d:"Dữ liệu nối bằng con trỏ"},
{n:"Giai đoạn 8: Đồ thị, quy hoạch động",d:"Ghép tất cả lại"}];
const LES={
l1:{t:"Mảng là dãy hộp có số thứ tự",arr:[7,3,9,4],steps:[
{k:"click",q:"Đây là 4 hộp xếp hàng. Mỗi hộp có một số thứ tự gọi là chỉ số, và máy tính đếm từ 0. Bấm vào hộp đầu tiên.",a:0,h:"Hộp đầu tiên mang số thứ tự nào, nếu đếm từ 0?",s:"Hộp đầu có chỉ số 0."},
{k:"click",q:"Bấm vào hộp đang chứa số 9.",a:2,h:"Nhìn dòng chữ nhỏ bên dưới mỗi hộp, đó là chỉ số.",s:"Số 9 nằm ở chỉ số 2."},
{k:"input",q:"Hộp có chỉ số 3 chứa số mấy?",a:4,h:"Tìm hộp có chữ 3 bên dưới.",s:"Chỉ số 3 chứa số 4."},
{k:"input",q:"Mảng này có 4 hộp. Chỉ số của hộp cuối cùng là mấy?",a:3,h:"Hộp đầu là 0. Đếm tiếp: 0, 1, ... đến hộp thứ tư.",s:"4 hộp thì chỉ số cuối là 3."},
{k:"input",q:"Tự khái quát: mảng có 100 hộp thì chỉ số cuối là bao nhiêu?",a:99,h:"Quy luật ở câu trước: chỉ số cuối = số hộp trừ đi mấy?",s:"Chỉ số cuối = số hộp - 1."}]},
l2:{t:"Tìm một số: mở từng hộp",arr:[5,8,2,9,1],hide:1,steps:[
{k:"open",q:"Các hộp đang đóng kín, mỗi lần chỉ mở được một hộp. Hãy tìm số 9 bằng cách mở hộp (bấm vào hộp). Bạn tự chọn thứ tự.",a:3,h:"Nếu mở lung tung, bạn có thể bỏ sót hoặc mở trùng. Có cách mở nào có trật tự không?",s:"Đã tìm thấy 9."},
{k:"choice",q:"Cách mở nào đảm bảo không bỏ sót và không mở trùng?",o:["Từ trái sang phải, từng hộp","Nhảy cóc ngẫu nhiên","Chỉ mở hộp giữa"],a:0,h:"Muốn chắc chắn mình đã xét hết thì phải đi có thứ tự.",s:"Đi tuần tự, mỗi hộp đúng một lần."},
{k:"input",q:"Nếu số 9 nằm ở hộp cuối của mảng 5 hộp, bạn phải mở tối đa bao nhiêu hộp?",a:5,h:"Mở từ đầu, hộp cuối là hộp thứ mấy?",s:"Phải mở cả 5 hộp."},
{k:"input",q:"Mảng có 1000 hộp, trường hợp xấu nhất phải mở bao nhiêu hộp?",a:1000,h:"Cùng quy luật câu trước.",s:"Tối đa n hộp. Gọi là tìm tuyến tính, độ phức tạp O(n)."}]},
l3:{t:"Tìm số lớn nhất: tờ giấy nhớ",arr:[4,9,2,7],steps:[
{k:"choice",q:"Bạn có một tờ giấy ghi 'số lớn nhất đã thấy'. Trước khi mở hộp nào, nên ghi gì lên giấy?",o:["Số 0","Số trong hộp đầu tiên","Để trống mãi"],a:1,h:"Nếu mảng toàn số âm thì số 0 có đúng không?",s:"Lấy hộp đầu làm mốc ban đầu, luôn đúng."},
{k:"input",q:"Giấy đang ghi 4. Hộp chỉ số 1 chứa 9. Sau khi so sánh, giấy ghi số mấy?",a:9,h:"9 có lớn hơn 4 không? Nếu có thì giấy thay đổi.",s:"9 lớn hơn nên ghi đè thành 9.",hi:1},
{k:"input",q:"Giấy ghi 9. Hộp chỉ số 2 chứa 2. Giấy ghi số mấy?",a:9,h:"2 có lớn hơn 9 không?",s:"2 nhỏ hơn nên giấy giữ nguyên 9.",hi:2},
{k:"input",q:"Giấy ghi 9. Hộp chỉ số 3 chứa 7. Giấy ghi số mấy?",a:9,h:"So sánh 7 với 9.",s:"Vẫn là 9.",hi:3},
{k:"choice",q:"Khi đi tới hộp mới, có cần quay lại nhìn các hộp trước không?",o:["Có, để chắc chắn","Không, tờ giấy đã nhớ giúp"],a:1,h:"Tờ giấy lưu thông tin gì về các hộp đã qua?",s:"Một lần duyệt là đủ: O(n)."},
{k:"reflect",q:"Hãy tự viết bằng lời của bạn: thuật toán tìm số lớn nhất gồm những bước nào? (Viết thô cũng được, đây là bước quan trọng nhất.)"}]}};

let WS={};
const BIZ=[{k:"choice",ph:"Bước 1: Hợp đồng của hàm (cách nghĩ ở doanh nghiệp)",q:"Ở công ty, trước khi viết hàm, đồng nghiệp cần biết gì để dùng hàm của bạn mà không phải đọc code?",o:["Đầu vào hợp lệ là gì, đầu ra là gì, và đầu vào xấu thì hàm báo lỗi gì","Chỉ cần tên hàm","Chỉ cần chạy được trên máy của bạn"],a:0,h:"Người khác chỉ thấy 'hợp đồng' bên ngoài, không thấy bên trong.",s:"Chốt: hợp đồng gồm đầu vào, đầu ra, và hành vi khi đầu vào xấu."},{k:"choice",ph:"Bước 1: Hợp đồng của hàm (cách nghĩ ở doanh nghiệp)",q:"Hàm nhận dữ liệu xấu. Vì sao báo lỗi rõ ràng (raise) tốt hơn trả về một giá trị 'đại khái' như 0 hay None?",o:["Người gọi biết ngay có chuyện, không âm thầm dùng dữ liệu sai đi tiếp","Vì code ngắn hơn","Không có khác biệt"],a:0,h:"Nếu hệ thống tính tiền nhận về 0 thay vì lỗi, chuyện gì xảy ra?",s:"Chốt: lỗi lộ ra sớm, rõ ràng thì rẻ. Lỗi bị che đi thì đắt hơn nhiều."}];
const mk=(id,t,fn,args,brief,qs,ref,hid,errs)=>{
const qq=qs.map(([q,o,a,h])=>({k:"choice",ph:"Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",q,o,a,h,s:"Chốt: "+o[a]}));
LES[id]={t,ws:1,fn,ref,hid,errs,brief,cs:`def ${fn}(${args}):\n    pass\n`,
ts:`# Viết test TRƯỚC. Bỏ dấu # và sửa/thêm cho đủ ít nhất 3 assert.\ndef raises(exc, f, *a):\n    try:\n        f(*a)\n    except exc:\n        return True\n    return False\n\n# assert ${fn}(...) == ...\n# assert raises(ValueError, ${fn}, [])\n`,
steps:[...qq,...BIZ,
{k:"reflect",ph:"Bước 2: Chia nhỏ bài toán",q:"Viết 3 đến 5 gạch đầu dòng: bài này chia thành những việc nhỏ nào, theo thứ tự? (Gợi ý: kiểm tra đầu vào, chuẩn bị, lặp, trả kết quả.)",s:"Đã chia nhỏ bài toán"},
{k:"tests",ph:"Bước 3: Viết test trước (TDD, pha đỏ)",q:"Chưa có code nào cả. Viết ít nhất 3 assert: một ca đơn giản nhất, một ca thường, một ca biên, và ít nhất một ca đầu vào xấu phải raise (assert raises(...)). Hợp đồng và test viết TRƯỚC, code sau. Bấm chạy: hàm rỗng PHẢI thất bại.",s:"Test viết xong, đã thấy đỏ"},
{k:"code",mode:"guard",ph:"Bước 4: Hàng rào trước (exception và đầu vào xấu), CHƯA giải đề",q:"Làm như đội hệ thống thật: bảo vệ hàm trước. Chỉ viết phần chặn đầu vào xấu và raise đúng loại lỗi kèm thông điệp rõ. Chưa cần tính gì cả.",s:"Hàng rào đã chặn đủ các ca đầu vào xấu"},
{k:"code",mode:"happy",ph:"Bước 5: Giải đề: thuật toán đơn giản nhất để qua test (pha xanh)",q:"Hàng rào đã có sẵn bên dưới. Giờ mới giải đề. Chỉ cần xanh, code xấu, lặp lại đều được. Chưa cần đẹp.",s:"Test xanh với code đơn giản"},
{k:"code",mode:"err",ph:"Bước 6: Dọn dẹp (refactor)",q:"Giờ mới làm đẹp: đặt tên biến rõ nghĩa, bỏ đoạn thừa, thêm docstring. Chạy lại: vẫn xanh nghĩa là bạn không làm hỏng gì. Đây là lý do phải có test.",s:"Refactor an toàn nhờ test"}]}};
const TF=["Theo TDD, nên viết test nào đầu tiên?",["Danh sách 1 triệu phần tử","Ca nhỏ, đơn giản nhất, đáp án nhìn là biết","Ca ngẫu nhiên"],1,"Ca nhỏ nhất cho bạn điểm xuất phát chắc chắn."];
mk("w1","Code 1: find_max (tìm số lớn nhất)","find_max","nums","Viết hàm find_max(nums) trả về số lớn nhất trong danh sách nums.",
[["Đề chưa nói rõ điều gì?",["Hàm viết bằng ngôn ngữ nào","Danh sách rỗng thì xử lý thế nào","Tên hàm là gì"],1,"Hai ý kia đề đã nói. Hãy nghĩ đến đầu vào 'xấu' mà người dùng có thể đưa vào."],
["Danh sách rỗng, xử lý nào hợp lý nhất?",["Trả về 0","Báo lỗi ValueError","Trả về số bất kỳ"],1,"0 cũng có thể là số thật trong dữ liệu. Trả 0 sẽ che giấu lỗi, người gọi tưởng đó là kết quả thật."],TF],
`def find_max(nums):
    if not isinstance(nums, list):
        raise TypeError("nums phai la list")
    if len(nums) == 0:
        raise ValueError("list rong")
    best = nums[0]
    for x in nums:
        if x > best:
            best = x
    return best
`,[["find_max([3,1,2])","3"],["find_max([-5,-2,-9])","-2"],["find_max([7])","7"],["find_max([4,9,9])","9"]],[["find_max([])","ValueError"],["find_max(None)","TypeError"]]);
mk("w2","Code 2: linear_search (tìm chỉ số)","linear_search","nums, target","Viết hàm linear_search(nums, target) trả về chỉ số của target trong nums, hoặc -1 nếu không có.",
[["Danh sách [2,2], tìm 2. Trả về chỉ số nào?",["Đề chưa nói: ta chọn chỉ số đầu tiên và ghi rõ giả định","Chỉ số cuối","Cả hai chỉ số"],0,"Đề mơ hồ thì phải hỏi lại hoặc ghi giả định. Chọn chỉ số đầu giống hàm str.find quen thuộc."],
["Không tìm thấy thì trả về gì?",["0","-1, vì chỉ số hợp lệ không bao giờ âm","Không trả về gì"],1,"0 là chỉ số hợp lệ nên sẽ gây nhầm lẫn với 'tìm thấy ở đầu'."],TF],
`def linear_search(nums, target):
    if not isinstance(nums, list):
        raise TypeError("nums phai la list")
    for i in range(len(nums)):
        if nums[i] == target:
            return i
    return -1
`,[["linear_search([5,8,2,9,1],9)","3"],["linear_search([5,8],7)","-1"],["linear_search([],1)","-1"],["linear_search([2,2],2)","0"]],[["linear_search(None,1)","TypeError"]]);
mk("w3","Code 3: second_max (lớn thứ hai, đề mơ hồ)","second_max","nums","Viết hàm second_max(nums) trả về số lớn thứ hai trong danh sách nums.",
[["Với [5,5,3], số lớn thứ hai là 5 hay 3?",["Đề mơ hồ: ta giả định là 3 (khác biệt) và ghi lại để hỏi người ra đề","Chắc chắn là 5","Chắc chắn là 3, không cần hỏi"],0,"Trong công việc thật, giả định chưa được xác nhận phải được ghi ra, không giấu trong code."],
["[2,2] không có giá trị lớn thứ hai khác biệt. Nên làm gì?",["Báo ValueError","Trả về 2","Trả về 0"],0,"Trả giá trị giả sẽ che giấu việc dữ liệu không đủ."],TF],
`def second_max(nums):
    if not isinstance(nums, list):
        raise TypeError("nums phai la list")
    uniq = set(nums)
    if len(uniq) < 2:
        raise ValueError("can it nhat 2 gia tri khac nhau")
    uniq.remove(max(uniq))
    return max(uniq)
`,[["second_max([4,9,2,7])","7"],["second_max([5,5,3])","3"],["second_max([-1,-2])","-2"]],[["second_max([1])","ValueError"],["second_max([2,2])","ValueError"],["second_max(None)","TypeError"]]);
let P={done:{}};try{P=JSON.parse(localStorage.getItem("dsa")||"")||P}catch(e){}
P.g=P.g||{};P.u=P.u||{};const save=()=>{try{localStorage.setItem("dsa",JSON.stringify(P))}catch(e){}};
let ids=[];let cur=null,si=0,tries=0,opened=new Set(),log=[];
function unlocked(id){const i=ids.indexOf(id);return !!P.done[id]||(i==0||!!P.done[ids[i-1]])&&(typeof okPre!="function"||okPre(id))}
function okR(v){v=v.trim();const w=new Set(v.toLowerCase().split(/\s+/).filter(x=>x.length>=2&&/\p{L}/u.test(x)));return v.length>=15&&w.size>=4&&new Set(v.toLowerCase()).size>=8&&!/(.)\1{3,}/.test(v)}
function road(){const dn=ids.filter(i=>P.done[i]).length;$("#prog").max=ids.length;$("#prog").value=dn;$("#road").innerHTML=`<button class="lb g" id="rvb">Ôn hôm nay (trộn các bài đã học)</button>`+STAGES.map((s,i)=>`<div class="stage ${s.L?"":"off"}"><b>${s.n}</b><small>${s.d}${s.L?"":" (sẽ mở sau)"}</small>${(s.L||[]).map(id=>`<button class="lb ${P.done[id]?"done":""} ${cur==id?"cur":""}" data-id="${id}" ${unlocked(id)?"":"disabled"}><span>${LES[id].t}${P.done[id]?`<br><small style="color:var(--mut)">${stg(P.g[mk0(id)])}</small>`:""}</span></button>`).join("")}</div>`).join("")+
`<p class="rule">Quy tắc: nghĩ trước khi bấm. Sai thì đọc gợi ý, thử lại. Chỉ sau nhiều lần thử mới có nút xem đáp án.</p>`;
document.querySelectorAll(".lb:not(.g)").forEach(b=>b.onclick=()=>openR(b.dataset.id));$("#rvb").onclick=review}
function start(id){LES[id].dd=0;cur=id;si=0;tries=0;opened=new Set();log=[];WS={tests:LES[id].ts||"",code:LES[id].cs||""};road();draw()}
function arr(L,st){const A=st.arr||L.arr;if(!A)return"";const hs=st.hi;return`<div class="arr">${A.map((v,i)=>{
const shut=L.hide&&!opened.has(i);const cls="box"+(shut?" shut":"")+(hs===i||(st.k=="tap"&&opened.has(i))?" hi":"")+(L.hide&&opened.has(i)&&v==9?" good":"");
const clickable=st.k=="click"||st.k=="open"||st.k=="tap";
return`<div class="cell">${clickable?`<button class="${cls}" data-i="${i}">${shut?"?":v}</button>`:`<div class="${cls}">${shut?"?":v}</div>`}<div class="idx">${st.k=="tap"?(opened.has(i)?[...opened].indexOf(i)+1:""):(L.noidx||st.noidx?"":i)}</div></div>`}).join("")}</div>`}
function draw(){const p=$("#panel");p.className="panel";
if(!cur){p.innerHTML=`<h2>Bắt đầu từ đâu?</h2><p>Mỗi bậc thang rất thấp: học vài bước, luyện ngay tại chỗ, rồi mới bước tiếp. Chọn bài đầu tiên ở bên trái; nút "Ôn hôm nay" trộn các bài đã học để nhớ lâu hơn. Mỗi bài chỉ có vài bước rất nhỏ. Nếu bạn chưa biết gì cả, cứ bắt đầu từ giai đoạn "Mẫu giáo": đếm, so sánh, thứ tự, trước khi chạm vào máy tính. Các bài Code ở giai đoạn 1 chạy Python thật: phân tích đề, chia nhỏ, viết test trước, code đơn giản, xử lý lỗi, dọn code. Bạn không cần biết trước điều gì.</p><p class="sub">Cách học ở đây: dự đoán trước, làm sau, rồi tự rút ra quy luật. Giống cô giáo hỏi từng câu một, không nói trước đáp án.</p>`;return}
const L=LES[cur];
if(si>=L.steps.length&&L.dr&&!L.dd){L.dd=1;return drill(cur,DR[L.dr],5,()=>draw(),"Luyện ngay để nhớ: "+L.t)}
if(si>=L.steps.length){P.done[cur]=1;save();road();const n=ids[ids.indexOf(cur)+1];
p.innerHTML=`<h2>${L.t}</h2><ul class="log">${log.map(x=>`<li>${x}</li>`).join("")}</ul><div class="fb ok"><b>Xong bài này.</b> Trước khi sang bài sau, thử nhắm mắt và tự kể lại: bạn vừa học được quy luật gì?</div><p>${n?`<button class="go" id="nx">Bài tiếp theo</button>`:"Đã hết các bài hiện có. Hãy nhắn thêm để mở giai đoạn 2."}</p>`;
if(n)$("#nx").onclick=()=>start(n);return}
const st=L.steps[si];
p.className=(st.k=="tests"||st.k=="code")?"panel split":"panel";p.innerHTML=`<div class="lt"><h2>${L.t}</h2><ul class="log">${log.map(x=>`<li>${x}</li>`).join("")}</ul>${L.brief?`<p class="sub"><b>Đề:</b> ${L.brief}</p>`:""}${arr(L,st)}${st.ph?`<p class="ph">${st.ph}</p>`:""}<div class="q">${st.q}</div></div><div class="rt"><div id="in"></div><div id="fb"></div></div>`;
const inn=$("#in");let hn=0;$("#fb").insertAdjacentHTML("afterend",`<p><button class="ghost" id="hp">Cần giúp</button></p><pre class="out" id="hl" hidden></pre>`);
$("#hp").onclick=()=>{const H=st.hp||[st.h||"Đọc lại đề, thử bước nhỏ nhất trước."];const h=$("#hl");h.hidden=false;h.textContent=`Gợi ý ${Math.min(hn+1,H.length)}/${H.length}:\n`+H[Math.min(hn,H.length-1)];hn++;$("#hp").textContent=hn<H.length?"Cần giúp thêm":"Hết gợi ý, hỏi mình nếu vẫn kẹt"};
if(st.k=="input"){inn.innerHTML=`<input id="v" type="number" inputmode="numeric" aria-label="Câu trả lời"> <button class="go" id="ok">Kiểm tra</button>`;$("#ok").onclick=()=>check(+$("#v").value||($("#v").value==="0"?0:NaN));$("#v").onkeydown=e=>{if(e.key=="Enter")$("#ok").click()};$("#v").focus()}
else if(st.k=="choice"){inn.innerHTML=`<div class="opts">${st.o.map((o,i)=>`<button data-o="${i}">${o}</button>`).join("")}</div>`;inn.querySelectorAll("button").forEach(b=>b.onclick=()=>check(+b.dataset.o))}
else if(st.k=="order"){orderUI(st)}
else if(st.k=="build"){buildUI(st)}
else if(st.k=="tests"||st.k=="code"){codeUI(st)}
else if(st.k=="reflect"){inn.innerHTML=`<textarea id="r" placeholder="Viết ra suy nghĩ của bạn..."></textarea><p><button class="go" id="ok">Tôi đã viết xong</button></p>`;$("#ok").onclick=()=>{if(!okR($("#r").value)){fb("Hãy viết bằng lời của bạn: ít nhất vài từ khác nhau, không lặp ký tự.");return}pass(st)}}
else p.querySelectorAll(".arr button").forEach(b=>b.onclick=()=>{const i=+b.dataset.i;
if(st.k=="click")check(i);else if(st.k=="tap"){opened.add(i);if(opened.size>=(st.arr||L.arr).length)pass(st);else draw()}else{opened.add(i);if(i==st.a){pass(st)}else{draw()}}})}
function fb(t,ok){$("#fb").innerHTML=`<div class="fb ${ok?"ok":""}">${t}</div>`}
function check(v){const st=LES[cur].steps[si];if(v===st.a){pass(st);return}
tries++;let t="Chưa đúng, không sao, sai là cách não học. Gợi ý: "+st.h;
if(tries>=3)t+=` <button class="ghost" id="rv">Xem đáp án</button>`;fb(t);
if(tries>=3)$("#rv").onclick=()=>{fb("Đáp án: "+st.s+" Hãy tự giải thích lại vì sao trước khi đi tiếp.",1);setTimeout(()=>pass(st,1),2600)}}
function pass(st,peek){if(st.k=="tap")opened=new Set();log.push(st.s||"Đã làm");si++;tries=0;if(st.k=="open")opened=new Set(opened);draw();
if(!peek){const f=$("#panel");f.insertAdjacentHTML("afterbegin","")}}

function loadSk(){return new Promise((res,rej)=>{if(window.Sk)return res();const a=document.createElement("script");a.src="https://cdnjs.cloudflare.com/ajax/libs/skulpt/1.2.0/skulpt.min.js";a.onload=()=>{const b=document.createElement("script");b.src="https://cdnjs.cloudflare.com/ajax/libs/skulpt/1.2.0/skulpt-stdlib.js";b.onload=res;b.onerror=rej;document.head.appendChild(b)};a.onerror=rej;document.head.appendChild(a)})}
const EXPL={IndexError:["Bạn đang lấy một vị trí không tồn tại.","Danh sách n phần tử chỉ có chỉ số từ 0 đến n - 1. Hãy tự hỏi: chỉ số bạn dùng là mấy, và len(danh sách) là mấy?"],
KeyError:["Bạn tra một key chưa có trong dictionary.","Thử hỏi: key này đã được ghi vào chưa? Có thể kiểm tra bằng 'k in d' trước khi tra."],
TypeError:["Bạn đang dùng sai loại dữ liệu cho phép toán, hoặc gọi hàm sai số lượng tham số.","Ví dụ cộng chữ với số. Thử in type(biến) để xem biến đang là loại gì."],
ValueError:["Giá trị đúng loại nhưng không hợp lệ cho việc đang làm.","Đọc thông điệp phía sau tên lỗi: nó thường nói rõ giá trị nào không hợp lệ."],
NameError:["Python chưa biết cái tên này.","Có thể bạn gõ sai tên, hoặc dùng biến/hàm trước khi tạo nó. Soát lại chính tả từng ký tự."],
ZeroDivisionError:["Bạn đang chia cho 0.","Tìm phép chia trong code. Biến ở dưới mẫu số có thể bằng 0 trong trường hợp nào?"],
AttributeError:["Cái bạn đang chấm vào (.tên) không có thuộc tính hay hàm đó.","Thường vì biến là None hoặc là loại dữ liệu khác bạn nghĩ. In biến ra xem."],
IndentationError:["Thụt dòng chưa đúng.","Python dùng thụt dòng để biết dòng nào nằm trong if, for, def. Các dòng cùng khối phải thụt bằng nhau."],
SyntaxError:["Câu lệnh viết sai cú pháp, Python chưa hiểu nổi.","Hay gặp: thiếu dấu : cuối dòng if/for/def, thiếu đóng ngoặc, hoặc thiếu dấu nháy."],
AssertionError:["Một dòng assert đã sai: kết quả thật khác kết quả bạn mong đợi.","Chưa vội sửa code. Chọn assert bị sai, tự dò bằng tay xem kết quả đúng là gì, rồi so với những gì code trả về."],
RecursionError:["Hàm đệ quy gọi mình quá sâu mà không dừng.","Kiểm tra ca cơ sở: có điều kiện dừng không? Mỗi lần gọi, bài toán có thật sự nhỏ đi không?"],
TimeLimitError:["Chương trình chạy quá lâu, rất có thể vòng lặp không bao giờ dừng.","Xem vòng while: biến trong điều kiện có thay đổi sau mỗi vòng không?"]};
function explain(m){const k=Object.keys(EXPL).find(x=>m.includes(x));return k?`\n\n--- Giải thích dễ hiểu (${k}) ---\n${EXPL[k][0]}\n${EXPL[k][1]}\n(Mình chưa chỉ ra dòng cần sửa: hãy tự tìm trước.)`:""}
async function py(code){try{await loadSk()}catch(e){return{ok:0,err:"Không tải được trình chạy Python. Kiểm tra mạng rồi thử lại."}}
let out="";Sk.configure({output:t=>out+=t,read:x=>{if(Sk.builtinFiles===undefined||Sk.builtinFiles.files[x]===undefined)throw"File not found: "+x;return Sk.builtinFiles.files[x]},__future__:Sk.python3,execLimit:5000});
try{await Sk.misceval.asyncToPromise(()=>Sk.importMainWithBody("<stdin>",false,code,true));return{ok:1,out}}catch(e){return{ok:0,out,err:String(e)+explain(String(e))}}}
function hid(L,mode){let s=L.code+"\n";L.hid.forEach(([c,e])=>{s+=`try:\n    r = ${c}\n    if r != ${e}:\n        print("DO: ${c} tra ve " + str(r) + ", can ${e}")\nexcept Exception as e:\n    print("DO: ${c} bi crash " + type(e).__name__)\n`});
if(mode=="err")L.errs.forEach(([c,x])=>{s+=`try:\n    ${c}\n    print("DO: ${c} phai raise ${x}")\nexcept ${x}:\n    pass\nexcept Exception as e:\n    print("DO: ${c} raise sai loai: " + type(e).__name__ + ", can ${x}")\n`});return s}
function codeUI(st){const key=st.k=="tests"?"tests":"code";
$("#in").innerHTML=`<textarea class="code" id="ed" spellcheck="false"></textarea><p><button class="go" id="run">${st.k=="tests"?"Chạy test (mong đợi: đỏ)":"Chạy test"}</button></p><pre class="out" id="out"></pre>`;
const ed=$("#ed");ed.value=WS[key];ed.oninput=()=>WS[key]=ed.value;
ed.onkeydown=e=>{if(e.key=="Tab"){e.preventDefault();const a=ed.selectionStart;ed.setRangeText("    ",a,ed.selectionEnd,"end");WS[key]=ed.value}};
$("#run").onclick=()=>st.k=="tests"?runTests(st):runCode(st)}
async function runTests(st){const L=LES[cur],o=$("#out"),T=WS.tests;
if(T.split("\n").filter(l=>/^assert /.test(l.trim())).length<3)return o.textContent="Cần ít nhất 3 dòng assert (bỏ dấu # đầu dòng và viết thêm).";
if(!/\[\]|None/.test(T))return o.textContent="Chưa có test ca biên (danh sách rỗng hoặc đầu vào None). Dân chuyên nghiệp luôn test biên.";
if(/___/.test(T))return o.textContent="Còn chỗ ___ chưa điền. Hãy thay bằng giá trị bạn nghĩ là đúng.";
o.textContent="Đang chạy (lần đầu tải Python mất vài giây)...";
let r=await py(L.ref+"\n"+T);if(!r.ok)return o.textContent="Test của bạn tự sai (chạy với lời giải chuẩn không qua):\n"+r.err;
r=await py(`def ${L.fn}(*a):\n    return None\n`+T);
if(r.ok)return o.textContent="Test quá yếu: hàm rỗng cũng qua. Thêm assert có kỳ vọng cụ thể.";
o.textContent="ĐỎ ✓ Đúng như TDD: hàm rỗng bị test của bạn bắt được. Sang bước hàng rào (exception) trước khi giải đề.";WS.code=guardStart(L);setTimeout(()=>pass(st),1600)}
const guardAt=(l,j)=>/^    if /.test(l[j]||"")&&/^        raise/.test(l[j+1]||"");
function gscan(l){let i=1;for(;;){let j=i;while(j<l.length&&/^\s*#/.test(l[j]))j++;if(guardAt(l,j)){i=j+2;while(i<l.length&&/^        /.test(l[i]))i++}else return i}}
const gsplit=c=>c.replace(/\s+$/,"").split("\n");
const guardRef=ref=>{const l=gsplit(ref);return l.slice(0,gscan(l)).join("\n")+"\n    return None\n"};
const guardStart=L=>L.cs.split("\n")[0]+"\n    # Hàng rào: chặn đầu vào xấu bằng raise đúng loại lỗi. CHƯA giải đề.\n    pass\n";
const mergeCore=L=>{const a=gsplit(WS.code);while(a.length>1&&/^\s*(pass|return None)\s*$|^\s*#/.test(a[a.length-1]))a.pop();const c=gsplit(L.cs);return a.join("\n")+"\n"+c.slice(gscan(c)).join("\n")+"\n"};
const errChk=(L,idx)=>{let s="";idx.forEach(i=>{const[c,x]=L.errs[i];s+=`try:\n    ${c}\n    print("DO: ${c} phai raise ${x}")\nexcept ${x}:\n    pass\nexcept Exception as e:\n    print("DO: ${c} raise sai loai: " + type(e).__name__ + ", can ${x}")\n`});return s};
async function runGuard(st,o){const L=LES[cur];let s=guardRef(L.ref)+"\n";L.errs.forEach(([c,x],i)=>{s+=`try:\n    ${c}\nexcept ${x}:\n    print("G|${i}")\nexcept Exception:\n    pass\n`});
const r0=await py(s),G=(r0.out||"").split("\n").filter(l=>l.startsWith("G|")).map(l=>+l.slice(2));
if(G.length){const r=await py(WS.code+"\n"+errChk(L,G));if(!r.ok)return o.textContent="Code lỗi:\n"+r.err;const bad=(r.out||"").split("\n").filter(Boolean);if(bad.length)return o.textContent="Hàng rào chưa đủ:\n"+bad.join("\n")+"\n(Đầu vào xấu phải bị chặn bằng raise TRƯỚC khi tính gì.)"}
o.textContent=G.length?`XANH ✓ Hàng rào chặn đủ ${G.length} ca đầu vào xấu. Chưa giải đề: đúng cách làm ở doanh nghiệp, bảo vệ trước.`:"Bài này không có ca đầu vào xấu nào chặn được trước khi tính. Sang bước giải đề.";
WS.code=mergeCore(L);setTimeout(()=>pass(st),1600)}
async function runCode(st){const L=LES[cur],o=$("#out");if(/___/.test(WS.code)){o.textContent="Còn chỗ ___ chưa điền. Đọc comment bên trên mỗi dòng để biết cần điền gì.";return}
if(st.mode=="guard")return runGuard(st,o);o.textContent="Đang chạy...";L.code=WS.code;
let r=await py(WS.code+"\n"+WS.tests);if(!r.ok)return o.textContent="Test CỦA BẠN chưa qua:\n"+r.err+"\n(Đọc dòng lỗi, tìm assert nào fail rồi sửa code.)";
r=await py(hid(L,st.mode));if(!r.ok)return o.textContent="Code lỗi:\n"+r.err;
const bad=(r.out||"").split("\n").filter(Boolean);
if(bad.length)return o.textContent="CI báo đỏ:\n"+bad.join("\n");
o.textContent="XANH ✓ Tất cả test qua.";setTimeout(()=>pass(st),1400)}

function orderUI(st){const L=LES[cur],it=st.items,sh=[...it.keys()].reverse();let got=[],wr=0;
const rd=()=>{const nx=got.length;$("#in").innerHTML=`<ol>${got.map(i=>`<li>${it[i][0]}</li>`).join("")}</ol>`+(nx<it.length?`${(L.lvl==1||wr>0)?`<div class="fb ok">Hãy nghĩ: ${it[nx][1]}</div>`:""}<div class="opts" style="flex-direction:column;align-items:flex-start;margin-top:8px">${sh.filter(i=>!got.includes(i)).map(i=>`<button data-i="${i}">${it[i][0]}</button>`).join("")}</div>`:`<div class="fb ok">Đúng thứ tự rồi. Đây cũng chính là dàn ý của code.</div><p><button class="go" id="nx2">Tiếp tục</button></p>`);
$("#in").querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>{if(+b.dataset.i==got.length){got.push(+b.dataset.i);wr=0}else{wr++}rd();if(wr)fb("Chưa phải việc tiếp theo, không sao. Trả lời câu hỏi gợi ý rồi chọn lại.")});
const n2=$("#nx2");if(n2)n2.onclick=()=>pass(st)};rd()}
const scaf=(id,lvl,lab,items,ts,cs,h1,sk,rc)=>{const L=LES[id];L.lvl=lvl;L.ts=ts;L.cs=cs;L.brief+=`<br><small>Mức dẫn dắt: ${lab}</small>`;
const n=L.steps.findIndex(x=>x.k=="reflect");
L.steps[n]={k:"order",ph:"Bước 2: Chia nhỏ bài toán",q:"Sắp xếp các việc nhỏ theo thứ tự thực hiện. "+["","Mỗi lần mình sẽ hỏi một câu để bạn nghĩ.","Mình chỉ hỏi khi bạn chọn chưa đúng.","Tự thử trước, cần thì bấm Cần giúp."][lvl],items,s:"Đã chia nhỏ đúng thứ tự"};
const f=L.fn;L.steps.find(x=>x.k=="tests").hp=["Nghĩ ba ca: nhỏ nhất, bình thường, và ca biên (danh sách rỗng).",`Cú pháp: assert ${f}(...) == kết_quả_mong_đợi\nLỗi: assert raises(ValueError, ${f}, [])`];
const c=L.steps.filter(x=>x.k=="code");
c[1].hp=[h1,"Khung gợi ý (điền chỗ ___):\n"+sk,"Lời giải tham khảo. Hãy tự gõ lại bằng tay, đừng copy, gõ lại giúp não nhớ hơn:\n"+L.ref];
c[0].hp=["Hàm có thể nhận None hoặc kiểu khác list. Dòng đầu tiên của hàm nên làm gì?","Mẫu:\nif not isinstance(nums, list):\n    raise TypeError(\"nums phai la list\")","Lời giải tham khảo:\n"+L.ref];
c[2].hp=["Đọc lại từng tên biến: một người lạ đọc có hiểu không?","Thêm 1 dòng docstring dưới def, đổi tên biến ngắn thành tên có nghĩa, rồi chạy lại."];
L.steps.unshift({k:"choice",ph:"Khởi động: nhắc lại bài cũ (nhắc lại nhiều lần mới nhớ lâu)",q:rc[0],o:rc[1],a:rc[2],h:rc[3],s:"Ôn lại: "+rc[1][rc[2]]})};
const HP="def raises(exc, f, *a):\n    try:\n        f(*a)\n    except exc:\n        return True\n    return False\n\n";
scaf("w1",1,"Nhiều (mình hỏi và điền chỗ trống cùng bạn)",[["Kiểm tra danh sách có rỗng không","Nếu không có hộp nào thì có số lớn nhất không?"],["Lấy hộp đầu làm số lớn nhất tạm thời","Tờ giấy nhớ lúc đầu nên ghi gì?"],["Duyệt từng số, lớn hơn thì ghi đè","Muốn chắc đã xét hết, ta làm gì với từng hộp?"],["Trả về số lớn nhất tạm thời","Duyệt xong rồi thì tờ giấy đang ghi gì?"]],
"# Bài này mình viết sẵn khung. Bạn chỉ điền các chỗ ___ bằng kết quả mong đợi, rồi chạy.\n"+HP+"assert find_max([7]) == ___        # 1 phần tử: lớn nhất là chính nó\nassert find_max([3,1,2]) == ___    # ca thường\nassert find_max([-5,-2,-9]) == ___ # toàn số âm\nassert raises(ValueError, find_max, [])  # ca biên: rỗng phải báo lỗi\n",
"def find_max(nums):\n    # 1) rỗng thì báo lỗi: độ dài bằng ___ ?\n    if len(nums) == ___:\n        raise ValueError(\"list rong\")\n    # 2) hộp đầu có chỉ số ___ ? lấy làm tờ giấy nhớ\n    best = nums[___]\n    # 3) duyệt từng số, nếu x ___ best (lớn hơn) thì ghi đè\n    for x in nums:\n        if x ___ best:\n            best = x\n    return best\n",
"Đọc comment từng dòng và điền ___. Hãy nhớ bài tờ giấy nhớ.","def find_max(nums):\n    if len(nums) == ___:\n        raise ValueError(\"list rong\")\n    best = nums[___]\n    for x in nums:\n        if x ___ best:\n            best = x\n    return best",
["Mảng 4 hộp, hộp cuối có chỉ số mấy?",["4","3","5"],1,"Đếm từ 0: 0, 1, 2, 3."]);
scaf("w2",2,"Vừa (có khung comment, tự điền code)",[["Đi từng vị trí i từ đầu danh sách","Muốn gặp số cần tìm sớm nhất, nên bắt đầu từ đâu?"],["Nếu nums[i] bằng target thì trả về i","Gặp đúng số cần tìm thì làm gì?"],["Duyệt hết mà không thấy thì trả về -1","Đi hết vòng mà chưa trả về gì thì kết luận gì?"]],
"# Mình cho sẵn 1 test mẫu. Bạn viết thêm ít nhất 2 test nữa.\n"+HP+"assert linear_search([5,8,2,9,1], 9) == 3   # ví dụ có sẵn\n# ca không tìm thấy: ?\n# ca danh sách rỗng: ?\n# ca số trùng: ?\n",
"def linear_search(nums, target):\n    # việc 1: đi từng vị trí i từ đầu\n    # việc 2: nếu nums[i] bằng target thì trả về i\n    # việc 3: đi hết mà không thấy thì trả về ?\n    pass\n",
"Nhìn lại bài tờ giấy nhớ: cũng duyệt từng hộp. Lần này thay vì ghi đè, ta so sánh với target.","def linear_search(nums, target):\n    for i in range(len(nums)):\n        if nums[i] ___ target:\n            return ___\n    return ___",
["Duyệt tìm số trong n hộp, trường hợp xấu nhất mở bao nhiêu hộp?",["1","n","n*n"],1,"Xấu nhất là số cần tìm nằm ở hộp cuối, hoặc không có."]);
scaf("w3",3,"Ít (tự làm, mình chỉ hỗ trợ khi bạn bấm Cần giúp)",[["Loại các giá trị trùng nhau","[5,5,3] thì 5 được tính mấy lần?"],["Nếu còn dưới 2 giá trị thì báo ValueError","Còn 1 giá trị thì có hạng hai không?"],["Bỏ giá trị lớn nhất đi","Muốn tìm hạng hai, bỏ hạng nhất rồi thì còn gì?"],["Trả về giá trị lớn nhất của phần còn lại","Phần còn lại, cái lớn nhất là hạng mấy?"]],
"# Lần này test do bạn tự viết. Cần giúp thì bấm nút.\n"+HP,
"def second_max(nums):\n    pass\n",
"Thử nghĩ: nếu bỏ hết số trùng và bỏ số lớn nhất thì cái lớn nhất của phần còn lại là gì?","def second_max(nums):\n    uniq = set(nums)\n    if len(uniq) < ___:\n        raise ValueError(\"can it nhat 2 gia tri khac nhau\")\n    uniq.remove(max(uniq))\n    return ___(uniq)",
["Khi tìm số lớn nhất, tờ giấy nhớ ban đầu nên ghi gì?",["Số 0","Phần tử đầu tiên","Để trống"],1,"Số 0 sai nếu toàn số âm."]);

const MS=[3,10,30,100,300,1000];
const today=()=>new Date().toISOString().slice(0,10);
const R=n=>1+Math.floor(Math.random()*n);
const SK={
idx:{t:"Chỉ số mảng (đếm từ 0)",g:()=>{const n=R(98)+1;return{q:`Mảng có ${n} hộp. Chỉ số của hộp cuối là?`,a:n-1,w:`Hộp đầu là 0 nên hộp cuối = ${n} - 1 = ${n-1}.`}}},
max:{t:"Tờ giấy nhớ khi tìm số lớn nhất",g:()=>{const a=Array.from({length:5},()=>R(9)),k=R(4),m=Math.max(...a.slice(0,k+1));return{q:`Mảng ${JSON.stringify(a)}. Sau khi xét xong hộp chỉ số ${k}, tờ giấy nhớ ghi số mấy?`,a:m,w:`Lớn nhất của ${JSON.stringify(a.slice(0,k+1))} là ${m}.`}}},
lin:{t:"Tìm tuyến tính: chỉ số đầu tiên hoặc -1",g:()=>{const a=Array.from({length:6},()=>R(5)),t=R(6),x=a.indexOf(t);return{q:`linear_search(${JSON.stringify(a)}, ${t}) trả về?`,a:x,w:x<0?`Không có ${t} nên trả -1.`:`${t} gặp đầu tiên ở chỉ số ${x}.`}}},
cm:{t:"Gõ lại hàm find_max",type:"w1"},cl:{t:"Gõ lại hàm linear_search",type:"w2"}};
[["idx","l1"],["lin","l2"],["max","l3"],["cm","w1"],["cl","w2"]].forEach(([k,r])=>SK[k].req=r);
function stg(r){const n=r?r.n:0,d=r?r.d.length:0;return n>=1000?"Bản năng":n>=300?"Rất thạo":n>=100?"Thạo":n>=30&&d>=7?"Gần tự động":n>=10?"Quen tay":n>=3?"Bắt đầu nhớ":"Mới gặp"}
function bump(k){const r=P.g[k]||(P.g[k]={n:0,d:[]});r.n++;if(!r.d.includes(today()))r.d.push(today());save()}
function gym(){cur=null;$("#panel").className="panel";road();const rows=Object.keys(SK).map(k=>{const r=P.g[k]||{n:0,d:[]},q=SK[k],lock=!P.done[q.req],nx=MS.find(m=>m>r.n)||1000,td=r.d.includes(today());
return`<div class="stage ${lock?"off":""}"><b>${q.t}</b>${lock?`<small>Đang khóa. Hãy học xong bài «${LES[q.req].t}» trước, vì gõ lại khi chưa hiểu thì không nhớ được.</small>`:`<small>${stg(r)}: ${r.n}/${nx} lần đúng, qua ${r.d.length} ngày ${td?"(hôm nay đã tập)":"(hôm nay chưa tập)"}</small><progress max="${nx}" value="${r.n}" style="width:100%"></progress>`}<button class="lb g2" data-k="${k}" ${lock?"disabled":""}>${q.type?(P.u[k]?"Gõ lại":"Hiểu từng dòng trước"):"Tập 10 câu"}</button></div>`}).join("");
$("#panel").innerHTML=`<h2>Phòng tập lặp lại</h2><p class="sub">Thứ tự đúng: hiểu trước, rồi mới lặp lại. Mỗi ý cần nhớ đúng khoảng 3 lần ngay buổi đầu, rồi ôn cách quãng nhiều ngày khác nhau mới giữ lâu. Phản xạ tự động cần lặp đều đặn, trung bình khoảng 66 ngày, tùy người từ 18 đến hơn 250 ngày. Mốc ở đây là 3, 10, 30, 100, 300, 1000 lần đúng. Mỗi ngày tập ít nhưng đều.</p><div class="gymgrid">${rows}</div>`;
document.querySelectorAll(".g2").forEach(b=>b.onclick=()=>SK[b.dataset.k].type?gtype(b.dataset.k):gdrill(b.dataset.k))}
function gdrill(k){const s=SK[k],p=$("#panel");let i=0,ok=0;
const ask=()=>{if(i>=10){p.innerHTML=`<h2>${s.t}</h2><div class="fb ok">Xong 10 câu, đúng ngay lần đầu: ${ok}/10. Mai quay lại tập tiếp: ôn cách quãng nhớ lâu hơn ôn dồn một lúc.</div><p><button class="go" id="b1">Về phòng tập</button></p>`;$("#b1").onclick=gym;return}
const q=s.g();let wrong=false;p.innerHTML=`<h2>${s.t}</h2><p class="sub">Câu ${i+1}/10</p><div class="q">${q.q}</div><input id="v" type="number"> <button class="go" id="ok">Kiểm tra</button><div id="fb"></div>`;$("#v").focus();
const go=()=>{const v=$("#v").value;if(v==="")return;if(+v===q.a){if(!wrong){ok++;bump(k)}i++;ask()}else{wrong=true;fb("Chưa đúng. "+q.w+" Gõ lại đáp án đúng để nhớ, câu này chưa tính điểm.")}};
$("#ok").onclick=go;$("#v").onkeydown=e=>{if(e.key=="Enter")go()}};ask()}
function gtype(k){if(!P.u[k])return gund(k);const s=SK[k],L=LES[s.type],r=P.g[k]||{n:0},copy=r.n<5,p=$("#panel");
p.innerHTML=`<h2>${s.t}</h2><p class="sub">${copy?`Chế độ chép (${r.n}/5): nhìn mẫu, gõ lại từng ký tự. Chép đi chép lại giúp não ghi nhớ, đừng copy-paste.`:"Chế độ nhớ: mẫu đã ẩn. Gõ lại từ trí nhớ, code sẽ chạy test thật."}</p>${copy?`<pre class="out" id="sm"></pre>`:""}<textarea class="code" id="ed" spellcheck="false"></textarea><p><button class="go" id="run">Kiểm tra</button> <button class="ghost" id="b1">Về phòng tập</button> <button class="ghost" id="b2">Xem lại giải thích</button></p><pre class="out" id="out"></pre>`;
if(copy)$("#sm").textContent=L.ref;$("#b1").onclick=gym;$("#b2").onclick=()=>gund(k,1);const ed=$("#ed"),o=$("#out");
ed.onkeydown=e=>{if(e.key=="Tab"){e.preventDefault();ed.setRangeText("    ",ed.selectionStart,ed.selectionEnd,"end")}};
const nm=t=>t.trim().split("\n").map(l=>l.replace(/\s+$/,"")).join("\n");
$("#run").onclick=async()=>{if(copy){const a=nm(ed.value).split("\n"),b=nm(L.ref).split("\n");const d=b.findIndex((l,i)=>a[i]!==l);
if(d<0&&a.length==b.length){bump(k);o.textContent="Đúng hoàn toàn. +1 lần.";setTimeout(()=>gtype(k),1200)}else o.textContent=`Chưa khớp ở dòng ${d<0?b.length+1:d+1}. Nhìn kỹ dấu cách, dấu hai chấm, thụt dòng.`;return}
o.textContent="Đang chạy...";L.code=ed.value;const x=await py(hid(L,"err"));
if(!x.ok)o.textContent="Code lỗi:\n"+x.err;else{const bad=(x.out||"").split("\n").filter(Boolean);if(bad.length)o.textContent="Chưa qua:\n"+bad.join("\n");else{bump(k);o.textContent="XANH ✓ Gõ từ trí nhớ mà đúng. +1 lần.";setTimeout(()=>gtype(k),1400)}}}}

const EX={cm:{b:[
["def find_max(nums):","Tạo một hàm tên find_max. Hàm nhận vào nums, là cả hàng hộp (danh sách).","Giống đặt tên một việc: 'tìm hộp lớn nhất', rồi đưa cho nó hàng hộp cần xem."],
["    if not isinstance(nums, list):\n        raise TypeError(\"nums phai la list\")","Kiểm tra nums có đúng là danh sách không. Nếu không thì dừng lại và báo lỗi sai kiểu (TypeError).","Cô bảo xếp hàng hộp mà bạn đưa một quả bóng, thì phải nói ngay: đây không phải hàng hộp."],
["    if len(nums) == 0:\n        raise ValueError(\"list rong\")","len đếm số hộp. Bằng 0 nghĩa là không có hộp nào, nên không có số lớn nhất, báo lỗi giá trị (ValueError).","Hàng không có hộp nào mà hỏi 'hộp nào lớn nhất' là hỏi sai."],
["    best = nums[0]","Lấy hộp đầu (chỉ số 0) ghi vào tờ giấy nhớ tên best.","Bài tờ giấy nhớ: lúc đầu mới biết một hộp, nên ghi hộp đó."],
["    for x in nums:","Lần lượt cầm từng số trong hàng, gọi tên là x. Mỗi lần lặp là một hộp.","Đi dọc hàng hộp, mở từng hộp một."],
["        if x > best:\n            best = x","Nếu hộp đang mở (x) lớn hơn tờ giấy nhớ thì ghi đè tờ giấy bằng x.","Thấy số to hơn thì xóa số cũ trên giấy, viết số mới."],
["    return best","Đi hết hàng rồi, trả tờ giấy nhớ ra làm kết quả.","Cuối cùng đưa tờ giấy cho người đã hỏi."]],
q:[["Dòng nào làm việc 'ghi đè tờ giấy khi gặp số to hơn'?",["best = nums[0]","if x > best: best = x","return best"],1,"Chỉ dòng if so sánh x với best mới ghi đè."],["Vì sao best ban đầu là nums[0] chứ không phải 0?",["Vì 0 sai khi toàn số âm","Vì cho đẹp","Vì Python bắt buộc"],0,"Nếu toàn số âm thì 0 lớn hơn tất cả, kết quả sẽ sai."]]},
cl:{b:[
["def linear_search(nums, target):","Hàm nhận hàng hộp nums và con số cần tìm target.","Giống bảo: tìm giúp mình hộp có số này."],
["    if not isinstance(nums, list):\n        raise TypeError(\"nums phai la list\")","Nếu nums không phải danh sách thì báo lỗi sai kiểu.","Đưa quả bóng thay vì hàng hộp thì phải báo."],
["    for i in range(len(nums)):","range(len(nums)) cho ra các chỉ số 0, 1, 2... đến hộp cuối. i là số thứ tự hộp đang mở.","Đi từ hộp số 0, rồi số 1, rồi số 2."],
["        if nums[i] == target:\n            return i","Nếu hộp số i chứa đúng số cần tìm thì trả về i luôn và dừng.","Gặp đúng hộp thì reo lên: ở hộp số i! Khỏi mở tiếp."],
["    return -1","Mở hết mà không gặp thì trả về -1.","-1 nghĩa là không có hộp nào như vậy, vì số thứ tự thật không bao giờ âm."]],
q:[["Mảng [5,8,2,9], tìm số 9. Hàm trả về?",["9","3","-1"],1,"Hàm trả về chỉ số (vị trí), không phải giá trị. 9 nằm ở chỉ số 3."],["Vì sao return -1 nằm NGOÀI vòng for?",["Vì chỉ kết luận 'không có' sau khi đã mở hết hộp","Cho đẹp","Python bắt buộc"],0,"Đặt trong vòng for thì hàm kết luận ngay sau hộp đầu tiên."]]}};
function gund(k,rv){const E=EX[k],p=$("#panel");let i=0;
const step=()=>{if(i>=E.b.length)return rv?gtype(k):quiz(0);const[c,e,a]=E.b[i];
p.innerHTML=`<h2>${SK[k].t}: hiểu trước, gõ sau</h2><p class="sub">Phần ${i+1}/${E.b.length}. Đọc đoạn code, rồi đọc lời giải thích.</p><pre class="out" id="cc"></pre><div class="q">${e}</div><div id="an" class="fb ok" hidden>Nghĩ theo cách khác: ${a}</div><p><button class="go" id="y">Mình hiểu rồi</button> <button class="ghost" id="n">Chưa hiểu, giải thích cách khác</button></p>`;
$("#cc").textContent=c;$("#y").onclick=()=>{i++;step()};$("#n").onclick=()=>{$("#an").hidden=false}};
const quiz=j=>{if(j>=E.q.length){P.u[k]=1;save();return gtype(k)}const[q,o,ans,w]=E.q[j];
p.innerHTML=`<h2>Kiểm tra xem đã hiểu chưa</h2><p class="sub">Câu ${j+1}/${E.q.length}</p><div class="q">${q}</div><div class="opts">${o.map((x,n)=>`<button data-o="${n}">${x}</button>`).join("")}</div><div id="fb"></div>`;
p.querySelectorAll("[data-o]").forEach(b=>b.onclick=()=>{if(+b.dataset.o==ans)quiz(j+1);else fb("Chưa đúng, không sao. "+w+" Đọc lại nếu cần rồi chọn lại.")})};step()}

const P_=c=>`<pre class="out">${c}</pre>`;
const I=(q,a,h,s)=>({k:"input",q,a,h,s}),C=(q,o,a,h,s)=>({k:"choice",q,o,a,h,s});
const rnd=n=>1+Math.floor(Math.random()*n),ar=(n,m)=>Array.from({length:n},()=>rnd(m)),J=JSON.stringify;
const mk0=id=>({w1:"cm",w2:"cl"}[id]||id);
const DR={idx:SK.idx.g,lin:SK.lin.g,max:SK.max.g,
asg:()=>{const A=rnd(9),B=rnd(9),C=rnd(Math.min(5,A+B-1));return{c:`x = ${A}\ny = x + ${B}\nx = y - ${C}`,q:"Sau 3 dòng, x bằng mấy?",a:A+B-C,w:`y = ${A}+${B} = ${A+B}, rồi x mới = ${A+B} - ${C} = ${A+B-C}.`}},
cond:()=>{const n=rnd(9),k=rnd(9),a=n>k?"A":"B";return{c:`n = ${n}\nif n > ${k}:\n    print("A")\nelse:\n    print("B")`,q:"In ra chữ gì? (A hoặc B)",a,w:`${n} ${n>k?"lớn hơn":"không lớn hơn"} ${k} nên in ${a}.`}},
loop:()=>{const N=rnd(5)+2;return{c:`t = 0\nfor i in range(${N}):\n    t = t + i\nprint(t)`,q:"In ra số mấy?",a:N*(N-1)/2,w:`i chạy từ 0 đến ${N-1}, cộng lại = ${N*(N-1)/2}.`}},
fn:()=>{const A=rnd(5),B=rnd(5),C=rnd(5);return{c:`def f(a, b):\n    return a * b + ${C}\nprint(f(${A}, ${B}))`,q:"In ra số mấy?",a:A*B+C,w:`${A} * ${B} + ${C} = ${A*B+C}.`}},
get:()=>{const a=ar(5,9),i=rnd(5)-1;return{c:`a = ${J(a)}\nprint(a[${i}])`,q:"In ra số mấy?",a:a[i],w:`Hộp chỉ số ${i} chứa ${a[i]}.`}},
set:()=>{const a=ar(4,9),i=rnd(4)-1,K=rnd(5);return{c:`a = ${J(a)}\na[${i}] = a[${i}] + ${K}\nprint(a[${i}])`,q:"In ra số mấy?",a:a[i]+K,w:`${a[i]} + ${K} = ${a[i]+K}.`}},
sum:()=>{const a=ar(4,9),t=a.reduce((x,y)=>x+y);return{c:`a = ${J(a)}\nt = 0\nfor x in a:\n    t = t + x\nprint(t)`,q:"In ra số mấy?",a:t,w:`Cộng tất cả: ${a.join(" + ")} = ${t}.`}},
cnt:()=>{const a=ar(7,3),t=rnd(3),c=a.filter(x=>x==t).length;return{c:`a = ${J(a)}\nc = 0\nfor x in a:\n    if x == ${t}:\n        c = c + 1\nprint(c)`,q:"In ra số mấy?",a:c,w:`Có ${c} hộp chứa ${t}.`}},
dict:()=>{const ks=["a","b","c","d"].sort(()=>Math.random()-.5).slice(0,3),v=ks.map(()=>rnd(9)),i=rnd(3)-1;return{c:`d = {${ks.map((k,n)=>`"${k}": ${v[n]}`).join(", ")}}\nprint(d["${ks[i]}"])`,q:"In ra số mấy?",a:v[i],w:`Khóa "${ks[i]}" ứng với ${v[i]}.`}},
freq:()=>{const s_=Array.from({length:6},()=>"abc"[rnd(3)-1]).join(""),x="abc"[rnd(3)-1],c=[...s_].filter(y=>y==x).length;return{c:`s = "${s_}"\nd = {}\nfor ch in s:\n    d[ch] = d.get(ch, 0) + 1\nprint(d.get("${x}", 0))`,q:"In ra số mấy?",a:c,w:`Chữ "${x}" xuất hiện ${c} lần trong "${s_}".`}},
swap:()=>{const a=ar(4,9);return{c:`a = ${J(a)}\ni = 0\nj = 3\na[i], a[j] = a[j], a[i]\nprint(a[0])`,q:"In ra số mấy?",a:a[3],w:`a[0] và a[3] đổi chỗ, nên a[0] = ${a[3]}.`}},
stk:()=>{let st=[],ops=[],v;for(let n=0;n<6;n++){if(st.length>1&&rnd(2)==1){st.pop();ops.push("pop()")}else{v=rnd(9);st.push(v);ops.push(`push(${v})`)}}const last=st.pop();ops.push("pop()");return{c:ops.join("\n"),q:"Stack ban đầu rỗng. Lệnh pop() cuối cùng trả về số mấy?",a:last,w:"Stack lấy ra phần tử đặt vào SAU CÙNG còn trong chồng."}},
que:()=>{let st=[],ops=[],v;for(let n=0;n<6;n++){if(st.length>1&&rnd(2)==1){st.shift();ops.push("dequeue()")}else{v=rnd(9);st.push(v);ops.push(`enqueue(${v})`)}}const f=st.shift();ops.push("dequeue()");return{c:ops.join("\n"),q:"Queue ban đầu rỗng. Lệnh dequeue() cuối cùng trả về số mấy?",a:f,w:"Queue lấy ra phần tử vào TRƯỚC NHẤT còn trong hàng."}},
bs:()=>{let x=rnd(3);const a=Array.from({length:7},()=>x+=rnd(3)),t=a[rnd(7)-1];let lo=0,hi=6,c=0;while(lo<=hi){const m=(lo+hi)>>1;c++;if(a[m]==t)break;if(a[m]>t)hi=m-1;else lo=m+1}return{c:`a = ${J(a)}  # đã sắp xếp\nt = ${t}`,q:"Tìm t bằng cách chia đôi (luôn xem hộp giữa). Phải xem bao nhiêu hộp?",a:c,w:"Mỗi lần xem hộp giữa (chỉ số (lo+hi)//2), rồi bỏ nửa không chứa t."}},
bub:()=>{const a=ar(5,9),b=[...a];for(let j=0;j<4;j++)if(b[j]>b[j+1])[b[j],b[j+1]]=[b[j+1],b[j]];return{c:`a = ${J(a)}\nfor j in range(4):\n    if a[j] > a[j+1]:\n        a[j], a[j+1] = a[j+1], a[j]\nprint(a[0])`,q:"In ra số mấy? (chạy từng bước, đừng đoán)",a:b[0],w:`Sau 1 lượt: ${J(b)}.`}}};
const NEW={
p1:["Biến là cái hộp có tên",[I(`Python chạy từng dòng từ trên xuống. Dòng đầu tạo hộp tên x và bỏ số 5 vào.${P_("x = 5\ny = x + 2")}y bằng mấy?`,7,"Lấy số trong hộp x rồi cộng 2.","y = 5 + 2 = 7."),I(`${P_("x = 5\nx = 8")}Bây giờ hộp x chứa số mấy?`,8,"Dòng sau đè lên dòng trước.","Gán lại thì giá trị cũ bị thay."),C("Dấu = trong Python nghĩa là gì?",["Hai bên bằng nhau như trong toán","Bỏ giá trị bên phải vào hộp bên trái","So sánh hai số"],1,"Nhớ hộp x và số 5: số được bỏ vào hộp.","= là phép gán.")],"asg"],
p2:["Điều kiện if / else",[C(`${P_('if 7 > 5:\n    print("A")\nelse:\n    print("B")')}In ra chữ nào?`,["A","B","Cả hai"],0,"7 có lớn hơn 5 không? Đúng thì chạy phần if.","7 > 5 đúng nên in A."),C(`${P_('if 3 > 5:\n    print("A")\nelse:\n    print("B")')}In ra chữ nào?`,["A","B","Cả hai"],1,"3 có lớn hơn 5 không?","Sai nên chạy else: in B."),C("Dòng thụt vào 4 dấu cách thuộc về đâu?",["Thuộc if ngay phía trên","Luôn luôn chạy","Bị bỏ qua"],0,"Python dùng thụt dòng để biết dòng nào nằm trong if.","Thụt dòng cho biết nó nằm trong khối if.")],"cond"],
p3:["Vòng lặp for",[I(`${P_("for i in range(3):\n    print(i)")}Có bao nhiêu dòng được in ra?`,3,"range(3) cho ra 3 số: 0, 1, 2.","Lặp 3 lần."),I("Dòng cuối cùng in ra số mấy?",2,"Các số là 0, 1, 2. Số nào là cuối?","range(3) là 0, 1, 2 (không có 3)."),I(`${P_("t = 0\nfor i in range(4):\n    t = t + i")}Cuối cùng t bằng mấy?`,6,"i là 0, 1, 2, 3. Cộng dần.","0 + 1 + 2 + 3 = 6.")],"loop"],
p4:["Hàm và return",[I(`${P_("def gap_doi(x):\n    return x * 2\nprint(gap_doi(4))")}In ra số mấy?`,8,"x nhận giá trị 4.","4 * 2 = 8."),C("return làm gì?",["Trả kết quả ra và dừng hàm","In ra màn hình","Lặp lại hàm"],0,"Hàm là cái máy: bỏ vào, nhận ra.","return đưa kết quả ra ngoài."),I(`${P_("def f(a, b):\n    return a - b\nprint(f(9, 4))")}In ra số mấy?`,5,"a = 9, b = 4.","9 - 4 = 5.")],"fn"],
a2:["Đọc một hộp: a[i]",[I(`${P_("a = [4, 8, 1]\nprint(a[1])")}In ra số mấy?`,8,"Chỉ số 1 là hộp thứ mấy, đếm từ 0?","a[1] chứa 8."),I(`${P_("a = [4, 8, 1]\nprint(a[len(a) - 1])")}In ra số mấy?`,1,"len(a) là 3. Vậy len(a) - 1 là bao nhiêu?","a[2] = 1: hộp cuối."),C("a[5] khi a chỉ có 3 hộp thì sao?",["Báo lỗi IndexError","Trả về 0","Trả về hộp cuối"],0,"Hộp số 5 không tồn tại.","Hộp không có thì Python báo IndexError.")],"get"],
a3:["Ghi đè một hộp: a[i] = x",[I(`${P_("a = [4, 8, 1]\na[0] = 9\nprint(a[0])")}In ra số mấy?`,9,"a[0] = 9 là bỏ 9 vào hộp 0.","Ghi đè hộp 0 thành 9."),I(`${P_("a = [4, 8, 1]\na[1] = a[1] + 5\nprint(a[1])")}In ra số mấy?`,13,"Lấy số trong hộp 1, cộng 5, bỏ lại.","8 + 5 = 13."),C("Sau a[0] = 9, các hộp còn lại có đổi không?",["Có, tất cả đổi","Không, chỉ hộp 0 đổi"],1,"Chỉ hộp có chỉ số 0 bị ghi đè.","Chỉ hộp 0 đổi.")],"set"],
sm:["Cộng dồn: tính tổng mảng",[I(`${P_("a = [2, 5, 3]\nt = 0\nfor x in a:\n    t = t + x\nprint(t)")}In ra số mấy?`,10,"Cộng lần lượt 2, rồi 5, rồi 3.","2 + 5 + 3 = 10."),I("t bằng mấy sau khi đã xét xong hai hộp đầu (2 và 5)?",7,"t đang cộng dồn.","2 + 5 = 7."),C("Vì sao t bắt đầu bằng 0?",["0 không làm đổi tổng","Cho đẹp","Bắt buộc"],0,"Cộng thêm 0 thì tổng có đổi không?","0 là số 'không có gì', an toàn để bắt đầu.")],"sum"],
cn:["Đếm số lần xuất hiện",[I(`${P_("a = [2, 5, 2, 2]\nc = 0\nfor x in a:\n    if x == 2:\n        c = c + 1\nprint(c)")}In ra số mấy?`,3,"Đếm xem có bao nhiêu hộp chứa 2.","Có 3 hộp chứa 2."),C("Mỗi lần gặp số cần đếm, ta làm gì với c?",["Cộng thêm 1","Đặt c về 0","Trừ 1"],0,"c là số lần đã gặp.","Gặp thêm một lần thì c tăng 1."),C("Vì sao c bắt đầu bằng 0?",["Chưa gặp lần nào","Cho đẹp","Bắt buộc"],0,"Trước khi mở hộp nào, đã đếm được mấy lần?","Lúc đầu chưa gặp lần nào.")],"cnt"],
d1:["Dictionary: tra từ điển",[I(`${P_('d = {"a": 3, "b": 5}\nprint(d["b"])')}In ra số mấy?`,5,"Tra khóa \"b\" xem ứng với số nào.","Khóa b ứng với 5."),I(`${P_('d = {"a": 3}\nd["c"] = 7\nprint(d["c"])')}In ra số mấy?`,7,"d[\"c\"] = 7 là thêm một mục mới.","Thêm khóa c với giá trị 7."),C('d["z"] khi chưa có khóa z thì sao?',["Báo lỗi KeyError","Trả về 0","Trả về None"],0,"Từ điển không có từ đó thì tra không ra.","Khóa không có thì báo KeyError.")],"dict"],
d2:["Đếm tần suất bằng dict",[I(`${P_('d = {}\nprint(d.get("a", 0))')}In ra số mấy?`,0,"get(khóa, 0): không có khóa thì trả 0.","Chưa có a nên trả 0."),C("Muốn đếm số lần mỗi chữ xuất hiện, dict cần nhớ gì?",["Chữ là khóa, số lần là giá trị","Chữ là giá trị, vị trí là khóa","Chỉ cần độ dài"],0,"Tra theo chữ thì ra số lần.","Khóa là chữ, giá trị là số lần."),I(`${P_('s = "abca"\nd = {}\nfor ch in s:\n    d[ch] = d.get(ch, 0) + 1\nprint(d["a"])')}In ra số mấy?`,2,"Chữ a xuất hiện mấy lần trong abca?","a xuất hiện 2 lần.")],"freq"],
tp:["Hai con trỏ: trái và phải",[I("Mảng có 5 hộp. i = 0 (đầu), j = len(a) - 1 (cuối). j bằng mấy?",4,"len(a) là 5.","j = 5 - 1 = 4."),I(`${P_("a = [1, 2, 3, 4]\ni = 0\nj = 3\na[i], a[j] = a[j], a[i]\nprint(a[0])")}In ra số mấy?`,4,"Hai hộp đổi chỗ cho nhau.","a[0] và a[3] đổi chỗ nên a[0] = 4."),C("Đổi chỗ xong, hai con trỏ nên làm gì để xét cặp tiếp theo?",["i tăng 1, j giảm 1","i giảm 1, j tăng 1","Giữ nguyên"],0,"Hai con trỏ tiến vào giữa.","Hai đầu tiến dần vào giữa.")],"swap"],
stk:["Stack: vào sau, ra trước",[C("Chồng đĩa: đĩa nào được lấy ra trước?",["Đĩa đặt vào sau cùng","Đĩa đặt vào đầu tiên"],0,"Bạn lấy đĩa ở trên cùng.","Stack lấy phần tử đặt vào sau cùng."),I(`${P_("push(3)\npush(5)\npush(8)\npop()")}pop() trả về số mấy?`,8,"Số nào được đặt vào sau cùng?","8 vào sau cùng nên ra trước."),I(`${P_("push(3)\npush(5)\npush(8)\npop()\npop()")}pop() lần thứ hai trả về số mấy?`,5,"Sau lần pop đầu, trên cùng là số nào?","Sau khi lấy 8, trên cùng là 5.")],"stk"],
que:["Queue: vào trước, ra trước",[C("Xếp hàng mua vé: ai được phục vụ trước?",["Người đến trước","Người đến sau cùng"],0,"Người đứng đầu hàng.","Queue lấy phần tử vào trước."),I(`${P_("enqueue(3)\nenqueue(5)\nenqueue(8)\ndequeue()")}dequeue() trả về số mấy?`,3,"Ai đứng đầu hàng?","3 vào đầu tiên nên ra đầu tiên."),I(`${P_("enqueue(3)\nenqueue(5)\nenqueue(8)\ndequeue()\ndequeue()")}dequeue() lần thứ hai trả về?`,5,"Sau khi 3 đi, ai đứng đầu?","Tiếp theo là 5.")],"que"],
bs:["Chia đôi (tìm nhị phân)",[I("Mảng đã sắp xếp có 7 hộp, chỉ số 0 đến 6. Hộp giữa có chỉ số (0 + 6) // 2 bằng mấy?",3,"(0 + 6) chia 2.","Hộp giữa là chỉ số 3."),C("a = [1,3,5,7,9,11,13], tìm 11. Hộp giữa chứa 7. Bỏ nửa nào?",["Bỏ nửa trái (vì 11 > 7, mảng tăng dần)","Bỏ nửa phải"],0,"Mảng tăng dần: số lớn hơn 7 nằm bên nào?","11 lớn hơn 7 nên chỉ có thể ở nửa phải."),C("Mỗi lần chia đôi, số hộp còn lại thế nào?",["Giảm một nửa","Giảm 1","Không đổi"],0,"Bỏ cả một nửa chỉ bằng một lần xem.","Mỗi lần bỏ đi một nửa.")],"bs"],
bub:["Sắp xếp nổi bọt: một lượt",[C("Nổi bọt so sánh hai hộp cạnh nhau. Nếu bên trái lớn hơn bên phải thì làm gì?",["Đổi chỗ","Giữ nguyên"],0,"Ta muốn số lớn đi về cuối.","Trái lớn hơn phải thì đổi chỗ."),I(`${P_("a = [3, 1, 2]\nif a[0] > a[1]:\n    a[0], a[1] = a[1], a[0]\nprint(a[0])")}In ra số mấy?`,1,"3 có lớn hơn 1 không? Nếu có thì đổi chỗ.","Đổi chỗ nên a[0] = 1."),C("Sau một lượt đi hết mảng, số lớn nhất ở đâu?",["Ở cuối mảng","Ở đầu mảng","Không biết"],0,"Số lớn cứ bị đẩy sang phải.","Số lớn nhất được đẩy về cuối.")],"bub"]};
Object.entries(NEW).forEach(([id,[t,steps,dr]])=>{LES[id]={t,steps,dr}});
LES.l1.dr="idx";LES.l2.dr="lin";LES.l3.dr="max";
mk("w4","Code 4: two_sum (tìm cặp có tổng bằng target)","two_sum","nums, target","Viết hàm two_sum(nums, target) trả về [i, j] là chỉ số của hai số có tổng bằng target (i nhỏ hơn j). Nếu không có cặp nào thì báo ValueError.",
[["Đề cho nums=[2,7,11] và target=9. Cặp nào đúng?",["2 và 7 (chỉ số 0 và 1)","7 và 11","2 và 11"],0,"2+7 bằng bao nhiêu?"],
["Cách vét cạn (hai vòng lặp lồng nhau) với 1000 số mất khoảng bao nhiêu bước?",["Khoảng 1000","Khoảng 1.000.000","Khoảng 10"],1,"Mỗi số so với gần hết 1000 số còn lại."],
["Đang xét số x. Cần tìm số y nào đã gặp?",["y = target - x","y = target + x","y = x"],0,"x + y phải bằng target."],
TF],
`def two_sum(nums, target):
    if not isinstance(nums, list):
        raise TypeError("nums phai la list")
    seen = {}
    for i, x in enumerate(nums):
        y = target - x
        if y in seen:
            return [seen[y], i]
        seen[x] = i
    raise ValueError("khong co cap")
`,[["two_sum([2,7,11,15],9)","[0, 1]"],["two_sum([3,2,4],6)","[1, 2]"],["two_sum([3,3],6)","[0, 1]"],["two_sum([-1,5,8],7)","[0, 2]"]],[["two_sum([1,2],10)","ValueError"],["two_sum(None,3)","TypeError"]]);
scaf("w4",1,"Nhiều (mình hỏi và điền chỗ trống cùng bạn)",[["Tạo bảng tra rỗng để nhớ các số đã gặp","Cần nhớ gì về những số đã đi qua?"],["Duyệt từng số cùng chỉ số của nó","Muốn biết chỉ số thì duyệt kiểu gì?"],["Tính số cần tìm y = target - x","Với x hiện tại, số kia phải bằng bao nhiêu?"],["Nếu y đã có trong bảng thì trả về [chỉ số của y, i]","Tra bảng: đã gặp y chưa?"],["Chưa có thì lưu x vào bảng","Nếu chưa gặp thì làm gì để lần sau còn tra?"],["Hết vòng lặp mà không thấy thì báo ValueError","Duyệt hết mà không có cặp, kết quả là gì?"]],
"# Mình viết sẵn khung. Bạn điền các chỗ ___ bằng kết quả mong đợi, rồi chạy.\n"+HP+"assert two_sum([2,7,11,15], 9) == ___   # 2 + 7 = 9, chỉ số nào?\nassert two_sum([3,3], 6) == ___          # hai số giống nhau\nassert raises(ValueError, two_sum, [1,2], 10)  # không có cặp\n",
"def two_sum(nums, target):\n    # 1) bảng tra rỗng (dictionary) viết là ___ ?\n    seen = ___\n    for i, x in enumerate(nums):\n        # 2) số cần tìm\n        y = target - ___\n        # 3) y đã có trong bảng chưa? dùng từ khóa ___\n        if y ___ seen:\n            return [seen[y], ___]\n        # 4) lưu x với chỉ số hiện tại\n        seen[x] = ___\n    raise ValueError(\"khong co cap\")\n",
"Đọc comment từng dòng và điền ___. Nhớ bài đếm bằng bảng tra.",
"def two_sum(nums, target):\n    seen = ___\n    for i, x in enumerate(nums):\n        y = target - ___\n        if y ___ seen:\n            return [seen[y], ___]\n        seen[x] = ___\n    raise ValueError(\"khong co cap\")",
["Tra một key trong dictionary mất khoảng bao nhiêu bước?",["O(1)","O(n)","O(n^2)"],0,"Dictionary nhảy thẳng tới chỗ chứa key."]);
["w5","w6"].forEach((id,k)=>{const o=LES.w4;mk(id,["Code 5: two_sum (mức vừa)","Code 6: two_sum (tự làm)"][k],"two_sum","nums, target",o.brief.split("<br>")[0],
[["Với [3,2,4] và target=6, đáp án đúng là gì?",["[1, 2] (2 + 4)","[0, 0] (3 + 3)","[0, 2]"],0,"Không dùng cùng một phần tử hai lần. 3 + 3 cần hai số 3 khác chỗ."],
["Bảng tra nên có key là gì và value là gì?",["key là số đã gặp, value là chỉ số của nó","key là chỉ số, value là số","key là target"],0,"Ta cần tra 'số y đã gặp chưa' rồi lấy ra chỉ số."],TF],
o.ref,o.hid,o.errs)});
scaf("w5",2,"Vừa (có khung comment, tự điền code)",[["Tạo bảng tra rỗng","Cần nhớ gì về số đã đi qua?"],["Duyệt từng số cùng chỉ số","Muốn có cả chỉ số lẫn giá trị thì dùng gì?"],["Tính số cần tìm y = target - x","Số còn lại phải bằng bao nhiêu?"],["Nếu y đã có trong bảng thì trả về cặp chỉ số","Tra bảng: đã gặp y chưa?"],["Chưa có thì lưu x và chỉ số","Lưu gì để lần sau còn tra?"],["Hết vòng mà không thấy thì báo lỗi","Duyệt hết mà không có cặp thì sao?"]],
"# Mình cho sẵn 1 test mẫu. Bạn viết thêm ít nhất 2 test nữa.\n"+HP+"assert two_sum([2,7,11,15], 9) == [0, 1]   # ví dụ có sẵn\n# ca hai số giống nhau: ?\n# ca không có cặp: ?\n# ca số âm: ?\n",
"def two_sum(nums, target):\n    # việc 1: tạo bảng tra rỗng\n    # việc 2: duyệt từng (chỉ số, số)\n    # việc 3: y = số cần tìm; nếu y đã trong bảng thì trả về [chỉ số của y, chỉ số hiện tại]\n    # việc 4: chưa có thì lưu số hiện tại với chỉ số của nó\n    # việc 5: hết vòng thì raise ValueError\n    pass\n",
"Nhìn lại bài 4: bạn đã điền khung này rồi. Lần này tự gõ các dòng.","def two_sum(nums, target):\n    seen = ___\n    for i, x in enumerate(nums):\n        y = ___\n        if y in seen:\n            return ___\n        seen[x] = ___\n    raise ValueError(\"khong co cap\")",
["Cách vét cạn hai vòng lặp có độ phức tạp?",["O(n)","O(n^2)","O(1)"],1,"Mỗi số so với gần hết các số còn lại."]);
scaf("w6",3,"Ít (tự làm, mình chỉ hỗ trợ khi bạn bấm Cần giúp)",[["Tạo bảng tra rỗng","Cần nhớ gì?"],["Với mỗi số, tính số cần tìm","Số còn lại bằng bao nhiêu?"],["Đã gặp số cần tìm thì trả về hai chỉ số","Tra bảng thế nào?"],["Chưa gặp thì lưu số hiện tại","Lưu gì để dùng sau?"],["Không có cặp thì báo ValueError","Duyệt hết rồi thì sao?"]],
"# Lần này test do bạn tự viết. Cần giúp thì bấm nút.\n"+HP,
"def two_sum(nums, target):\n    pass\n",
"Nhớ: key là số đã gặp, value là chỉ số.","def two_sum(nums, target):\n    seen = {}\n    for i, x in enumerate(nums):\n        if target - x in ___:\n            return [seen[target - x], ___]\n        seen[x] = ___\n    raise ValueError(\"khong co cap\")",
["Tra một key trong dictionary trung bình mất bao nhiêu bước?",["O(1)","O(n)","O(log n)"],0,"Dictionary không mở từng hộp."]);
mk("w7","Code 7: has_duplicate (biến thể: cùng ý tưởng, đề khác)","has_duplicate","nums","Viết hàm has_duplicate(nums) trả về True nếu trong danh sách có số xuất hiện từ hai lần trở lên, ngược lại False.",
[["Danh sách rỗng có số trùng không?",["Không, trả về False","Có, trả về True","Báo lỗi"],0,"Chưa có số nào thì chưa thể có số trùng."],
["Đây giống Two Sum ở ý tưởng nào?",["Nhớ các số đã gặp để tra nhanh","Sắp xếp danh sách","Dùng đệ quy"],0,"Ở Two Sum ta tra 'đã gặp y chưa'. Ở đây tra 'đã gặp x chưa'."],
["Nên dùng cấu trúc nào để nhớ số đã gặp?",["set (tập hợp, tra O(1))","list (tra O(n))","chuỗi"],0,"Chỉ cần biết có hay chưa, không cần chỉ số."],TF],
`def has_duplicate(nums):
    if not isinstance(nums, list):
        raise TypeError("nums phai la list")
    seen = set()
    for x in nums:
        if x in seen:
            return True
        seen.add(x)
    return False
`,[["has_duplicate([1,2,3])","False"],["has_duplicate([1,2,1])","True"],["has_duplicate([])","False"],["has_duplicate([5,5])","True"]],[["has_duplicate(None)","TypeError"]]);
scaf("w7",3,"Ít (tự làm, mình chỉ hỗ trợ khi bạn bấm Cần giúp)",[["Tạo tập hợp rỗng để nhớ số đã gặp","Cần nhớ gì?"],["Với mỗi số, nếu đã có trong tập hợp thì trả về True","Gặp lại số đã thấy nghĩa là gì?"],["Chưa có thì thêm vào tập hợp","Làm sao để lần sau còn tra?"],["Duyệt hết mà không trùng thì trả về False","Không gặp số nào lặp lại thì sao?"]],
"# Lần này test do bạn tự viết. Cần giúp thì bấm nút.\n"+HP,
"def has_duplicate(nums):\n    pass\n",
"Giống Two Sum, nhưng chỉ cần set.","def has_duplicate(nums):\n    seen = ___()\n    for x in nums:\n        if x in seen:\n            return ___\n        seen.add(x)\n    return ___",
["Vét cạn hai vòng lặp tìm số trùng mất?",["O(n)","O(n^2)","O(1)"],1,"Mỗi số so với các số còn lại."]);
Object.assign(NEW,{
r1:["Đệ quy: bài nhỏ hơn giống hệt bài lớn",[I(`${P_('def dem(n):\n    if n == 0:\n        return 0\n    return n + dem(n - 1)')}dem(0) trả về mấy?`,0,"Nhìn dòng if đầu tiên.","n bằng 0 thì trả 0, không gọi tiếp."),I("dem(1) = 1 + dem(0). Vậy dem(1) bằng mấy?",1,"Thay dem(0) bằng kết quả bạn vừa tìm.","1 + 0 = 1."),I("dem(2) = 2 + dem(1). Vậy dem(2) bằng mấy?",3,"Dùng kết quả dem(1).","2 + 1 = 3."),I("dem(3) = 3 + dem(2). Vậy dem(3) bằng mấy?",6,"Dùng kết quả dem(2).","3 + 3 = 6. Bài lớn được giải nhờ bài nhỏ hơn giống hệt."),C("Câu nào mô tả đệ quy đúng nhất?",["Hàm tự gọi chính nó với bài toán nhỏ hơn","Hàm lặp bằng for","Hàm gọi hàm khác bất kỳ"],0,"Nhìn lại dem(n) gọi dem(n - 1).","Đệ quy: tự gọi mình với bài nhỏ hơn.")],"rec"],
r2:["Ca cơ sở và thứ tự in ra",[C("Nếu xóa dòng if n == 0 trong dem, chuyện gì xảy ra?",["Gọi mãi không dừng, Python báo RecursionError","Trả về 0","Chạy bình thường"],0,"Không có điểm dừng thì ai ngăn việc gọi tiếp?","Thiếu ca cơ sở là lỗi đệ quy phổ biến nhất."),I(`${P_('def dd(n):\n    if n == 0:\n        print("xong")\n        return\n    print(n)\n    dd(n - 1)')}Gọi dd(3). Dòng thứ 3 in ra số mấy?`,1,"In lần lượt: 3, 2, ...","In ra 3, 2, 1, xong. Dòng 3 là 1."),I(`${P_('def e(n):\n    if n == 0:\n        return\n    e(n - 1)\n    print(n)')}Gọi e(3). Dòng đầu tiên in ra số mấy?`,1,"print nằm SAU lời gọi e(n - 1): phải chạy xuống tận đáy trước.","In ra 1, 2, 3. print sau lời gọi thì in lúc quay về."),C("Hai hàm dd và e khác nhau ở đâu?",["Chỗ đặt print: trước hay sau lời gọi đệ quy","Tên hàm","Không khác gì"],0,"So sánh vị trí dòng print.","Print trước: in lúc đi xuống. Print sau: in lúc đi lên.")],"rec"],
r3:["Mỗi lần gọi là một tầng",[I("dem(3) gọi dem(2), gọi dem(1), gọi dem(0). Tổng cộng có bao nhiêu lần gọi hàm (kể cả dem(3))?",4,"Đếm: dem(3), dem(2), dem(1), dem(0).","4 lần gọi, mỗi lần chiếm một tầng bộ nhớ."),I("Gọi dem(1000) thì cần khoảng bao nhiêu tầng cùng lúc?",1001,"n + 1 tầng: từ n xuống 0.","n + 1 tầng. Tốn bộ nhớ O(n)."),C("Python mặc định giới hạn độ sâu đệ quy khoảng bao nhiêu?",["Khoảng 1000","Vô hạn","Khoảng 10"],0,"Gọi dem(100000) bạn nghĩ sẽ ra sao?","Giới hạn mặc định khoảng 1000, vượt thì RecursionError."),C("Tính tổng 1..n, cách nào tiết kiệm bộ nhớ hơn?",["Vòng for với một biến tổng","Đệ quy","Như nhau"],0,"Vòng for có cần nhớ nhiều tầng không?","Vòng lặp O(1) bộ nhớ. Đệ quy hữu ích khi bài toán tự chia nhỏ (cây, tổ hợp).")],"rec"]});
Object.entries({r1:NEW.r1,r2:NEW.r2,r3:NEW.r3}).forEach(([id,[t,steps,dr]])=>{LES[id]={t,steps}});
mk("w8","Code 8: factorial (đệ quy)","factorial","n","Viết hàm đệ quy factorial(n) trả về n! = n * (n-1) * ... * 1. Quy ước 0! = 1. n âm thì báo ValueError, n không phải số nguyên thì báo TypeError.",
[["factorial(4) bằng bài nhỏ hơn nào?",["4 * factorial(3)","4 + factorial(3)","factorial(5)"],0,"4! = 4 * 3 * 2 * 1."],
["Ca cơ sở (điểm dừng) hợp lý nhất?",["n bằng 0 hoặc 1 thì trả về 1","n bằng 10 thì dừng","Không cần điểm dừng"],0,"Nhớ bài dem: phải có chỗ không gọi tiếp."],
["Điều gì xảy ra nếu gọi factorial(-1) mà không kiểm tra?",["Gọi mãi, RecursionError","Trả về 1","Trả về 0"],0,"-1 không bao giờ chạm tới 0 hay 1 khi giảm."],TF],
`def factorial(n):
    if not isinstance(n, int):
        raise TypeError("n phai la so nguyen")
    if n < 0:
        raise ValueError("n khong am")
    if n <= 1:
        return 1
    return n * factorial(n - 1)
`,[["factorial(0)","1"],["factorial(1)","1"],["factorial(3)","6"],["factorial(5)","120"]],[["factorial(-1)","ValueError"],["factorial('a')","TypeError"]]);
scaf("w8",1,"Nhiều (mình hỏi và điền chỗ trống cùng bạn)",[["Kiểm tra n âm thì báo ValueError","n âm thì có giai thừa không?"],["Ca cơ sở: n nhỏ hơn hoặc bằng 1 thì trả về 1","Khi nào thì không cần gọi tiếp?"],["Còn lại: trả về n nhân factorial(n - 1)","Bài nhỏ hơn là bài nào?"]],
"# Mình viết sẵn khung. Bạn điền các chỗ ___ bằng kết quả mong đợi, rồi chạy.\n"+HP+"assert factorial(0) == ___   # quy ước\nassert factorial(3) == ___   # 3 * 2 * 1\nassert factorial(5) == ___   # 5 * 4 * 3 * 2 * 1\nassert raises(ValueError, factorial, -1)\n",
"def factorial(n):\n    if not isinstance(n, int):\n        raise TypeError(\"n phai la so nguyen\")\n    if n < 0:\n        raise ValueError(\"n khong am\")\n    # ca cơ sở: n nhỏ hơn hoặc bằng ___ thì trả về ___\n    if n <= ___:\n        return ___\n    # bài nhỏ hơn: factorial của n trừ ___\n    return n * factorial(n - ___)\n",
"Nhớ bài dem: điểm dừng trước, rồi mới gọi bài nhỏ hơn.","def factorial(n):\n    if n < 0:\n        raise ValueError(\"n khong am\")\n    if n <= ___:\n        return ___\n    return n * factorial(n - ___)",
["Thiếu ca cơ sở trong hàm đệ quy thì gặp lỗi gì?",["RecursionError","SyntaxError","KeyError"],0,"Gọi mãi không dừng."]);
LES.w8.steps.filter(x=>x.k=="code")[0].hp=["Hàm có thể nhận chữ hoặc số âm. Hai dòng đầu của hàm nên làm gì?","Mẫu:\nif not isinstance(n, int):\n    raise TypeError(\"n phai la so nguyen\")\nif n < 0:\n    raise ValueError(\"n khong am\")","Lời giải tham khảo:\n"+LES.w8.ref];
const RF=q=>({k:"reflect",ph:"Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",q,s:"Đã tự giải thích"});
const NUT='class Nut:\n    def __init__(self, v):\n        self.v = v\n        self.next = None\n';
const CAY='class Cay:\n    def __init__(self, v):\n        self.v = v\n        self.left = None\n        self.right = None\n';
Object.assign(NEW,{
n1:["Linked list: mỗi nút biết nút kế tiếp",[I(`${P_(NUT+'a = Nut(5)\nb = Nut(8)\nc = Nut(2)\na.next = b\nb.next = c\nprint(a.v)')}In ra số mấy?`,5,"a.v là giá trị nằm trong nút a.","a.v = 5."),I("Nếu in a.next.v thì ra số mấy?",8,"a.next là nút nào? Rồi lấy .v của nút đó.","a.next chính là b nên a.next.v = 8."),I("Nếu in a.next.next.v thì ra số mấy?",2,"Đi theo mũi tên hai lần: a, rồi b, rồi ...","a.next.next là c nên giá trị là 2."),C("c.next đang là gì (mình chưa gán gì cho nó)?",["None, nghĩa là hết danh sách","8","5"],0,"Trong __init__, next được gán lúc đầu là gì?","None đánh dấu nút cuối, không còn nút nào phía sau."),C("Khác mảng ở chỗ nào?",["Muốn tới nút thứ 3 phải đi từng nút từ đầu, không nhảy thẳng bằng chỉ số","Linked list luôn nhanh hơn mảng","Linked list không chứa được số"],0,"Mảng có nums[2]. Ở đây có cách nhảy thẳng tới c không?","Mỗi nút chỉ biết nút kế tiếp. Đổi lại, chèn và xóa rất gọn."),RF("Không nhìn lại bài: nút trong linked list gồm những gì, và 'next' dùng để làm gì?")]],
n2:["Đi dọc danh sách: theo mũi tên",[I(`${P_(NUT+'a = Nut(5); b = Nut(8); c = Nut(2)\na.next = b; b.next = c\ncur = a\nwhile cur is not None:\n    print(cur.v)\n    cur = cur.next')}Có bao nhiêu dòng được in?`,3,"Mỗi vòng cur đứng ở một nút. Có mấy nút?","3 nút, 3 dòng."),I("Dòng cuối in ra số mấy?",2,"Nút cuối cùng là nút nào?","Nút c, giá trị 2."),C("Nếu quên dòng cur = cur.next thì sao?",["Vòng lặp không bao giờ dừng, in mãi số 5","In 5, 8, 2 bình thường","Báo lỗi ngay"],0,"cur có đổi sang nút khác không?","cur đứng yên nên điều kiện không bao giờ sai."),C("Vì sao điều kiện là cur is not None?",["Vì sau nút cuối, cur trở thành None nghĩa là đã đi hết","Vì None là số 0","Vì cho đẹp"],0,"Nhớ c.next là gì.","None là dấu hiệu hết danh sách."),I("Danh sách có 1000 nút, đi hết cần bao nhiêu bước nhảy sang nút kế?",1000,"Mỗi nút một bước.","n nút thì n bước, O(n). Giống duyệt mảng."),RF("Giải thích bằng lời: vì sao vòng while này tự dừng được mà không cần biết trước danh sách dài bao nhiêu?")]],
n3:["Chèn vào đầu: đổi mũi tên đúng thứ tự",[I(`${P_(NUT+'a = Nut(5); b = Nut(8)\na.next = b\nhead = a\nnew = Nut(9)\nnew.next = head\nhead = new\nprint(head.next.v)')}In ra số mấy?`,5,"Sau khi chèn, nút đứng đầu là new. Nút ngay sau nó là gì?","new.next trỏ tới nút cũ a, giá trị 5."),C("Nếu đổi thứ tự: chạy head = new TRƯỚC, rồi mới new.next = head. Chuyện gì xảy ra?",["new.next trỏ lại chính new, và mất đường tới nút cũ","Vẫn đúng như cũ","Báo lỗi cú pháp"],0,"Sau head = new, head còn trỏ tới nút cũ không?","Phải nối new vào danh sách cũ TRƯỚC khi đổi head, nếu không sẽ mất nút cũ."),C("Chèn vào đầu danh sách 1 triệu nút mất mấy bước đổi mũi tên?",["Hai bước, không phụ thuộc độ dài","Một triệu bước","Nửa triệu bước"],0,"Ta có phải đi qua các nút phía sau không?","Chèn đầu là O(1)."),C("Với mảng, chèn vào đầu phải làm gì?",["Dịch tất cả phần tử sang phải một ô","Không cần làm gì","Xóa mảng"],0,"Ô đầu đang có số rồi, cần chỗ trống ở đâu?","Mảng: O(n). Linked list: O(1). Đó là lý do có linked list."),RF("Tự giải thích: vì sao thứ tự hai dòng 'new.next = head' và 'head = new' lại quan trọng? Thử hình dung bằng mũi tên.")]],
t1:["Cây: nút cha và nút con",[I(`${P_(CAY+'r = Cay(1)\nr.left = Cay(2)\nr.right = Cay(3)\nr.left.left = Cay(4)\nprint(r.left.v)')}In ra số mấy?`,2,"r.left là nút con bên trái của r.","r.left.v = 2."),I("In r.right.v thì ra số mấy?",3,"Nút con bên phải.","3."),I("In r.left.left.v thì ra số mấy?",4,"Đi sang trái hai lần.","4."),I("Cây này có tổng cộng bao nhiêu nút?",4,"Đếm: 1, 2, 3, 4.","4 nút."),C("Nút 3 không có con. r.right.left là gì?",["None","3","0"],0,"Nút 3 chưa được gán left.","Không có con thì là None. Nút như vậy gọi là lá."),RF("Giải thích bằng lời: cây khác linked list ở điểm nào? (Gợi ý: mỗi nút có mấy mũi tên đi ra?)")]],
t2:["Duyệt cây bằng đệ quy",[I(`${P_(CAY+'def dem(nut):\n    if nut is None:\n        return 0\n    return 1 + dem(nut.left) + dem(nut.right)\nr = Cay(1)\nr.left = Cay(2)\nr.right = Cay(3)\nr.left.left = Cay(4)\nprint(dem(None))')}dem(None) trả về mấy?`,0,"Nhìn dòng if đầu tiên.","Ca cơ sở: cây rỗng có 0 nút."),I("dem(r.left.left) là nút 4, nó không có con. Trả về mấy?",1,"1 + dem(None) + dem(None) = 1 + 0 + 0.","Nút lá đếm là 1."),I("dem(r.left) là nút 2 với con trái là nút 4. Trả về mấy?",2,"1 + dem(nút 4) + dem(None).","1 + 1 + 0 = 2."),I("dem(r) trả về mấy?",4,"1 + dem(nút 2) + dem(nút 3).","1 + 2 + 1 = 4."),I(`${P_('def p(nut):\n    if nut is None:\n        return\n    print(nut.v)\n    p(nut.left)\n    p(nut.right)')}Gọi p(r) trên cây vừa rồi. Dòng thứ 3 in ra số mấy? (thứ tự: 1, 2, ...)`,4,"In nút hiện tại, rồi đi hết bên trái, rồi mới sang phải.","In ra 1, 2, 4, 3."),RF("Nối với bài đệ quy trước: 'bài nhỏ hơn giống hệt bài lớn' ở cây là gì? Ca cơ sở ở đây là gì?")]]});
Object.entries({n1:NEW.n1,n2:NEW.n2,n3:NEW.n3,t1:NEW.t1,t2:NEW.t2}).forEach(([id,[t,steps]])=>{LES[id]={t,steps}});
const BAN='ban = {"An": ["Binh", "Chi"], "Binh": ["An", "Dung"], "Chi": ["An"], "Dung": ["Binh"]}\n';
Object.assign(NEW,{
g1:["Đồ thị: nút và đường nối",[C(`${P_(BAN+'print(ban["Chi"])')}In ra gì?`,['["An"]','["Binh", "Dung"]','"Chi"'],0,"ban[\"Chi\"] là danh sách bạn của Chi.","Chi chỉ chơi với An."),I(`${P_(BAN+'print(len(ban["An"]))')}In ra mấy?`,2,"An có bao nhiêu bạn trong danh sách?","An có hai bạn: Binh và Chi."),I("Dung là bạn của mấy người?",1,"Tìm tên Dung trong tất cả các danh sách.","Chỉ Binh."),C("Binh có An trong danh sách và An cũng có Binh. Vì sao?",["Quan hệ bạn bè hai chiều, nên ghi cả hai phía","Ghi nhầm","Vì Binh đứng trước An"],0,"Nếu An là bạn của Binh thì Binh có là bạn của An không?","Đây là đồ thị vô hướng: mỗi đường nối ghi hai lần."),I("Có bao nhiêu đường nối (mỗi đường chỉ đếm một lần)? Đó là An-Binh, An-Chi, ...",3,"Liệt kê từng cặp, đừng đếm trùng chiều ngược lại.","An-Binh, An-Chi, Binh-Dung: 3 đường."),RF("Tự giải thích: đồ thị khác cây ở điểm nào? (Gợi ý: một nút có thể nối với bao nhiêu nút? Có đường vòng quay lại không?)")]],
g2:["BFS: đi từ gần tới xa bằng hàng đợi",[I(`${P_(BAN+'q = ["An"]\nseen = {"An"}\nwhile q:\n    x = q.pop(0)\n    print(x)\n    for y in ban[x]:\n        if y not in seen:\n            seen.add(y)\n            q.append(y)')}Có bao nhiêu dòng được in?`,4,"Mỗi người được lấy ra khỏi hàng đợi đúng một lần. Có mấy người?","4 người, 4 dòng."),C("Dòng thứ 2 in ra tên ai?",["Binh","Dung","Chi"],0,"Sau An, hàng đợi có Binh, rồi Chi (theo thứ tự trong danh sách của An).","Hàng đợi: vào trước ra trước. Binh vào trước Chi."),C("Dòng cuối cùng in ra tên ai?",["Dung","Chi","Binh"],0,"Dung chỉ được thêm vào hàng đợi khi Binh được xét.","Thứ tự: An, Binh, Chi, Dung."),C("Vì sao cần tập seen?",["Để không xét lại một người nhiều lần, tránh lặp vô hạn","Cho đẹp","Để đếm số người"],0,"An là bạn của Binh, Binh là bạn của An. Không có seen thì sao?","Đồ thị có đường vòng, không đánh dấu sẽ quay đi quay lại mãi."),I("Dung cách An mấy bước (mấy đường nối trên đường ngắn nhất)?",2,"An - Binh - Dung.","2 bước. BFS xét theo từng lớp: cách 0, cách 1, cách 2."),RF("Tự giải thích: vì sao dùng hàng đợi (vào trước ra trước) thì tự nhiên đi được từ gần tới xa? Nối với bài Queue.")]],
g3:["DFS: đi sâu hết đường rồi mới quay lại",[I(`${P_(BAN+'seen = set()\ndef dfs(x):\n    seen.add(x)\n    print(x)\n    for y in ban[x]:\n        if y not in seen:\n            dfs(y)\ndfs("An")')}Có bao nhiêu dòng được in?`,4,"Mỗi người được in đúng một lần nhờ seen.","4 dòng."),C("Dòng thứ 3 in ra tên ai? (BFS ở bài trước in Chi ở dòng này)",["Dung","Chi","An"],0,"Từ An đi sang Binh, rồi từ Binh còn ai chưa thăm? Đi sâu luôn, chưa quay lại Chi.","Thứ tự DFS: An, Binh, Dung, Chi."),C("Hàm dfs gọi chính nó. Đó là kỹ thuật nào đã học?",["Đệ quy","Vòng lặp for","Dictionary"],0,"Nhớ bài dem(n) gọi dem(n - 1).","DFS là đệ quy trên đồ thị. Ca cơ sở là khi mọi bạn đã thăm."),C("Muốn tìm đường đi ít bước nhất giữa hai người, nên dùng cách nào?",["BFS, vì xét từ gần tới xa","DFS, vì đi sâu","Cách nào cũng đảm bảo"],0,"DFS có thể đi một đường vòng dài trước.","BFS đảm bảo đường ngắn nhất khi mọi đường nối dài như nhau."),RF("Tự giải thích: BFS và DFS khác nhau ở điểm nào về thứ tự thăm? Mỗi cách hợp với loại câu hỏi nào?")]],
dp1:["Quy hoạch động: đừng tính lại việc đã tính",[I(`${P_('def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\nprint(fib(4))')}In ra mấy? (fib(0)=0, fib(1)=1, fib(2)=1, fib(3)=2)`,3,"fib(4) = fib(3) + fib(2) = 2 + 1.","fib(4) = 3."),I("Khi tính fib(4), fib(2) bị tính tất cả mấy lần? (fib(4) gọi fib(3) và fib(2); fib(3) lại gọi fib(2))",2,"Một lần từ fib(4), một lần từ fib(3).","2 lần, cùng một việc làm lặp lại."),C("Nếu tính fib(50) theo cách này, chuyện gì xảy ra?",["Cực chậm vì cùng một việc bị làm đi làm lại rất nhiều lần","Rất nhanh","Báo lỗi cú pháp"],0,"Mỗi lần gọi tách thành hai lần gọi nữa.","Số lần gọi tăng gần gấp đôi mỗi bậc, rất lãng phí."),C("Cách khắc phục: tính xong fib(k) thì ghi vào dictionary, lần sau tra ra. Kỹ thuật này gọi là gì?",["Memoization (ghi nhớ kết quả)","Sorting","Binary search"],0,"Nhớ bài Two Sum: ta cũng dùng dictionary để nhớ.","Memo: dùng dictionary để mỗi bài con chỉ tính một lần."),RF("Tự giải thích: 'bài con trùng lặp' nghĩa là gì, và vì sao ghi nhớ kết quả lại tiết kiệm thời gian?")]],
dp2:["Bảng quy hoạch động: leo cầu thang",[I("Mỗi lần bước 1 hoặc 2 bậc. Lên bậc 1 có mấy cách?",1,"Chỉ có cách bước 1 bậc từ mặt đất.","1 cách."),I("Lên bậc 2 có mấy cách? (1+1 hoặc 2)",2,"Liệt kê hai cách.","2 cách."),C("Muốn đứng ở bậc 3, bước cuối cùng có thể đến từ đâu?",["Từ bậc 2 (bước 1) hoặc từ bậc 1 (bước 2)","Chỉ từ bậc 2","Từ bậc 4"],0,"Một bước dài 1 hoặc 2 bậc.","cách(3) = cách(2) + cách(1)."),I("Vậy lên bậc 3 có mấy cách?",3,"2 + 1.","3 cách."),I("Lên bậc 4 có mấy cách? (cách(4) = cách(3) + cách(2))",5,"3 + 2.","5 cách."),I(`${P_('dp = [1, 2]\nfor i in range(2, 5):\n    dp.append(dp[i - 1] + dp[i - 2])\nprint(dp[4])')}In ra mấy? Chú ý: dp[0] là bậc 1, dp[1] là bậc 2.`,8,"Dò từng vòng: dp = [1, 2, 3, 5, 8].","dp[4] là bậc 5 nên 8. Chỉ số lệch một so với số bậc: đây là chỗ hay nhầm."),RF("Tự giải thích: 'dp[i] nghĩa là gì' và 'dp[i] được tính từ những ô nào' trong bài này? Vì sao không cần tính lại từ đầu?")]]});
Object.entries({g1:NEW.g1,g2:NEW.g2,g3:NEW.g3,dp1:NEW.dp1,dp2:NEW.dp2}).forEach(([id,[t,steps]])=>{LES[id]={t,steps}});
Object.assign(NEW,{
e1:["Đọc thông báo lỗi: Python đang nói gì với bạn?",[C(`${P_('nums = [10, 20, 30]\nprint(nums[3])')}Chạy đoạn này sẽ gặp lỗi gì?`,["IndexError (vị trí không tồn tại)","KeyError","NameError"],0,"Danh sách có 3 phần tử. Các chỉ số hợp lệ là gì?","Chỉ số hợp lệ là 0, 1, 2. Chỉ số 3 không tồn tại."),I("Với danh sách 3 phần tử như trên, chỉ số lớn nhất dùng được là mấy?",2,"Đếm từ 0.","n phần tử thì chỉ số lớn nhất là n - 1."),C(`${P_('d = {"a": 1}\nprint(d["b"])')}Lỗi gì?`,["KeyError (key chưa có)","IndexError","TypeError"],0,"Dictionary có key nào? Ta tra key nào?","Tra key b chưa từng được ghi vào."),C(`${P_('print("5" + 2)')}Lỗi gì?`,["TypeError (cộng chữ với số)","ValueError","SyntaxError"],0,'"5" là chữ hay số?',"Chữ và số không cộng trực tiếp được."),C(`${P_('print(tong)')}(chưa có dòng nào tạo biến tong) Lỗi gì?`,["NameError (chưa biết tên này)","IndexError","ZeroDivisionError"],0,"Python có biết biến tong là gì không?","Chưa tạo biến mà đã dùng."),RF("Tự giải thích: khi gặp thông báo lỗi, bạn đọc phần nào trước, và phần đó cho bạn biết điều gì? (Gợi ý: tên lỗi, thông điệp, số dòng.)")]],
e2:["Phòng debug 1: thiếu một phần tử",[I(`${P_('nums = [1, 2, 3]\ntotal = 0\nfor i in range(len(nums) - 1):\n    total += nums[i]\nprint(total)')}Đoạn này in ra mấy? Hãy dò bằng tay từng vòng.`,3,"len(nums) - 1 bằng 2, range(2) cho ra 0, 1.","i = 0 và i = 1 nên chỉ cộng 1 + 2 = 3."),I("Kết quả đúng của 1 + 2 + 3 là mấy?",6,"Cộng cả ba số.","6. Chương trình không báo lỗi nhưng cho kết quả sai: đây là lỗi logic."),I("Phần tử bị bỏ sót nằm ở chỉ số mấy?",2,"Vòng lặp chỉ chạy i = 0 và 1.","Chỉ số 2, tức phần tử cuối."),C("Vì sao vòng lặp dừng sớm một phần tử?",["range(len(nums) - 1) chỉ cho ra các số từ 0 đến len - 2","Vì total bắt đầu bằng 0","Vì nums có 3 phần tử"],0,"range(2) cho ra những số nào?","Trừ đi 1 là thừa: range(len(nums)) đã dừng ở len - 1 rồi. Đây là lỗi lệch một (off-by-one)."),RF("Tự giải thích: lỗi lệch một xảy ra khi nào? Bạn sẽ kiểm tra thế nào để phát hiện sớm? (Gợi ý: thử danh sách chỉ có 1 phần tử.)")]],
e3:["Phòng debug 2: giá trị khởi tạo sai",[I(`${P_('nums = [1, 2, 3]\ntotal = 1\nfor x in nums:\n    total += x\nprint(total)')}Đoạn này in ra mấy?`,7,"total bắt đầu bằng 1, rồi cộng 1, 2, 3.","1 + 1 + 2 + 3 = 7, trong khi tổng đúng là 6."),C("Giá trị khởi tạo đúng cho một phép cộng dồn là gì?",["0, vì cộng 0 không làm đổi gì","1","Phần tử cuối"],0,"Số nào cộng vào mà kết quả không đổi?","Phần tử trung hòa của phép cộng là 0."),I(`${P_('nums = [-5, -2, -9]\nbest = 0\nfor x in nums:\n    if x > best:\n        best = x\nprint(best)')}Đoạn tìm số lớn nhất này in ra mấy?`,0,"Có số nào lớn hơn 0 không?","In ra 0, nhưng 0 không nằm trong danh sách. Sai."),C("Vì sao lại sai?",["best bắt đầu bằng 0 trong khi mọi số đều âm","Vì có số âm là không hợp lệ","Vì vòng for sai"],0,"Nhớ bài tờ giấy nhớ: ban đầu nên ghi gì?","Nên lấy phần tử đầu tiên làm mốc."),RF("Tự giải thích: ca test nào sẽ lộ ra lỗi này ngay lập tức? Vì sao ca test 'bình thường' [1, 2, 3] không phát hiện được?")]],
e4:["Phòng debug 3: lỗi logic, không báo lỗi gì cả",[I(`${P_('def dem_chan(nums):\n    c = 0\n    for x in nums:\n        if x % 2 == 1:\n            c += 1\n    return c\nprint(dem_chan([2, 4, 5]))')}Hàm tên dem_chan (đếm số chẵn). Nó in ra mấy?`,1,"x % 2 == 1 đúng với số nào trong [2, 4, 5]?","Chỉ số 5 (lẻ), nên in 1."),I("Đếm số chẵn trong [2, 4, 5] thì đúng phải ra mấy?",2,"Chỉ 2 và 4 là chẵn.","2. Hàm đang đếm số lẻ chứ không phải số chẵn."),C("Lỗi này thuộc loại nào?",["Lỗi logic: chạy được, không báo lỗi, nhưng kết quả sai","Lỗi cú pháp","Lỗi chạy (exception)"],0,"Python có báo lỗi gì không?","Lỗi logic khó nhất vì chỉ có test mới lộ ra."),C("Cách debug hiệu quả nhất khi code chạy được mà sai là gì?",["Dò bằng tay hoặc in giá trị từng vòng, so với kết quả mong đợi","Đoán rồi sửa bừa","Xóa hết viết lại"],0,"Bạn cần thấy máy tính đang làm gì ở từng bước.","Quan sát từng bước rồi so với kỳ vọng. Sửa bừa dễ gây thêm lỗi."),RF("Tự giải thích: phân biệt ba loại lỗi (cú pháp, exception khi chạy, logic) bằng lời của bạn. Loại nào Python báo cho bạn, loại nào bạn phải tự phát hiện?")]]});
Object.entries({e1:NEW.e1,e2:NEW.e2,e3:NEW.e3,e4:NEW.e4}).forEach(([id,[t,steps]])=>{LES[id]={t,steps}});
const TXS="txs = [{'id': 1, 'type': 'deposit', 'amount': 100}, {'id': 2, 'type': 'withdraw', 'amount': 30}, {'id': 2, 'type': 'deposit', 'amount': 10}, {'id': 3, 'type': 'gift', 'amount': 5}, {'id': 4, 'type': 'deposit', 'amount': -20}]\n";
Object.assign(NEW,{
m1:["Mini project 1: yêu cầu thật thì luôn thiếu chi tiết",[C("Khách hàng nói: 'Hệ thống tính số dư tài khoản từ danh sách giao dịch.' Việc đầu tiên một lập trình viên giỏi làm là gì?",["Hỏi lại những chỗ chưa rõ trước khi viết dòng code nào","Mở editor và code ngay","Chờ khách tự bổ sung"],0,"Câu yêu cầu có nói giao dịch trông như thế nào không?","Đoán sai yêu cầu thì code đẹp đến mấy cũng vô ích."),C("Câu hỏi nào về yêu cầu quan trọng nhất ở đây?",["Rút nhiều hơn số dư thì sao: cho âm hay từ chối?","Dùng font nào","Viết bằng máy nào"],0,"Điều này ảnh hưởng đến tiền thật.","Quy tắc nghiệp vụ như vậy phải được khách xác nhận."),C("Khách im lặng không trả lời. Bạn nên làm gì?",["Ghi rõ giả định mình chọn (ví dụ: không cho số dư âm) và gửi lại để họ xác nhận","Tự chọn và không nói ai biết","Bỏ dự án"],0,"Giả định không ghi ra sẽ thành bất ngờ sau này.","Ghi giả định ra giấy trắng mực đen, để ai cũng đọc được."),I("Một giao dịch gồm 3 trường: id, type, amount. Mỗi giao dịch cần có bao nhiêu trường bắt buộc?",3,"Đếm các trường vừa nêu.","3 trường. Thiếu một trường là dữ liệu hỏng."),RF("Viết 3 giả định bạn sẽ gửi cho khách xác nhận trước khi code (ví dụ về số dư âm, loại giao dịch, id trùng).")]],
m2:["Liệt kê giao dịch không hợp lệ TRƯỚC khi code",[I(`${P_(TXS+'print(len(txs))')}Danh sách có 5 giao dịch. Trong đó có bao nhiêu giao dịch KHÔNG hợp lệ? (id 2 xuất hiện hai lần, loại 'gift' không phải deposit hay withdraw, và một khoản nạp âm. Đếm giao dịch id 2 thứ hai là một lỗi.)`,3,"Liệt kê: trùng id, loại lạ, số tiền âm.","3 lỗi: trùng id, type lạ, amount âm."),C("Có một giao dịch xấu trong danh sách 1000 giao dịch. Nên làm gì với tiền của khách?",["Từ chối cả lô và báo rõ giao dịch nào sai, để người phụ trách sửa","Bỏ giao dịch xấu và cứ tính tiếp, không báo ai","Tính hết rồi đoán"],0,"Số dư sai do lặng lẽ bỏ qua có thể hại ai?","Với tiền, im lặng bỏ qua dữ liệu là nguy hiểm. Báo lỗi rõ ràng, dễ truy vết."),C("amount = -50 do người dùng nhập sai thuộc loại lỗi nào?",["Lỗi dữ liệu đầu vào dự đoán được: kiểm tra rồi raise ValueError","Lỗi bất ngờ của hệ thống","Không phải lỗi"],0,"Ta biết trước người dùng có thể nhập sai.","Lỗi dự đoán được thì kiểm tra trước và báo bằng exception rõ nghĩa."),C("Loại lỗi nào ta KHÔNG thể biết trước và chỉ có thể bắt ở tầng ngoài, ghi log?",["Hết bộ nhớ, mất kết nối đột ngột","Thiếu trường amount","amount âm"],0,"Hai cái còn lại ta kiểm tra được ngay từ dữ liệu.","Lỗi bất ngờ: bắt ở tầng ngoài, ghi lại, báo cho người vận hành."),RF("Tự giải thích: vì sao ta kiểm tra toàn bộ đầu vào trước khi tính, thay vì vừa tính vừa kiểm tra?")]],
m3:["Chia nhỏ thành đường ống: kiểm tra, tính, trả",[I(`${P_("t = [100, -30, -50]\ntotal = 0\nfor x in t:\n    total += x\nprint(total)")}(+ là nạp, - là rút) In ra mấy?`,20,"100 - 30 - 50.","100 - 30 = 70, 70 - 50 = 20."),I("Rút thêm 80 từ số dư 20 thì số dư sẽ là bao nhiêu?",-60,"20 - 80.","-60. Theo giả định không cho âm thì phải báo lỗi."),C("Kiểm tra số dư âm nên làm khi nào?",["Ngay sau mỗi giao dịch rút","Chỉ ở cuối","Không cần"],0,"Nếu thứ tự là rút 80 trước rồi mới nạp 100 thì ở cuối số dư dương nhưng giữa chừng đã âm.","Số dư phải hợp lệ ở mọi thời điểm."),C("Thứ tự đúng của đường ống là gì?",["Kiểm tra đầu vào, tính, trả kết quả","Tính, kiểm tra, trả","Trả, kiểm tra, tính"],0,"Dữ liệu hỏng thì tính có ý nghĩa gì?","Kiểm tra trước, tính sau, rồi mới trả."),RF("Vẽ bằng lời đường ống: nhận dữ liệu, kiểm tra, tính, trả. Ở mỗi bước, lỗi nào có thể xảy ra và hàm sẽ làm gì?")]]});
Object.entries({m1:NEW.m1,m2:NEW.m2,m3:NEW.m3}).forEach(([id,[t,steps]])=>{LES[id]={t,steps}});
mk("w9","Mini project 1, Code 9: final_balance (số dư sau các giao dịch)","final_balance","txs","Viết hàm final_balance(txs). Mỗi giao dịch là dict có id, type ('deposit' nạp hoặc 'withdraw' rút), amount (số dương). Trả về số dư cuối, bắt đầu từ 0. Số dư không được âm ở bất kỳ thời điểm nào. Dữ liệu sai thì báo lỗi rõ ràng, không đoán.",
[["Giao dịch thiếu trường amount. Hàm nên làm gì?",["Báo ValueError, vì dữ liệu hỏng","Coi như amount bằng 0","Bỏ qua im lặng"],0,"Số tiền bị mất nghĩa là gì với kế toán?"],
["Rút 50 khi số dư đang là 20. Hàm nên làm gì?",["Báo ValueError: số dư không đủ","Cho số dư âm","Trả về 0"],0,"Nhớ giả định đã ghi: không cho số dư âm."],TF],
`def final_balance(txs):
    if not isinstance(txs, list):
        raise TypeError("txs phai la list")
    if any([not isinstance(t, dict) for t in txs]):
        raise ValueError("moi giao dich phai la dict")
    if any([t.get("id") is None for t in txs]):
        raise ValueError("thieu id")
    if any([t.get("type") not in ("deposit", "withdraw") for t in txs]):
        raise ValueError("type khong hop le")
    if any([not isinstance(t.get("amount"), (int, float)) or t.get("amount") <= 0 for t in txs]):
        raise ValueError("amount phai la so duong")
    if len(set([t.get("id") for t in txs])) != len(txs):
        raise ValueError("trung id")
    total = 0
    for t in txs:
        if t["type"] == "deposit":
            total += t["amount"]
        else:
            total -= t["amount"]
        if total < 0:
            raise ValueError("so du khong du")
    return total
`,[["final_balance([])","0"],["final_balance([{'id': 1, 'type': 'deposit', 'amount': 100}])","100"],["final_balance([{'id': 1, 'type': 'deposit', 'amount': 100}, {'id': 2, 'type': 'withdraw', 'amount': 30}])","70"],["final_balance([{'id': 1, 'type': 'deposit', 'amount': 50}, {'id': 2, 'type': 'withdraw', 'amount': 50}])","0"]],
[["final_balance(None)","TypeError"],["final_balance([5])","ValueError"],["final_balance([{'id': 1, 'type': 'gift', 'amount': 5}])","ValueError"],["final_balance([{'id': 1, 'type': 'deposit', 'amount': -5}])","ValueError"],["final_balance([{'id': 1, 'type': 'deposit'}])","ValueError"],["final_balance([{'id': 1, 'type': 'deposit', 'amount': 5}, {'id': 1, 'type': 'deposit', 'amount': 7}])","ValueError"],["final_balance([{'id': 1, 'type': 'withdraw', 'amount': 5}])","ValueError"]]);
scaf("w9",2,"Vừa (có khung comment, tự viết hàng rào và logic)",[["Kiểm tra txs là list, nếu không thì báo TypeError","Hàm nhận được None thì sao?"],["Kiểm tra từng giao dịch: là dict, có id, type hợp lệ, amount là số dương","Một giao dịch thiếu trường hoặc sai loại thì hệ thống tiền bạc nên làm gì?"],["Kiểm tra id không trùng","Hai giao dịch cùng id có thể là gì trong thực tế?"],["Duyệt giao dịch: nạp thì cộng, rút thì trừ","Số dư bắt đầu từ đâu?"],["Sau mỗi giao dịch, số dư âm thì báo ValueError","Khi nào số dư bị phép trừ làm âm?"],["Trả về số dư cuối","Duyệt xong rồi, kết quả là gì?"]],
"# Mình cho sẵn 1 test mẫu. Bạn viết thêm test cho: danh sách trống, nạp rồi rút, đầu vào None, giao dịch xấu, rút quá số dư.\n"+HP+"assert final_balance([{'id': 1, 'type': 'deposit', 'amount': 100}]) == 100   # ví dụ có sẵn\n",
"def final_balance(txs):\n    # việc 1: kiểm tra txs là list\n    # việc 2: kiểm tra từng giao dịch (dict, id, type, amount dương)\n    # việc 3: kiểm tra id không trùng\n    # việc 4: duyệt, nạp thì cộng, rút thì trừ\n    # việc 5: số dư âm thì báo ValueError\n    # việc 6: trả về số dư\n    pass\n",
"Nhìn lại cấu trúc bài trước: hàng rào chặn dữ liệu xấu, rồi vòng lặp tính, rồi kiểm tra điều kiện nghiệp vụ.","def final_balance(txs):\n    total = ___\n    for t in txs:\n        if t[\"type\"] == \"deposit\":\n            total += t[\"amount\"]\n        else:\n            total -= ___\n        if total ___ 0:\n            raise ValueError(\"so du khong du\")\n    return total",
["Đầu vào xấu nên bị chặn ở đâu?",["Ngay đầu hàm, trước khi tính","Ở cuối hàm","Không cần chặn"],0,"Nhớ đường ống: kiểm tra, tính, trả."]);
LES.w9.steps.filter(x=>x.k=="code")[0].hp=["Hãy liệt kê lại các ca xấu bạn đã viết trong test. Mỗi ca cần một dòng if rồi raise.","Mẫu một hàng rào:\nif not isinstance(txs, list):\n    raise TypeError(\"txs phai la list\")\nVới danh sách, any([... for t in txs]) cho biết có giao dịch nào thỏa điều kiện xấu.","Lời giải tham khảo:\n"+LES.w9.ref];
const rot=(a,k)=>{const c=a[0],o=[...a];k=k%o.length;const r=o.slice(k).concat(o.slice(0,k));return[r,r.indexOf(c)]};
const REV={w1:["O(n)","tìm giá cao nhất hoặc thấp nhất trong báo cáo bán hàng"],w2:["O(n)","tra một mã sản phẩm trong danh sách nhỏ chưa sắp xếp"],w3:["O(n)","lấy người về nhì trong bảng xếp hạng"],w4:["O(n)","đối chiếu sổ sách: tìm hai khoản cộng lại đúng bằng số tiền cần khớp"],w5:["O(n)","đối chiếu sổ sách: tìm hai khoản cộng lại đúng bằng số tiền cần khớp"],w6:["O(n)","đối chiếu sổ sách: tìm hai khoản cộng lại đúng bằng số tiền cần khớp"],w7:["O(n)","phát hiện đơn hàng hoặc mã giao dịch bị nhập trùng"],w8:["O(n)","duyệt dữ liệu lồng nhau như thư mục, bình luận trả lời bình luận"],w9:["O(n)","sổ cái của ví điện tử hoặc ngân hàng, nơi mọi lỗi dữ liệu phải lộ ra rõ ràng"]};
const addRev=([id,[cx,app]],k)=>{const L=LES[id];
let [o1,a1]=rot([cx,"O(n²)","O(1)"],k);
let [o2,a2]=rot(["Dễ đọc, dễ test, và lỗi lộ ra sớm trước khi tính dở dang","Cho code dài hơn","Vì quy định bắt buộc"],k+1);
let [o3,a3]=rot(["Dùng được vào việc thật: "+app,"Chỉ dùng trong bài thi lập trình","Không dùng ở đâu cả"],k+2);
L.steps.push({k:"choice",ph:"Bước 7: Code review (bây giờ bạn là người review)",q:"Reviewer hỏi: độ phức tạp thời gian của hàm này theo n (độ dài đầu vào) là gì?",o:o1,a:a1,h:"Đếm xem mỗi phần tử bị chạm tới bao nhiêu lần.",s:"Chốt: "+cx+", mỗi phần tử xử lý một số lần cố định."},
{k:"choice",ph:"Bước 7: Code review (bây giờ bạn là người review)",q:"Vì sao hàm tách phần chặn đầu vào xấu ra khỏi phần tính chính?",o:o2,a:a2,h:"Hãy nghĩ đến người đọc code sau bạn, và người viết test.",s:"Chốt: tách hàng rào giúp đọc, test và phát hiện lỗi sớm."},
{k:"choice",ph:"Bước 8: Ứng dụng, không chỉ giải đề",q:"Ý tưởng cốt lõi bạn vừa luyện dùng vào đâu ngoài đời?",o:o3,a:a3,h:"Nghĩ tới hệ thống thật có dữ liệu thật.",s:"Chốt: "+app+"."},
{k:"reflect",ph:"Bước 8: Ứng dụng, không chỉ giải đề",q:"Viết nhận xét code review cho CHÍNH code của bạn: một điểm tốt, một điều bạn sẽ cải thiện, và một ca test bạn thấy còn thiếu. Rồi nghĩ thêm một chỗ khác trong công việc thật mà bạn có thể dùng đúng ý tưởng này.",s:"Đã tự review và nối với thực tế"})};
Object.entries(REV).forEach(addRev);
const KQ={A:"q.append(\"A\")\nq.append(\"B\")\nq.append(\"C\")\n"};
Object.assign(NEW,{
ap1:["Ứng dụng 1: cache, dùng dictionary để khỏi hỏi lại",[I(`${P_('seen = set()\nhits = 0\nfor k in ["A", "B", "A", "A", "C", "B"]:\n    if k in seen:\n        hits += 1\n    else:\n        seen.add(k)\nprint(hits)')}Đoạn này mô phỏng cache: gặp lại khóa đã thấy là trúng (hit). In ra mấy?`,3,"Dò từng khóa: A mới, B mới, A trùng, A trùng, C mới, B trùng.","3 lần trúng, 3 lần trượt."),I("Hỏi cơ sở dữ liệu mất 100ms, tra cache mất 1ms. 6 lần gọi trên: 3 lần trượt (100ms) và 3 lần trúng (1ms). Tổng cộng bao nhiêu ms?",303,"3 * 100 + 3 * 1.","303ms. Không có cache thì 6 * 100 = 600ms."),C("Giá sản phẩm đã đổi trong cơ sở dữ liệu nhưng cache vẫn giữ giá cũ. Đây là vấn đề gì?",["Dữ liệu cũ (stale): cache cần có hạn dùng hoặc cách làm mới","Cache chạy nhanh quá","Không phải vấn đề"],0,"Cache nhanh nhưng có bao giờ tự biết dữ liệu gốc đã đổi?","Vì thế hệ thống thật luôn nghĩ tới hết hạn (TTL) và xóa cache khi dữ liệu đổi."),C("Vì sao cache thường dùng dictionary?",["Tra theo khóa gần như một bước, O(1)","Vì dictionary nhỏ","Vì dictionary tự sắp xếp"],0,"Nhớ bài hash map: tra key mất bao nhiêu bước?","Chính ý tưởng Two Sum: nhớ cái đã gặp để tra nhanh."),RF("Ứng dụng: nghĩ một hệ thống bạn dùng hằng ngày (trang tin, bản đồ, mạng xã hội) chỗ nào có thể dùng cache? Nếu dữ liệu đổi liên tục thì cache có lợi không?")]],
ap2:["Ứng dụng 2: hàng đợi công việc (job queue)",[I(`${P_('q = []\nq.append("A")\nq.append("B")\nq.append("C")\nq.pop(0)\nq.pop(0)\nprint(len(q))')}Các công việc A, B, C xếp hàng chờ in. Sau hai lần lấy ra, còn bao nhiêu việc?`,1,"Mỗi pop(0) lấy một việc ra khỏi đầu hàng.","Còn C, tức 1 việc."),C("Công việc nào được lấy ra làm đầu tiên?",["A, vì vào trước ra trước","C, vì mới nhất","B, ở giữa"],0,"Nghĩ tới hàng người xếp ở quầy.","Queue là vào trước ra trước, công bằng với người đến trước."),C("Vì sao hàng chờ in dùng queue chứ không dùng stack?",["Stack sẽ làm việc đến sau chen lên trước, người đến trước có thể chờ mãi","Stack in nhanh hơn","Không khác nhau"],0,"Với stack, lấy ra việc nào đầu tiên?","Công bằng và đoán trước được thứ tự là lý do dùng queue."),C("Trong thực tế, hệ thống xử lý đơn hàng, gửi email, hay tải video thường làm gì khi lượng việc dồn lên đột ngột?",["Cho việc vào hàng đợi, xử lý dần theo khả năng","Từ chối tất cả","Làm hết cùng lúc"],0,"Làm hết cùng lúc có thể làm sập máy.","Hàng đợi giữ việc lại để hệ thống không bị quá tải."),RF("Ứng dụng: kể hai hệ thống thật dùng hàng đợi, và nói chuyện gì sẽ xảy ra nếu thiếu hàng đợi lúc đông người.")]],
ap3:["Ứng dụng 3: Undo và kiểm tra ngoặc bằng stack",[I(`${P_('history = []\nhistory.append("a")\nhistory.append("b")\nhistory.append("c")\nhistory.pop()\nhistory.pop()\nprint(len(history))')}Mỗi append là một thao tác soạn thảo, mỗi pop là một lần Undo. Còn bao nhiêu thao tác trong lịch sử?`,1,"Ba thao tác, hai lần hoàn tác.","Còn thao tác a."),C("Undo lần đầu hoàn tác thao tác nào?",["Thao tác gần nhất (c)","Thao tác đầu tiên (a)","Thao tác ở giữa"],0,"Bạn nhấn Ctrl+Z ngay sau khi gõ chữ.","Vào sau ra trước: đúng bản chất stack."),C("Kiểm tra chuỗi ngoặc ([)]: gặp ] thì đỉnh stack đang là ( . Kết luận gì?",["Không hợp lệ, vì ] phải đóng [ chứ không phải (","Hợp lệ","Bỏ qua"],0,"Đỉnh stack là ngoặc mở gần nhất còn chưa được đóng.","Ngoặc mở gần nhất phải được đóng trước."),C("Trình biên dịch và trình soạn thảo code dùng ý tưởng nào để báo lỗi ngoặc?",["Stack các ngoặc đang mở","Sắp xếp","Cache"],0,"Cái nào đóng trước: ngoặc mở sau hay mở trước?","Stack là công cụ tự nhiên cho cấu trúc lồng nhau."),RF("Ứng dụng: ngoài Undo và kiểm tra ngoặc, nút Back của trình duyệt có phải stack không? Giải thích bằng lời.")]],
ap4:["Ứng dụng 4: phụ thuộc giữa các gói là đồ thị",[I(`${P_('deps = {"app": ["lib", "log"], "lib": ["core"], "log": ["core"], "core": []}\nprint(len(deps))')}Để chạy app, cần cài các gói trong bảng phụ thuộc. Có tất cả bao nhiêu gói (kể cả app)?`,4,"Đếm số khóa của bảng.","4 gói: app, lib, log, core."),C("Gói nào phải cài ĐẦU TIÊN?",["core, vì không cần gói nào khác","app","lib"],0,"Gói nào không có phụ thuộc?","Phải cài thứ mà người khác dựa vào trước."),C("Thứ tự cài nào hợp lệ?",["core, lib, log, app","app, lib, log, core","lib, app, core, log"],0,"Mỗi gói chỉ được cài khi các gói nó cần đã có.","Thứ tự này gọi là sắp xếp topo."),C("Nếu lib cần log và log cần lib, chuyện gì xảy ra?",["Không có thứ tự nào hợp lệ: phụ thuộc vòng, hệ thống phải báo lỗi","Cài song song là xong","Bỏ qua một gói"],0,"Gói nào cài trước?","Phát hiện vòng là việc rất thật của trình quản lý gói và hệ thống build."),RF("Ứng dụng: kể một việc khác có thể vẽ thành các mũi tên 'phải xong A trước khi làm B' (công việc dự án, môn học tiên quyết...). Có thể gặp vòng không?")]],
ap5:["Ứng dụng 5: thư mục là cây, tính dung lượng bằng đệ quy",[I(`${P_('tree = {"size": 0, "children": [{"size": 5, "children": []}, {"size": 0, "children": [{"size": 7, "children": []}, {"size": 3, "children": []}]}]}\ndef total(n):\n    s = n["size"]\n    for c in n["children"]:\n        s += total(c)\n    return s\nprint(total(tree["children"][1]))')}Mỗi nút là tệp hoặc thư mục. In ra mấy? (Nút con thứ hai là một thư mục chứa hai tệp 7 và 3.)`,10,"Thư mục này có size 0, cộng total của hai tệp con.","0 + 7 + 3 = 10."),I("Gọi total(tree), tức tính toàn bộ cây, ra mấy?",15,"Cộng tệp 5 với thư mục vừa tính.","5 + 10 = 15."),C("Ca cơ sở của hàm total là gì?",["Nút không có con: vòng for không chạy, trả về size của chính nó","Nút có nhiều con","Cây rỗng"],0,"Khi children là danh sách rỗng, điều gì xảy ra?","Nút lá không gọi tiếp. Đúng ý bài đệ quy."),C("Lệnh du hay trình quản lý tệp hiển thị dung lượng thư mục dựa trên ý tưởng nào?",["Duyệt cây, cộng dung lượng từ lá lên","Đoán","Đọc một con số có sẵn"],0,"Thư mục không tự có dung lượng, nó chứa các thứ khác.","Giống hệt hàm total."),RF("Ứng dụng: ngoài thư mục, còn thứ gì ngoài đời có hình cây (sơ đồ công ty, mục lục, bình luận trả lời bình luận)? Bạn sẽ tính gì trên cây đó?")]],
ap6:["Ứng dụng 6: chọn cấu trúc dữ liệu cho yêu cầu thật",[C("Tìm khách hàng theo số điện thoại trong 10 triệu bản ghi, nhanh. Nên dùng gì?",["Dictionary (hash map): tra theo khóa","List và duyệt từng người","Stack"],0,"Cần tra theo một khóa, gần như một bước.","Hash map: khóa là số điện thoại."),C("Chức năng hoàn tác (Undo) khi chỉnh sửa tài liệu nên dùng gì?",["Stack","Queue","Set"],0,"Hoàn tác thao tác nào trước?","Vào sau ra trước."),C("Xử lý các yêu cầu gửi đến server theo đúng thứ tự đến. Nên dùng gì?",["Queue","Stack","Dictionary"],0,"Ai đến trước thì được phục vụ trước.","Vào trước ra trước."),C("Hỏi 'hai người có quan hệ gián tiếp qua bạn bè không' trong mạng xã hội. Nên mô hình hóa thành gì?",["Đồ thị, rồi duyệt BFS hoặc DFS","Một con số","Một chuỗi"],0,"Người là nút, quan hệ là đường nối.","Đồ thị, và BFS cho biết khoảng cách ngắn nhất."),C("Loại bỏ các email trùng trong danh sách gửi tin. Nên dùng gì?",["Set","Stack","Cây"],0,"Cần biết một phần tử đã có chưa và không giữ bản sao.","Set: mỗi giá trị xuất hiện một lần, tra nhanh."),RF("Capstone: chọn một hệ thống bạn muốn xây (ứng dụng ghi chi tiêu, quản lý công việc, tìm kiếm sản phẩm...). Liệt kê ít nhất 3 chức năng, với mỗi chức năng chọn một cấu trúc dữ liệu và giải thích vì sao bằng một câu.")]]});
Object.entries({ap1:NEW.ap1,ap2:NEW.ap2,ap3:NEW.ap3,ap4:NEW.ap4,ap5:NEW.ap5,ap6:NEW.ap6}).forEach(([id,[t,steps]])=>{LES[id]={t,steps}});
mk("w10","Mini project 2, Code 10: install_order (thứ tự cài các gói)","install_order","deps","Viết hàm install_order(deps). deps là dict: tên gói, giá trị là list các gói nó cần. Trả về list thứ tự cài sao cho mỗi gói đứng SAU các gói nó cần. Khi nhiều thứ tự đều đúng, duyệt tên gói theo thứ tự chữ cái. Gói cần một gói không có trong deps, hoặc có phụ thuộc vòng, thì báo ValueError.",
[["Gói app cần lib, lib cần core. Thứ tự cài đúng là gì?",["core, lib, app","app, lib, core","lib, core, app"],0,"Cái được cần phải có mặt trước."],
["Gói app cần X nhưng X không có trong deps. Hàm nên làm gì?",["Báo ValueError: thiếu gói, không cài được","Bỏ qua X và cài tiếp","Tự thêm X"],0,"Cài một gói thiếu phụ thuộc thì hệ thống thật sẽ ra sao?"],
["Nếu a cần b và b cần a, hàm nên làm gì?",["Báo ValueError: phụ thuộc vòng, không có thứ tự hợp lệ","Cài a trước rồi b","Bỏ qua"],0,"Gói nào cài trước? Nhớ bài ap4."],TF],
`def install_order(deps):
    if not isinstance(deps, dict):
        raise TypeError("deps phai la dict")
    if any([not isinstance(k, str) for k in deps]):
        raise ValueError("ten goi phai la chuoi")
    if any([not isinstance(v, list) for v in deps.values()]):
        raise ValueError("phu thuoc phai la list")
    if any([d not in deps for v in deps.values() for d in v]):
        raise ValueError("phu thuoc khong ton tai")
    order = []
    state = {}
    def visit(x):
        if state.get(x) == "done":
            return
        if state.get(x) == "doing":
            raise ValueError("phu thuoc vong")
        state[x] = "doing"
        for d in deps[x]:
            visit(d)
        state[x] = "done"
        order.append(x)
    for name in sorted(deps):
        visit(name)
    return order
`,[["install_order({})","[]"],["install_order({'app': ['lib'], 'lib': []})","['lib', 'app']"],["install_order({'a': [], 'b': []})","['a', 'b']"],["install_order({'app': ['lib', 'log'], 'lib': ['core'], 'log': ['core'], 'core': []})","['core', 'lib', 'log', 'app']"]],
[["install_order(None)","TypeError"],["install_order({1: []})","ValueError"],["install_order({'a': 'b'})","ValueError"],["install_order({'a': ['x']})","ValueError"],["install_order({'a': ['b'], 'b': ['a']})","ValueError"],["install_order({'a': ['a']})","ValueError"]]);
scaf("w10",2,"Vừa (có khung comment, tự viết hàng rào và logic)",[["Kiểm tra deps là dict, tên gói là chuỗi, phụ thuộc là list","Đầu vào xấu thì chặn ở đâu?"],["Kiểm tra mọi gói được nhắc tới đều có trong deps","Cần một gói không tồn tại thì cài được không?"],["Với mỗi gói, thăm các gói nó cần trước (đệ quy)","Gói cần phải xong trước gói đang xét."],["Đánh dấu gói đang thăm, gặp lại gói đang thăm nghĩa là có vòng","Thăm lại đúng gói mình đang đi từ đó, nghĩa là gì?"],["Thăm xong thì thêm gói vào kết quả","Khi nào thì gói chắc chắn đã sẵn sàng cài?"],["Trả về danh sách thứ tự","Duyệt hết mọi gói rồi thì có gì?"]],
"# Mình cho sẵn 1 test mẫu. Bạn viết thêm test cho: không có gói nào, chuỗi phụ thuộc nối dài, hai gói độc lập, đầu vào None, gói thiếu, phụ thuộc vòng.\n"+HP+"assert install_order({'app': ['lib'], 'lib': []}) == ['lib', 'app']   # ví dụ có sẵn\n",
"def install_order(deps):\n    # việc 1: chặn đầu vào xấu (dict, tên là chuỗi, phụ thuộc là list)\n    # việc 2: chặn gói được nhắc tới mà không có trong deps\n    # việc 3: với mỗi gói theo thứ tự chữ cái, thăm các phụ thuộc trước (đệ quy)\n    # việc 4: đang thăm mà gặp lại thì báo vòng\n    # việc 5: thăm xong thì thêm vào kết quả\n    pass\n",
"Đây là DFS trên đồ thị phụ thuộc: bài ap4 và bài g3 gộp lại. Gói có ba trạng thái: chưa thăm, đang thăm, xong.","def install_order(deps):\n    order = []\n    state = {}\n    def visit(x):\n        if state.get(x) == \"done\":\n            return\n        if state.get(x) == \"___\":\n            raise ValueError(\"phu thuoc vong\")\n        state[x] = \"doing\"\n        for d in deps[x]:\n            visit(___)\n        state[x] = \"done\"\n        order.___(x)\n    for name in sorted(deps):\n        visit(name)\n    return order",
["Gặp lại một nút đang được thăm trong DFS nghĩa là gì?",["Có vòng","Hết đồ thị","Đây là nút lá"],0,"Đường đi quay về đúng nơi nó đang đi từ đó."]);
LES.w10.steps.filter(x=>x.k=="code")[0].hp=["Liệt kê các ca xấu trong test của bạn: đầu vào không phải dict, tên không phải chuỗi, phụ thuộc không phải list, gói được nhắc tới mà không có. Mỗi ca cần một dòng if rồi raise.","Mẫu:\nif not isinstance(deps, dict):\n    raise TypeError(\"deps phai la dict\")\nCác ca còn lại dùng any([... for ...]) rồi raise ValueError.","Lời giải tham khảo:\n"+LES.w10.ref];
addRev(["w10",["O(V + E), tức tuyến tính theo số gói cộng số mối phụ thuộc","trình quản lý gói (pip, npm), hệ thống build, thứ tự học các môn tiên quyết"]],9);
/* ===== Mini project 3: Stack và Queue ngoài đời thật ===== */
mk("w11","Mini project 3, Code 11: bracket_error (tìm lỗi ngoặc như trình soạn thảo)","bracket_error","s",
"Viết hàm bracket_error(s). s là chuỗi mã hoặc cấu hình có ngoặc ( ) [ ] { } lẫn các ký tự khác (ký tự khác bỏ qua). Trả về -1 nếu mọi ngoặc đúng. Nếu có lỗi, trả về chỉ số (đếm từ 0) của ngoặc lỗi đầu tiên: ngoặc đóng thừa hoặc sai loại. Nếu hết chuỗi mà còn ngoặc mở chưa đóng, trả về chỉ số của ngoặc mở chưa đóng nằm gần cuối nhất. s không phải chuỗi thì báo TypeError.",
[["Chuỗi 'x = (1 + 2' có lỗi không, và lỗi ở chỉ số mấy?",["Có: ngoặc mở ở chỉ số 4 chưa được đóng","Không có lỗi","Lỗi ở chỉ số 0"],0,"Đếm chỉ số từng ký tự kể cả dấu cách. Ngoặc mở nằm ở đâu?"],
["Chuỗi '(]': gặp ] khi ngoặc đang chờ đóng là (. Báo lỗi ở đâu?",["Chỉ số 1: ngoặc đóng sai loại","Chỉ số 0","Không có lỗi"],0,"Người dùng cần biết CHỖ SAI, nên ta trả về chỉ số của ngoặc đóng sai."],
["Chuỗi '{[}]' có đủ 2 cặp ngoặc. Chỉ đếm số ngoặc mở và đóng có đủ để kết luận đúng không?",["Không đủ: phải nhớ ngoặc nào mở sau cùng thì phải đóng trước (stack)","Đủ, vì số lượng bằng nhau","Không cần nhớ gì"],0,"Thử với '{[}]': số lượng bằng nhau nhưng thứ tự đóng đã sai."],TF],
`def bracket_error(s):
    if not isinstance(s, str):
        raise TypeError("s phai la chuoi")
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for i in range(len(s)):
        c = s[i]
        if c in "([{":
            stack.append(i)
        elif c in pairs:
            if len(stack) == 0 or s[stack[-1]] != pairs[c]:
                return i
            stack.pop()
    if len(stack) > 0:
        return stack[-1]
    return -1
`,[["bracket_error('')","-1"],["bracket_error('()')","-1"],["bracket_error('a(b)[c]{d}')","-1"],["bracket_error('(]')","1"],["bracket_error(')')","0"],["bracket_error('((')","1"],["bracket_error('{[}]')","2"],["bracket_error('x = (1 + 2')","4"]],
[["bracket_error(None)","TypeError"],["bracket_error(5)","TypeError"],["bracket_error(['('])","TypeError"]]);
scaf("w11",2,"Vừa (có khung comment, tự viết hàng rào và logic)",
[["Chặn đầu vào xấu: s không phải chuỗi thì báo TypeError","Hàm nhận về một con số thì sao?"],["Tạo stack rỗng để nhớ chỉ số các ngoặc mở chưa đóng","Cần nhớ những gì đang chờ được đóng?"],["Duyệt từng ký tự: ngoặc mở thì đẩy chỉ số vào stack","Gặp ngoặc mở thì làm gì?"],["Gặp ngoặc đóng: stack rỗng hoặc đỉnh không khớp thì trả về chỉ số hiện tại, ngược lại lấy đỉnh ra","Ngoặc đóng này phải gặp ngoặc mở nào?"],["Hết chuỗi mà stack còn phần tử thì trả về chỉ số ở đỉnh","Còn ngoặc mở nào chưa được đóng?"],["Còn lại thì trả về -1","Không có lỗi nào thì báo gì?"]],
"# Mình cho sẵn 1 test mẫu. Bạn viết thêm test cho: chuỗi rỗng, ngoặc đóng thừa, ngoặc thiếu đóng, ngoặc đan xen sai thứ tự, chuỗi có chữ lẫn ngoặc, và đầu vào không phải chuỗi.\n"+HP+"assert bracket_error('(]') == 1   # ví dụ có sẵn\n",
"def bracket_error(s):\n    # việc 1: chặn đầu vào xấu (không phải chuỗi thì raise TypeError)\n    # việc 2: tạo stack rỗng (chứa CHỈ SỐ các ngoặc mở)\n    # việc 3: duyệt từng chỉ số i, ngoặc mở thì đẩy i vào stack\n    # việc 4: ngoặc đóng mà stack rỗng hoặc đỉnh không khớp thì trả về i, ngược lại lấy đỉnh ra\n    # việc 5: hết chuỗi mà stack còn phần tử thì trả về chỉ số ở đỉnh\n    # việc 6: không lỗi thì trả về -1\n    pass\n",
"Nhớ bài stack: vào sau thì ra trước. Cái ngoặc mở nằm trên đỉnh phải là cái được đóng đầu tiên.",
"def bracket_error(s):\n    pairs = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}\n    stack = []\n    for i in range(len(s)):\n        c = s[i]\n        if c in \"([{\":\n            stack.___(i)\n        elif c in pairs:\n            if len(stack) == 0 or s[stack[___]] != pairs[c]:\n                return ___\n            stack.pop()\n    if len(stack) > 0:\n        return stack[-1]\n    return ___",
["Stack lấy phần tử nào ra trước?",["Phần tử đặt vào sau cùng","Phần tử đặt vào đầu tiên","Phần tử nhỏ nhất"],0,"Nhớ chồng đĩa: đĩa trên cùng."]);
LES.w11.steps.filter(x=>x.k=="code")[0].hp=["Liệt kê ca xấu trong test của bạn: chỉ có một ca, đầu vào không phải chuỗi. Dòng đầu tiên của hàm nên làm gì?","Mẫu:\nif not isinstance(s, str):\n    raise TypeError(\"s phai la chuoi\")","Lời giải tham khảo (phần hàng rào):\nif not isinstance(s, str):\n    raise TypeError(\"s phai la chuoi\")"];
addRev(["w11",["O(n), mỗi ký tự được xét một lần","trình soạn thảo gạch chân ngoặc thiếu, công cụ kiểm tra JSON và file cấu hình, máy tính biểu thức"]],10);

LES.rl1={t:"Giới hạn tốc độ (rate limiter): hàng đợi giữ các thời điểm",steps:[
C("Một API cho phép tối đa 2 yêu cầu trong mỗi 3 giây. Để quyết định chấp nhận hay từ chối một yêu cầu mới, hệ thống cần nhớ gì về các yêu cầu đã được chấp nhận?",["Thời điểm của chúng","Tên người gọi","Không cần nhớ gì"],0,"Muốn biết 'trong 3 giây gần nhất có mấy yêu cầu', ta cần biết chúng xảy ra lúc nào.","Cần nhớ thời điểm các yêu cầu đã chấp nhận."),
I("Hàng đợi đang giữ các thời điểm [1, 2]. Yêu cầu mới đến lúc giây 3, cửa sổ 3 giây, nên chỉ tính các thời điểm lớn hơn 3 - 3 = 0. Còn mấy thời điểm nằm trong cửa sổ?",2,"1 và 2 có lớn hơn 0 không?","Cả hai đều lớn hơn 0 nên còn 2. Đã đủ giới hạn 2, yêu cầu này bị từ chối."),
I("Vẫn hàng đợi [1, 2]. Yêu cầu mới đến lúc giây 4, chỉ tính các thời điểm lớn hơn 4 - 3 = 1. Còn mấy thời điểm trong cửa sổ?",1,"Thời điểm 1 có lớn hơn 1 không?","Chỉ còn 2. Thời điểm 1 đã quá cũ, bị bỏ đi. Còn chỗ, yêu cầu được chấp nhận."),
C("Thời điểm quá cũ nằm ở đâu trong hàng đợi, và vì sao đó là chỗ dễ loại bỏ?",["Ở đầu hàng: vào trước nên cũng hết hạn trước (queue)","Ở cuối hàng","Ở giữa hàng"],0,"Yêu cầu nào đến sớm nhất thì hết hạn đầu tiên.","Queue vào trước ra trước, khớp đúng với bài toán này."),
C("Yêu cầu bị TỪ CHỐI có được ghi vào hàng đợi không? Đề không nói, đây là một quyết định nghiệp vụ.",["Không: chỉ ghi các yêu cầu đã được chấp nhận, và ta ghi giả định này ra","Có: mọi yêu cầu đều ghi","Tùy hứng"],0,"Nếu yêu cầu bị từ chối vẫn bị tính, người dùng gửi dồn dập sẽ bị khóa mãi mãi.","Ta chọn: chỉ tính yêu cầu đã chấp nhận. Quan trọng là giả định được ghi ra và có test bảo vệ."),
RF("Tự giải thích bằng lời: vì sao rate limiter dùng queue? Và vì sao thời điểm cũ phải bị bỏ khỏi hàng?")]};
mk("w12","Mini project 3, Code 12: allowed_requests (giới hạn tốc độ của API)","allowed_requests","times, limit, window",
"Viết hàm allowed_requests(times, limit, window). times là list các thời điểm (số nguyên giây) của các yêu cầu, không giảm dần. Một yêu cầu tại thời điểm t được chấp nhận nếu số yêu cầu ĐÃ ĐƯỢC CHẤP NHẬN trước đó có thời điểm lớn hơn t - window ít hơn limit. Trả về list True/False cho từng yêu cầu. times không phải list thì báo TypeError. limit hoặc window không phải số nguyên dương, hoặc times chứa phần tử không phải số nguyên, hoặc times giảm dần thì báo ValueError.",
[["Đề chưa nói: yêu cầu bị từ chối có tính vào giới hạn không?",["Không tính. Ta ghi giả định rõ ràng rồi hỏi lại người đặt yêu cầu","Chắc chắn có tính","Không cần quan tâm"],0,"Hai cách hiểu cho ra kết quả khác nhau, nên phải ghi giả định ra."],
["times = [3, 1] (thời gian đảo ngược). Hàm nên làm gì?",["Báo ValueError: dữ liệu thời gian sai thứ tự","Âm thầm sắp xếp lại","Bỏ qua yêu cầu thứ hai"],0,"Log bị đảo thứ tự thường là dấu hiệu hệ thống đang hỏng. Che đi thì rất khó tìm nguyên nhân."],
["Vì sao dùng queue thay vì stack để giữ các thời điểm?",["Cần bỏ thời điểm cũ nhất, tức vào trước thì ra trước","Cần bỏ thời điểm mới nhất","Không có khác biệt"],0,"Thời điểm nào hết hạn trước?"],TF],
`def allowed_requests(times, limit, window):
    if not isinstance(times, list):
        raise TypeError("times phai la list")
    if not isinstance(limit, int) or not isinstance(window, int) or limit <= 0 or window <= 0:
        raise ValueError("limit va window phai la so nguyen duong")
    if any([not isinstance(t, int) for t in times]):
        raise ValueError("moi moc thoi gian phai la so nguyen")
    if any([times[i] > times[i + 1] for i in range(len(times) - 1)]):
        raise ValueError("thoi gian phai khong giam")
    q = []
    result = []
    for t in times:
        while q and q[0] <= t - window:
            q.pop(0)
        if len(q) < limit:
            q.append(t)
            result.append(True)
        else:
            result.append(False)
    return result
`,[["allowed_requests([], 2, 3)","[]"],["allowed_requests([1], 1, 5)","[True]"],["allowed_requests([1, 2, 3, 4], 2, 3)","[True, True, False, True]"],["allowed_requests([5, 5, 5], 2, 10)","[True, True, False]"],["allowed_requests([1, 10], 1, 5)","[True, True]"],["allowed_requests([1, 2, 3], 1, 2)","[True, False, True]"]],
[["allowed_requests(None, 1, 1)","TypeError"],["allowed_requests('x', 1, 1)","TypeError"],["allowed_requests([1], 0, 5)","ValueError"],["allowed_requests([1], 1, -1)","ValueError"],["allowed_requests([1], 'a', 1)","ValueError"],["allowed_requests([3, 1], 1, 5)","ValueError"],["allowed_requests(['a'], 1, 5)","ValueError"]]);
scaf("w12",3,"Ít (tự làm, mình chỉ hỗ trợ khi bạn bấm Cần giúp)",
[["Chặn đầu vào xấu: times là list, limit và window là số nguyên dương, thời gian không giảm","Dữ liệu nào làm hàm chạy sai hoặc chạy ra kết quả vô nghĩa?"],["Tạo hàng đợi rỗng chứa thời điểm các yêu cầu đã được chấp nhận","Cần nhớ gì về quá khứ?"],["Với mỗi yêu cầu, bỏ các thời điểm quá cũ ở đầu hàng","Thời điểm nào không còn nằm trong cửa sổ?"],["Còn chỗ trong hàng thì chấp nhận và ghi thời điểm vào hàng","Số thời điểm trong hàng so với limit?"],["Hết chỗ thì từ chối, KHÔNG ghi vào hàng","Yêu cầu bị từ chối có tính không? Nhớ giả định đã ghi."],["Trả về danh sách kết quả","Mỗi yêu cầu cho ra một giá trị gì?"]],
"# Lần này test do bạn tự viết. Nhớ test các ca xấu và ca yêu cầu bị từ chối không bị tính. Cần giúp thì bấm nút.\n"+HP,
"def allowed_requests(times, limit, window):\n    pass\n",
"Nhớ bài rl1: hàng đợi giữ các thời điểm đã chấp nhận. Trước mỗi yêu cầu, bỏ các thời điểm quá cũ ở đầu hàng.",
"def allowed_requests(times, limit, window):\n    q = []\n    result = []\n    for t in times:\n        while q and q[0] <= t - ___:\n            q.pop(___)\n        if len(q) < ___:\n            q.append(t)\n            result.append(___)\n        else:\n            result.append(___)\n    return result",
["Queue lấy phần tử nào ra trước?",["Phần tử vào trước nhất","Phần tử vào sau cùng","Phần tử lớn nhất"],0,"Nhớ xếp hàng mua vé."]);
LES.w12.steps.filter(x=>x.k=="code")[0].hp=["Liệt kê các ca xấu bạn đã viết test: times không phải list, limit hoặc window không dương hoặc không phải số nguyên, phần tử không phải số nguyên, thời gian giảm dần. Mỗi ca cần một dòng if rồi raise.","Mẫu:\nif not isinstance(times, list):\n    raise TypeError(\"times phai la list\")\nif not isinstance(limit, int) or not isinstance(window, int) or limit <= 0 or window <= 0:\n    raise ValueError(\"limit va window phai la so nguyen duong\")","Lời giải tham khảo (phần hàng rào):\n"+LES.w12.ref.split("    q = []")[0]];
addRev(["w12",["O(n), mỗi yêu cầu vào hàng đợi và ra khỏi hàng đợi nhiều nhất một lần","giới hạn tốc độ của API, chống đoán mật khẩu liên tục, chống spam tin nhắn"]],11);
/* ===== Mẫu giáo: trước khi có máy tính. Không giả định người học biết gì ===== */
const TP=(q,a,s)=>({k:"tap",q,arr:a,noidx:1,s,h:"Chạm vào từng vật một, mỗi vật chỉ chạm một lần, rồi nhìn số hiện dưới vật."});
const SH=(a)=>({arr:a,noidx:1});
const rep=(e,n)=>Array(n).fill(e);
LES.k1={t:"Đếm: mỗi vật một con số",steps:[
TP("Đây là mấy quả táo. Em chạm vào từng quả một. Mỗi lần chạm, dưới quả táo hiện số tiếp theo: 1, 2, 3... Chạm hết là xong.",rep("🍎",3),"Đếm là cho mỗi vật đúng một số, lần lượt."),
{...I("Có tất cả mấy quả táo? Gợi ý: số cuối cùng em vừa đọc chính là câu trả lời.",3,"Quả cuối cùng mang số mấy?","Số cuối cùng cho biết có bao nhiêu vật."),...SH(rep("🍎",3))},
TP("Bây giờ là các ngôi sao. Chạm từng ngôi sao một.",rep("⭐",5),"Đếm 5 ngôi sao."),
{...I("Có mấy ngôi sao?",5,"Số cuối cùng khi chạm xong.","Có 5 ngôi sao."),...SH(rep("⭐",5))},
C("Nếu em chạm một quả táo hai lần thì kết quả đếm có đúng không?",["Sai, vì có quả bị đếm hai lần","Vẫn đúng"],0,"Mỗi vật chỉ được đếm một lần.","Đếm đúng là mỗi vật một lần, không sót, không trùng. Sau này ta gọi là duyệt từng phần tử."),
I("🐶 🐶 🐶 🐶  Có mấy con chó?",4,"Chỉ vào từng con và đếm.","Có 4 con."),
I("🍎 🍎  Có mấy quả chuối?",0,"Em có thấy quả chuối nào không?","Không có quả nào thì số là 0. Số 0 nghĩa là 'không có gì'.")],dr:"dem"};
LES.k2={t:"Nhiều hơn, ít hơn, bằng nhau",steps:[
C("🍎 🍎 🍎  và  🍎 🍎 🍎 🍎 🍎. Bên nào nhiều hơn?",["Bên có 3 quả","Bên có 5 quả","Bằng nhau"],1,"Đếm từng bên, rồi so hai số.","Đếm xong mới so: 5 nhiều hơn 3."),
C("🍌 🍌 🍌 🍌  và  🍌 🍌. Bên nào ÍT hơn?",["Bên có 4 quả","Bên có 2 quả","Bằng nhau"],1,"Ít hơn là số nhỏ hơn.","2 ít hơn 4."),
C("⭐ ⭐  và  🌙 🌙. Hai bên thế nào?",["Sao nhiều hơn","Trăng nhiều hơn","Bằng nhau"],2,"Đếm từng bên: có hai con số giống nhau không?","Cả hai bên đều 2, bằng nhau."),
I("Số nào lớn hơn: 7 hay 4? Gõ số lớn hơn.",7,"Số lớn hơn là số chỉ nhiều hơn.","7 lớn hơn 4."),
C("Dấu > giống cái miệng cá sấu, miệng há về phía số lớn hơn. 7 > 4 có đúng không?",["Đúng, miệng há về phía 7","Sai"],0,"Miệng cá sấu há về phía bên nào lớn hơn?","7 > 4 đúng. Sau này máy hỏi 'x > best' là hỏi đúng câu này."),
C("9 > 12 đúng hay sai?",["Đúng","Sai"],1,"9 và 12, số nào lớn hơn?","12 lớn hơn 9 nên 9 > 12 là sai."),
C("5 > 5 đúng hay sai? Hai bên bằng nhau.",["Sai, vì 5 không lớn hơn 5","Đúng"],0,"Lớn hơn nghĩa là phải nhiều hơn thật sự.","Bằng nhau thì chưa phải lớn hơn. Chỗ này sau này gây rất nhiều lỗi trong code.")]};
LES.k3={t:"Thứ tự, và vì sao máy đếm từ 0",steps:[
C("Bốn bạn xếp hàng 👧 👦 🧒 👶. Bạn đứng đầu hàng là bạn thứ mấy, khi đếm như thường ngày?",["Thứ nhất","Thứ hai","Thứ không"],0,"Người đầu tiên.","Thường ngày ta đếm: thứ nhất, thứ hai..."),
I("Bạn đứng thứ nhất có mấy người đứng TRƯỚC mình?",0,"Đứng đầu hàng, phía trước có ai không?","Không có ai, tức là 0 người."),
I("Bạn đứng thứ hai có mấy người đứng trước?",1,"Phía trước chỉ có bạn đầu hàng.","1 người."),
I("Bạn đứng thứ năm có mấy người đứng trước?",4,"Thứ năm thì trước đó có 4 bạn.","4 người."),
C("Máy tính không hỏi 'thứ mấy', mà hỏi 'có mấy người đứng trước'. Gọi như vậy thì bạn đầu hàng mang số mấy?",["0","1"],0,"Bạn đầu hàng có mấy người đứng trước?","Số này gọi là chỉ số (index). Chỉ số = số người đứng trước. Vì thế máy đếm từ 0, đây không phải điều kỳ lạ."),
{k:"click",q:"Bốn bạn dưới đây. Mỗi bạn mang số = số người đứng trước. Bấm vào bạn mang số 2.",arr:["👧","👦","🧒","👶"],noidx:1,a:2,h:"Số 2 nghĩa là phía trước có 2 bạn. Đứng ở đâu thì có 2 bạn đứng trước?",s:"Bạn thứ ba trong hàng mang số 2."},
I("Hàng có 5 bạn. Bạn cuối cùng mang số mấy?",4,"Phía trước bạn cuối có mấy bạn?","Bạn cuối có 4 bạn đứng trước nên mang số 4. Hàng n bạn thì bạn cuối mang số n - 1.")],dr:"tt"};
LES.k4={t:"Cái tên và cái hộp",steps:[
C("Có 3 hộp giống hệt nhau, đều đựng đồ. Làm sao em tìm đúng hộp đựng bút?",["Dán nhãn tên lên mỗi hộp","Mở hộp ngẫu nhiên","Nhớ trong đầu"],0,"Nếu có 100 hộp thì nhớ trong đầu có ổn không?","Ta dán nhãn. Cái nhãn là tên của hộp."),
C("Hộp có nhãn 'bút' đang chứa cây ✏️. Đâu là tên, đâu là thứ bên trong?",["Nhãn là tên, ✏️ là thứ bên trong","Nhãn là thứ bên trong"],0,"Cái dán bên ngoài hộp là gì?","Tên nằm ngoài, đồ nằm trong."),
C("Em thay ✏️ bằng 🖊️ trong hộp 'bút'. Cái nhãn 'bút' có đổi không?",["Không, nhãn giữ nguyên, chỉ thứ bên trong đổi","Có, nhãn đổi theo"],0,"Em có cần dán nhãn mới không?","Đây chính là biến: tên giữ nguyên, giá trị bên trong có thể đổi."),
I("Hộp 'tuổi' đang chứa số 10. Sang năm cộng thêm 1. Hộp 'tuổi' giờ chứa số mấy?",11,"10 thêm 1.","11. Hộp giữ nguyên tên, đổi số bên trong."),
I("Hộp 'a' chứa 5, hộp 'b' chứa 3. Đổ hết cả hai vào hộp 'c'. Hộp 'c' chứa mấy?",8,"Gộp 5 và 3.","8."),
C("Hai hộp khác tên có thể cùng chứa số 4 không?",["Có, tên khác nhau không bắt buộc đồ khác nhau","Không"],0,"Tên là để gọi hộp, đâu có nói bên trong chứa gì.","Có. Tên chỉ để tìm hộp.")]};
LES.k5={t:"Máy chỉ làm đúng từng lệnh",steps:[
{k:"order",ph:"Luyện làm theo thứ tự",q:"Sắp xếp việc đánh răng theo thứ tự thực hiện.",items:[["Cầm bàn chải","Em cần có gì trong tay trước tiên?"],["Bóp kem lên bàn chải","Có bàn chải rồi, cần thêm gì?"],["Chải răng","Có kem rồi thì làm gì?"],["Súc miệng","Chải xong thì làm gì?"]],s:"Đã sắp đúng thứ tự"},
C("Em nhờ người máy: 'Đi lấy cốc nước'. Người máy đứng im. Vì sao?",["Máy chỉ làm đúng điều ta nói rõ từng bước, không tự đoán","Máy lười"],0,"Máy có biết 'cốc' ở đâu không?","Máy không đoán ý. Ta phải nói rõ từng bước."),
C("Cách nào nói với người máy tốt hơn?",["Bước 1 bước, bước 1 bước nữa, rồi dừng","Đi lại gần cái bàn đi"],0,"Máy hiểu 'gần' là bao xa?","Lệnh rõ, nhỏ, làm được ngay thì máy mới làm đúng."),
{k:"order",ph:"Luyện làm theo thứ tự",q:"Sắp xếp việc làm bánh mì kẹp bơ.",items:[["Lấy hai lát bánh mì","Cần nguyên liệu gì trước?"],["Phết bơ lên một lát","Có bánh rồi, làm gì với bơ?"],["Úp lát kia lên","Đã phết bơ xong, ghép thế nào?"],["Cắt đôi và ăn","Ghép xong rồi thì sao?"]],s:"Đã sắp đúng thứ tự"},
RF("Tự nghĩ và viết ra: các bước đi từ giường ra tới cửa phòng ngủ, rõ đến mức người máy làm được. (Viết thô cũng được. Đây là bước đầu của việc viết thuật toán.)")]};
LES.k6={t:"Nếu... thì...",steps:[
C("Luật: nếu trời mưa thì mang ô. Hôm nay trời mưa. Em làm gì?",["Mang ô","Không mang ô"],0,"Điều kiện 'trời mưa' có xảy ra không?","Điều kiện đúng thì làm việc đó."),
C("Luật mới: nếu trời mưa thì mang ô, nếu không thì đội mũ. Hôm nay trời nắng. Em làm gì?",["Đội mũ","Mang ô"],0,"Trời mưa không? Vậy chạy vế nào?","Điều kiện sai thì chạy vế 'nếu không'. Sau này gọi là if và else."),
C("Luật: nếu điểm lớn hơn 5 thì 'đạt', nếu không thì 'chưa đạt'. Điểm là 8. Kết quả?",["đạt","chưa đạt"],0,"8 lớn hơn 5 không?","Đạt."),
C("Cùng luật đó, điểm là 5. Kết quả?",["chưa đạt, vì 5 không lớn hơn 5","đạt"],0,"Nhớ bài trước: 5 > 5 đúng hay sai?","Đây là ca biên: đúng bằng ngưỡng. Luật 'lớn hơn' khác với 'lớn hơn hoặc bằng'."),
C("Luật sửa lại: nếu điểm lớn hơn hoặc bằng 5 thì 'đạt'. Điểm 5 thì sao?",["đạt","chưa đạt"],0,"Bằng 5 có thỏa 'lớn hơn hoặc bằng 5' không?","Đạt. Một chữ trong luật đổi thì kết quả đổi.")]};
LES.k7={t:"Lặp lại, và phải biết dừng",steps:[
I("Em vỗ tay 3 lần. Tổng cộng em vỗ tay mấy cái?",3,"Mỗi lần một cái.","3 cái."),
I("Lặp 4 lần việc: 'thêm 2 viên bi vào hộp'. Hộp ban đầu rỗng. Cuối cùng có mấy viên bi?",8,"2, rồi 4, rồi 6, rồi...","2 + 2 + 2 + 2 = 8."),
C("Lặp việc 'cắn một miếng bánh' cho đến khi hết bánh. Bánh có 5 miếng. Em cắn mấy lần?",["5 lần","1 lần","Mãi mãi"],0,"Mỗi lần mất một miếng.","Cắn 5 lần thì hết."),
C("Cái bánh thần kỳ: cắn một miếng thì nó mọc lại miếng mới. Em lặp 'cắn cho đến khi hết bánh' thì sao?",["Lặp mãi không dừng","Dừng sau 5 lần"],0,"Bánh có bao giờ hết không?","Việc lặp phải làm cho điều kiện dừng tiến lại gần. Nếu không thì lặp vô hạn."),
I("Em đi từ số 1 lên số 6 bằng cách lặp 'cộng thêm 1'. Phải lặp mấy lần?",5,"1 sang 2 là lần 1. Đếm tiếp tới 6.","5 lần. Số lần lặp không phải lúc nào cũng bằng số cuối.")]};
LES.k8={t:"Tìm quy luật",steps:[
C("🔴 🔵 🔴 🔵 🔴 ?  Hình tiếp theo là gì?",["🔵","🔴"],0,"Nhìn xem điều gì lặp lại.","Đỏ, xanh, đỏ, xanh... tiếp theo là xanh."),
C("⭐ ⭐ 🌙 ⭐ ⭐ 🌙 ⭐ ⭐ ?  Hình tiếp theo?",["🌙","⭐"],0,"Cụm nào đang lặp lại?","Cụm ⭐⭐🌙 lặp lại. Sau hai sao là trăng."),
I("2, 4, 6, 8, ?  Số tiếp theo?",10,"Mỗi số hơn số trước bao nhiêu?","Mỗi lần cộng 2."),
I("1, 2, 4, 8, ?  Số tiếp theo?",16,"Mỗi số gấp mấy lần số trước?","Mỗi lần nhân đôi."),
C("Em 'tìm ra quy luật' khi nào?",["Khi nhìn ra điều giống nhau lặp lại mỗi lần","Khi đoán may mắn"],0,"Đoán đúng một lần thì có chắc là hiểu không?","Thấy được cái lặp lại là bước đầu để viết thành lệnh cho máy."),
RF("Tự đặt một dãy có quy luật để bạn mình đoán. Viết dãy đó và viết ra quy luật của nó.")]};
LES.k9={t:"Cầu nối: nói chuyện với máy",steps:[
C("Máy viết: x = 5.  Theo em, câu này đọc là gì?",["Hộp tên x đang chứa số 5","x và 5 là hai bạn","Xóa x đi"],0,"Nhớ bài cái tên và cái hộp.","Máy dùng dấu = để bỏ một giá trị vào hộp có tên."),
C("Máy viết: print(x).  'print' nghĩa là 'in ra cho em xem'. Máy sẽ làm gì?",["Cho em xem thứ đang nằm trong hộp x","Xóa hộp x"],0,"In ra là cho nhìn thấy.","Máy cho ta xem giá trị trong hộp."),
I("Máy viết: x = 5, rồi dòng sau: x = 9.  Hộp x giờ chứa mấy?",9,"Dòng sau đè lên dòng trước.","Hộp giữ nguyên tên, thứ bên trong bị thay bằng 9."),
C("Máy viết: a[0]. Nhớ bài thứ tự: số trong ngoặc là số người đứng trước. Vậy a[2] là bạn thứ mấy khi đếm như thường ngày?",["Thứ ba","Thứ hai"],0,"Có 2 bạn đứng trước thì mình là thứ mấy?","a[2] là phần tử thứ ba. Giờ em đã sẵn sàng sang Python thật.")]};
DR.dem=()=>{const E=["🍎","⭐","🐟","🌸"],e=E[rnd(4)-1],n=rnd(9);return{c:Array(n).fill(e).join(" "),q:"Có bao nhiêu hình trong dòng trên?",a:n,w:`Đếm từng hình một, mỗi hình một lần: có ${n}.`}};
DR.tt=()=>{const n=rnd(8)+1,k=rnd(n);return{q:`Hàng có ${n} bạn. Bạn đứng thứ ${k} (đếm như thường ngày) mang số mấy, nếu số = số người đứng trước?`,a:k-1,w:`Phía trước bạn thứ ${k} có ${k-1} bạn, nên mang số ${k-1}.`}};
const esc=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
function buildUI(st){let got=[],bad=0;const A=st.ans,T=st.tok;
const rd=()=>{const used=new Set(got);
$("#in").innerHTML=`<div class="bline">${A.map((_,i)=>`<div class="slotw"><span class="slot ${got[i]!==undefined?"f":""}">${got[i]!==undefined?esc(T[got[i]]):"&nbsp;"}</span><small>${st.guided&&st.roles?st.roles[i]:""}</small></div>`).join("")}</div><div class="opts">${T.map((t,i)=>used.has(i)?"":`<button class="tk" data-t="${i}">${esc(t)}</button>`).join("")}</div><p><button class="ghost" id="un">Xóa mảnh cuối</button> <button class="ghost" id="rs">Làm lại</button> <button class="go" id="ck" ${got.length<A.length?"disabled":""}>Kiểm tra</button></p>`;
$("#in").querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{if(got.length<A.length){got.push(+b.dataset.t);rd()}});
$("#un").onclick=()=>{got.pop();rd()};$("#rs").onclick=()=>{got=[];rd()};
$("#ck").onclick=()=>{const seq=got.map(i=>T[i]),j=seq.findIndex((t,i)=>t!==A[i]);
if(j<0){fb("Đúng. Đọc to lên: <i>"+st.say+"</i>. Thứ tự và vai trò từng chỗ đều khớp.",1);setTimeout(()=>pass(st),1500);return}
bad++;let m=`Chưa đúng. Chỗ thứ ${j+1} chưa hợp lý. `+(st.roles&&st.guided?`Chỗ này cần: ${st.roles[j]}.`:"Đọc cả dòng thành lời xem có nghĩa không, rồi thử đổi chỗ.");
if(bad>=3)m+=` <button class="ghost" id="rv">Xem đáp án</button>`;fb(m);
if(bad>=3)$("#rv").onclick=()=>{fb("Đáp án: <code>"+esc(st.show)+"</code>. Hãy tự ghép lại một lần nữa cho nhớ.",1);setTimeout(()=>pass(st,1),3200)}}};
rd()}
/* ===== Xưởng ghép câu lệnh: biết các mảnh chưa đủ, phải biết thứ tự và vai trò từng chỗ ===== */
const BD=(q,tok,ans,roles,guided,say,show)=>({k:"build",q,tok,ans,roles,guided,say,show,s:"Đã ghép đúng: "+esc(show),h:"Đọc to câu bằng lời trước, rồi đặt từng mảnh vào đúng chỗ. Mỗi chỗ có một vai trò riêng."});
const CD=t=>`<code>${t}</code>`;
const PI=(t,n,h)=>[CD("&nbsp;".repeat(n)+esc(t)),h];
LES.bx0={t:"Viết cũng có thứ tự: từ 1 + 1 = 2",steps:[
BD("Em biết 'một cộng một bằng hai'. Giờ hãy VIẾT nó ra. Có 5 mảnh, mỗi chỗ có một vai trò (ghi dưới ô). Đặt từng mảnh vào ô.",["=","1","2","+","1"],["1","+","1","=","2"],["số thứ nhất","dấu phép tính","số thứ hai","dấu bằng","kết quả"],1,"một cộng một bằng hai","1 + 1 = 2"),
C("Ba bạn cùng viết 'một cộng một bằng hai'. Bạn nào viết đúng?",["+ 1 + = 2","1 1 + = 2","1 + 1 = 2"],2,"Đọc to từng dòng. Dòng nào đọc ra 'một cộng một bằng hai'?","Cả ba bạn đều dùng đúng các mảnh, nhưng chỉ một dòng đúng thứ tự. Biết mảnh chưa đủ: còn phải biết mỗi chỗ cần mảnh gì."),
BD("Lần này không có ghi chú vai trò. Tự đặt các mảnh để viết 'ba cộng bốn bằng bảy'. Có một mảnh thừa.",["7","=","-","4","3","+"],["3","+","4","=","7"],null,0,"ba cộng bốn bằng bảy","3 + 4 = 7"),
RF("Tự nghĩ và viết ra: vì sao một bạn biết đủ các mảnh 1, +, =, 2 mà vẫn có thể viết sai? Để viết đúng, bạn ấy cần biết thêm những gì? (Đây cũng chính là điều bạn cần khi viết code.)")]};
LES.b1={t:"Ghép câu lệnh: hộp, tính toán, in ra",steps:[
C("Python đọc 'bỏ số 5 vào hộp tên x' và viết là x = 5. Ở bên TRÁI dấu = là gì?",["Tên hộp","Số để bỏ vào"],0,"Nhớ bài cái tên và cái hộp: tên nằm ở đâu?","Bên trái là tên hộp, bên phải là thứ bỏ vào."),
BD("Ghép câu lệnh 'bỏ 5 vào hộp x'.",["5","=","x"],["x","=","5"],["tên hộp","dấu gán (bỏ vào)","giá trị"],1,"bỏ 5 vào hộp x","x = 5"),
C("Dòng nào Python hiểu?",["5 = x","x = 5","x 5 ="],1,"Đọc to theo vai trò: bên trái phải là tên hộp.","Không thể đặt tên hộp là số 5. Vai trò từng chỗ cố định."),
BD("Ghép: 'lấy x cộng 2, bỏ vào hộp y'.",["+","2","=","y","x"],["y","=","x","+","2"],["tên hộp nhận kết quả","dấu gán","hộp cần đọc","phép cộng","số cộng thêm"],1,"bỏ (x cộng 2) vào hộp y","y = x + 2"),
BD("Không còn ghi chú. Ghép: 'tăng hộp x lên 1' (lấy x cộng 1, bỏ lại vào chính hộp x).",["x","=","1","+","x"],["x","=","x","+","1"],null,0,"bỏ (x cộng 1) vào hộp x","x = x + 1"),
BD("Ghép lệnh in giá trị trong hộp x ra màn hình.",["(",")","print","x"],["print","(","x",")"],["lệnh 'in ra'","mở ngoặc","thứ muốn in","đóng ngoặc"],1,"in giá trị của x","print ( x )"),
C("Em quên dấu ) cuối dòng print(x. Python làm gì?",["Báo SyntaxError: ngoặc mở mà chưa đóng, Python chưa hiểu câu","Vẫn chạy bình thường"],0,"Mở ngoặc thì phải đóng.","Mỗi ngoặc mở cần một ngoặc đóng. Thiếu là SyntaxError.")]};
LES.b2={t:"Ghép if / else và vì sao phải thụt dòng",steps:[
BD("Ghép dòng 'nếu n lớn hơn 3 thì'.",[":","3",">","n","if"],["if","n",">","3",":"],["từ khóa 'nếu'","thứ đem ra so","dấu so sánh","thứ để so","dấu hai chấm: mở khối việc cần làm"],1,"nếu n lớn hơn 3 thì","if n > 3 :"),
C("Dòng nào viết đúng?",["if n > 3","if n > 3:","n > 3: if"],1,"Cuối dòng if cần có gì?","Dòng if luôn kết thúc bằng dấu hai chấm. Thiếu thì SyntaxError."),
{k:"order",ph:"Ghép cả chương trình, từng dòng",q:"Chọn dòng tiếp theo, từ trên xuống. (Độ thụt dòng đã được viết sẵn, nhìn kỹ.)",items:[PI("if n > 3:",0,"Chương trình bắt đầu bằng việc đặt câu hỏi nào?"),PI('print("A")',4,"Điều kiện đúng thì làm gì? Dòng này thuộc về if."),PI("else:",0,"Điều kiện sai thì làm vế nào?"),PI('print("B")',4,"Vế else làm gì?")],s:"Đã ghép đúng cả khối if/else"},
C("Dòng print(\"A\") thụt vào 4 dấu cách. Thụt vào để làm gì?",["Nói cho Python biết dòng này thuộc về if ở trên","Cho đẹp mắt"],0,"Nếu không thụt, Python biết dòng nào thuộc if bằng cách nào?","Python dùng độ thụt để biết dòng nào nằm trong khối nào. Đây là quy định, không chỉ để đẹp.")]};
LES.b3={t:"Ghép vòng lặp và vị trí từng dòng",steps:[
BD("Ghép dòng 'lặp, mỗi lần gọi số hiện tại là i, qua các số 0, 1, 2'.",[":","3","range","(",")","in","i","for"],["for","i","in","range","(","3",")",":"],["từ khóa 'lặp'","tên cho mỗi lần lặp","từ khóa 'trong'","tạo dãy số","mở ngoặc","số lần","đóng ngoặc","dấu hai chấm"],1,"lặp, i đi qua các số từ range(3)","for i in range ( 3 ) :"),
{k:"order",ph:"Ghép cả chương trình, từng dòng",q:"Chương trình cộng 0 + 1 + 2 + 3 rồi in tổng. Chọn dòng tiếp theo.",items:[PI("total = 0",0,"Tờ giấy ghi tổng phải có từ lúc nào?"),PI("for i in range(4):",0,"Có tờ giấy rồi thì làm gì?"),PI("total = total + i",4,"Mỗi vòng làm gì? Dòng này thuộc về for."),PI("print(total)",0,"Lặp xong thì làm gì?")],s:"Đã ghép đúng chương trình tính tổng"},
C("Vì sao total = 0 nằm TRÊN vòng for, không nằm trong vòng for?",["Nếu nằm trong, mỗi vòng lại đặt về 0 và mất tổng đã cộng","Cho đẹp mắt"],0,"Thử chạy vòng 2 nếu mỗi vòng đều đặt total về 0.","Việc chuẩn bị làm một lần, trước khi lặp.")]};
LES.b4={t:"Ghép hàm: def, return, và lúc gọi hàm",steps:[
BD("Ghép dòng 'tạo hàm tên gap_doi, nhận vào x'.",[":","x","(",")","gap_doi","def"],["def","gap_doi","(","x",")",":"],["từ khóa 'tạo hàm'","tên hàm","mở ngoặc","tên đầu vào","đóng ngoặc","dấu hai chấm"],1,"tạo hàm gap_doi nhận x","def gap_doi ( x ) :"),
BD("Ghép dòng 'trả ra x nhân 2'.",["2","*","x","return"],["return","x","*","2"],["trả kết quả ra","thứ đem tính","phép nhân","số nhân"],1,"trả ra x nhân 2","return x * 2"),
{k:"order",ph:"Ghép cả chương trình, từng dòng",q:"Chọn dòng tiếp theo. Nhớ: tạo hàm trước, rồi mới gọi hàm.",items:[PI("def gap_doi(x):",0,"Phải tạo cái máy trước khi dùng. Dòng nào tạo máy?"),PI("return x * 2",4,"Cái máy làm gì với x? Dòng này thuộc về hàm."),PI("print(gap_doi(4))",0,"Máy làm xong thì dùng nó. Dòng này nằm ngoài hàm.")],s:"Đã ghép đúng: tạo hàm, rồi gọi hàm"},
C("Dòng print(gap_doi(4)) không thụt vào. Vì sao?",["Nó nằm ngoài hàm: đây là lúc GỌI hàm, không phải bên trong hàm","Quên thụt"],0,"Dòng nào thuộc về hàm thì thụt vào.","Phần định nghĩa hàm thụt vào, còn việc dùng hàm nằm ngoài.")]};
LES.b5={t:"Ghép ký hiệu của list",steps:[
BD("Ghép 'lấy hộp số 0 của hàng hộp a'.",["]","0","[","a"],["a","[","0","]"],["tên hàng hộp","mở ngoặc vuông","chỉ số","đóng ngoặc vuông"],1,"hộp số 0 của a","a [ 0 ]"),
BD("Ghép 'bỏ số 9 vào hộp số 1 của a'.",["9","=","]","1","[","a"],["a","[","1","]","=","9"],["tên hàng hộp","mở ngoặc vuông","chỉ số","đóng ngoặc vuông","dấu gán","giá trị"],1,"bỏ 9 vào hộp số 1 của a","a [ 1 ] = 9"),
BD("Ghép 'đếm có bao nhiêu hộp trong a'.",["(",")","a","len"],["len","(","a",")"],null,0,"độ dài của a","len ( a )"),
BD("Ghép 'lặp qua từng số x trong hàng a'.",[":","a","in","x","for"],["for","x","in","a",":"],["từ khóa 'lặp'","tên cho mỗi số","từ khóa 'trong'","hàng hộp","dấu hai chấm"],1,"lặp, x là từng số trong a","for x in a :"),
C("for x in a: khác for i in range(len(a)): ở chỗ nào?",["x là chính số trong hộp, còn i là số thứ tự của hộp","Giống hệt nhau"],0,"Một cái đưa ra thứ bên trong hộp, một cái đưa ra số thứ tự.","x là giá trị, i là chỉ số. Chọn cái nào tùy việc cần làm.")]};
LES.b6={t:"Từ tờ giấy nhớ đến từng dòng code",steps:[
C("Bài 'tờ giấy nhớ' ghi số lớn nhất đã thấy. Trong code, tờ giấy đó là gì?",["Một biến, ví dụ best","Một hàm","Một vòng lặp"],0,"Nhớ bài cái tên và cái hộp: thứ giữ giá trị và đổi được là gì?","Tờ giấy là một biến."),
{k:"order",ph:"Ghép cả hàm, từng dòng",q:"Chọn dòng tiếp theo của hàm find_max. Hãy đối chiếu với bài tờ giấy nhớ.",items:[PI("def find_max(nums):",0,"Phải tạo hàm trước. Dòng nào tạo hàm?"),PI("best = nums[0]",4,"Tờ giấy ghi gì lúc đầu?"),PI("for x in nums:",4,"Có tờ giấy rồi thì làm gì với từng hộp?"),PI("if x > best:",8,"Với mỗi hộp, hỏi câu gì?"),PI("best = x",12,"Hộp lớn hơn thì làm gì với tờ giấy?"),PI("return best",4,"Xét hết hộp rồi thì đưa ra gì?")],s:"Đã ghép đúng cả hàm find_max"},
C(P_("def find_max(nums):\n    best = nums[0]\n    for x in nums:")+"Hàm đang viết dở. Dòng TIẾP THEO (thụt thêm 4 dấu cách) nên làm gì?",["So x với best","return best","Tạo hàm mới"],0,"Ở trong vòng lặp, mỗi lần x là một hộp. Ta làm gì với hộp?","Bên trong vòng lặp là việc làm với từng hộp: so sánh x với best."),
C("Em quên thụt dòng best = x vào trong if (nó nằm thẳng hàng với if). Chuyện gì xảy ra?",["best bị ghi đè ở MỌI vòng lặp, kết quả là số cuối cùng chứ không phải số lớn nhất","Vẫn chạy đúng như cũ"],0,"Dòng không thụt thì thuộc về khối nào?","Độ thụt quyết định dòng đó chạy khi nào. Thụt sai là lỗi logic, Python không báo gì cả."),
BD("Ghép dòng 'nếu x lớn hơn best thì'. Lần này không có ghi chú.",[":","best",">","x","if"],["if","x",">","best",":"],null,0,"nếu x lớn hơn best thì","if x > best :"),
RF("Tự kể bằng lời: khi viết một hàm, em làm theo thứ tự nào, dòng nào trước, dòng nào sau, và vì sao dòng best = nums[0] phải đứng trước vòng for? (Không có đáp án đúng sai, quan trọng là em nói được thứ tự và lý do.)")]};
Object.assign(NEW,{
h1:["Bảng tra: tên đi với giá trị",[C(`${P_('tuoi = {"An": 10, "Binh": 12}\nprint(tuoi["An"])')}Dòng print in ra gì?`,["10","12","An"],0,"Trong dấu [ ] là chìa khóa (key). Chìa khóa An mở ra giá trị nào?","tuoi[\"An\"] lấy giá trị đi với key An: 10."),I(`${P_('tuoi = {"An": 10, "Binh": 12}\nprint(tuoi["Binh"])')}In ra số mấy?`,12,"Tìm key Binh trong bảng.","Key Binh đi với 12."),C("Dictionary khác list ở điểm nào?",["Tra bằng key có nghĩa, không phải số thứ tự","Chỉ chứa số","Luôn sắp từ nhỏ đến lớn"],0,"List tra bằng chỉ số 0, 1, 2. Còn dictionary?","Dictionary tra bằng key tự chọn."),I(`${P_('tuoi = {"An": 10}\ntuoi["Binh"] = 12\nprint(len(tuoi))')}In ra mấy?`,2,"Dòng thứ hai thêm một cặp mới.","Thêm key mới làm bảng có 2 cặp.")]],
h2:["Đếm bằng bảng tra",[I(`${P_('d = {}\nd["a"] = 1\nd["a"] = d["a"] + 1\nprint(d["a"])')}In ra mấy?`,2,"Dòng 3 lấy giá trị cũ rồi cộng 1.","Đếm: giá trị cũ cộng thêm 1 mỗi lần gặp."),C(`${P_('d = {}\nprint(d["x"])')}Chuyện gì xảy ra?`,["In ra 0","Báo KeyError vì chưa có key x","In ra None"],1,"Bảng đang rỗng, key x chưa tồn tại.","Key chưa có thì tra sẽ lỗi KeyError."),C("Cách an toàn để cộng đếm khi chưa chắc key đã có?",["d[k] = d.get(k, 0) + 1","d[k] = d[k] + 1","d[k] + 1"],0,"get(k, 0) trả 0 nếu chưa có key.","d.get(k, 0) cho mặc định 0, tránh KeyError."),I(`Đếm chữ trong "abca": a xuất hiện mấy lần?`,2,"Đếm từng chữ a.","a xuất hiện 2 lần.")]],
h3:["Hash map: đổi bộ nhớ lấy tốc độ",[I("Tìm một số trong list 1000 phần tử phải mở tối đa mấy hộp?",1000,"Bài tìm tuyến tính trước đó.","List: tối đa n bước."),C("Tra một key trong dictionary 1000 cặp, mất khoảng bao nhiêu bước?",["Khoảng 1 bước","Khoảng 1000 bước","Khoảng 500 bước"],0,"Dictionary nhảy thẳng tới chỗ chứa key, không mở từng hộp.","Tra dictionary trung bình O(1)."),C("Two Sum: thấy số x, cần tìm số y = target - x đã gặp chưa. Nên lưu gì vào dictionary?",["Các số đã gặp (key) và chỉ số của chúng","Chỉ target","Tổng tất cả"],0,"Cần tra nhanh 'đã gặp y chưa'.","Lưu số đã gặp: một lượt duyệt là đủ, O(n)."),I(`${P_('nums = [2, 7, 11]\ntarget = 9\nseen = {}\nfor i, x in enumerate(nums):\n    y = target - x\n    if y in seen:\n        print(seen[y], i)\n    seen[x] = i')}In ra hai số nào? Nhập chữ số ghép, ví dụ 0 và 1 thì nhập 1.`,1,"i=0: x=2, y=7 chưa thấy, lưu seen[2]=0. i=1: x=7, y=2 đã thấy ở chỉ số 0.","In ra 0 1: nhập 1 (chỉ số hiện tại).")]]});
Object.entries({h1:NEW.h1,h2:NEW.h2,h3:NEW.h3}).forEach(([id,[t,steps,dr]])=>{LES[id]={t,steps,dr}});
ids=["k1","k2","k3","k4","k5","k6","k7","k8","k9","bx0","p1","b1","p2","b2","p3","b3","p4","b4","l1","a2","a3","b5","sm","l2","l3","cn","b6","w1","w2","w3","e1","e2","e3","e4","d1","d2","h1","h2","h3","w4","w5","w6","w7","m1","m2","m3","w9","tp","stk","que","w11","rl1","w12","bs","bub","r1","r2","r3","w8","n1","n2","n3","t1","t2","g1","g2","g3","dp1","dp2","ap1","ap2","ap3","ap4","ap5","ap6","w10"];
STAGES.length=0;STAGES.push(
{n:"Mẫu giáo: trước khi có máy tính",d:"Đếm, so sánh, thứ tự, cái tên, làm theo từng bước, nếu thì, lặp lại, quy luật, rồi tập viết cho đúng thứ tự. Không cần biết gì trước",L:["k1","k2","k3","k4","k5","k6","k7","k8","k9","bx0"]},
{n:"Khởi động: Python cơ bản",d:"Biến, điều kiện, vòng lặp, hàm",L:["p1","b1","p2","b2","p3","b3","p4","b4"]},
{n:"Giai đoạn 1: Mảng",d:"Từ đọc một hộp đến viết hàm Python theo quy trình thực tế",L:["l1","a2","a3","b5","sm","l2","l3","cn","b6","w1","w2","w3"]},
{n:"Phòng đọc lỗi và debug",d:"Lỗi không đáng sợ: nó là thông tin",L:["e1","e2","e3","e4"]},
{n:"Giai đoạn 2: Bảng tra (dictionary)",d:"Đổi bộ nhớ lấy tốc độ",L:["d1","d2","h1","h2","h3","w4","w5","w6","w7"]},
{n:"Mini project 1: Xử lý giao dịch",d:"Yêu cầu, hàng rào, test, giải đề như ở công ty",L:["m1","m2","m3","w9"]},
{n:"Giai đoạn 3: Hai con trỏ",d:"Một vòng lặp thay cho hai",L:["tp"]},
{n:"Giai đoạn 4: Stack và Queue (có mini project 3)",d:"Ngoặc trong trình soạn thảo, giới hạn tốc độ của API",L:["stk","que","w11","rl1","w12"]},
{n:"Giai đoạn 5: Tìm kiếm và sắp xếp",d:"Chia đôi mỗi lần",L:["bs","bub"]},
{n:"Giai đoạn 6: Đệ quy",d:"Bài nhỏ hơn giống hệt bài lớn",L:["r1","r2","r3","w8"]},{n:"Giai đoạn 7: Linked list, cây",d:"Dữ liệu nối bằng con trỏ",L:["n1","n2","n3","t1","t2"]},{n:"Giai đoạn 8: Đồ thị, quy hoạch động",d:"Ghép tất cả lại",L:["g1","g2","g3","dp1","dp2"]},
{n:"Ứng dụng thực tế: DSA dùng ở đâu?",d:"Cache, hàng đợi, undo, phụ thuộc, thư mục, chọn cấu trúc",L:["ap1","ap2","ap3","ap4","ap5","ap6"]},
{n:"Mini project 2: Bộ xếp thứ tự cài đặt",d:"Đồ thị phụ thuộc, phát hiện vòng, lỗi như hệ thống thật",L:["w10"]});
const openR=id=>P.done[id]?hub(id):start(id);
function hub(id){cur=id;road();const L=LES[id],k=mk0(id),r=P.g[k]||{n:0,d:[]},nx=MS.find(m=>m>r.n)||1000,ty={w1:"cm",w2:"cl"}[id],p=$("#panel");p.className="panel";
p.innerHTML=`<h2>${L.t}</h2><div class="fb ok">Bạn đã học xong bậc này. Lặp lại thật nhiều lần mới thành bản năng.</div><p class="sub">${stg(r)}: ${r.n}/${nx} lần đúng, qua ${r.d.length} ngày khác nhau.</p><progress max="${nx}" value="${r.n}" style="width:100%"></progress><p>${L.dr?`<button class="go" id="h1">Luyện 10 câu</button> `:""}${ty?`<button class="go" id="h3">Gõ lại code (hiểu trước, chép sau)</button> `:""}<button class="ghost" id="h2">Học lại từ đầu</button></p>`;
if(L.dr)$("#h1").onclick=()=>drill(id,DR[L.dr],10,()=>hub(id),"Luyện: "+L.t);if(ty)$("#h3").onclick=()=>gtype(ty);$("#h2").onclick=()=>start(id)}
function review(){cur=null;road();const pool=ids.filter(i=>P.done[i]&&LES[i].dr);if(!pool.length){$("#panel").innerHTML=`<h2>Ôn hôm nay</h2><p class="sub">Hãy học xong ít nhất một bài có luyện tập, rồi quay lại đây. Ôn trộn lẫn nhiều bài giúp nhớ lâu hơn.</p>`;return}
drill(null,()=>{const i=pool[Math.floor(Math.random()*pool.length)],q=DR[LES[i].dr]();q.id=i;return q},10,()=>draw(),"Ôn hôm nay: trộn các bài đã học")}
function drill(id,g,n,cb,title){const p=$("#panel");let i=0,ok=0;p.className="panel";
const ask=()=>{if(i>=n){p.innerHTML=`<h2>${title}</h2><div class="fb ok">Xong ${n} câu, đúng ngay lần đầu: ${ok}/${n}.${id?` ${stg(P.g[id])}: tổng ${P.g[id]?P.g[id].n:0} lần đúng.`:""}</div><p><button class="go" id="b1">Tiếp tục</button></p>`;$("#b1").onclick=()=>cb();return}
const q=g();let wr=0;p.innerHTML=`<h2>${title}</h2><p class="sub">Câu ${i+1}/${n}</p>${q.c?`<pre class="out" id="cc"></pre>`:""}<div class="q">${q.q}</div><input id="v" type="text" autocomplete="off"> <button class="go" id="ok">Kiểm tra</button><div id="fb"></div>`;
if(q.c)$("#cc").textContent=q.c;$("#v").focus();
const go=()=>{const v=$("#v").value.replace(/\s/g,"").toLowerCase();if(!v)return;if(v===String(q.a).toLowerCase()){if(!wr){ok++;bump(q.id||id)}i++;ask()}else{wr=1;fb("Chưa đúng. "+q.w+" Gõ lại đáp án đúng để nhớ, câu này chưa tính điểm.")}};
$("#ok").onclick=go;$("#v").onkeydown=e=>{if(e.key=="Enter")go()}};ask()}

P.q=P.q||{};
const PB={};
const pb=(id,t,src,lv,req,d,fn,args,T,ap,h,cx)=>{PB[id]={t,src,lv,req,d,T,ap,h,cx,s:`def ${fn}(${args}):\n    pass\n`}};
pb("sm1","Tổng hai số","HackerRank: Solve Me First","Dễ","p1","Viết hàm solve_me_first(a, b) trả về tổng hai số.","solve_me_first","a, b",[["solve_me_first(2, 3)","5"],["solve_me_first(-1, 1)","0"],["solve_me_first(0, 0)","0"],["solve_me_first(100, 250)","350"]],["Hàm cần làm gì với hai số?",["Trả về tổng a + b","In ra màn hình","Trả về a * b"],0,"Đề yêu cầu trả về (return), không phải in."],["Nhớ bài hàm: dùng return.","Chỉ cần một dòng: return a rồi dấu cộng b.","def solve_me_first(a, b):\n    return a + b"],"O(1)");
pb("fz","FizzBuzz","LeetCode 412: Fizz Buzz","Dễ","p3","Trả về danh sách n chuỗi, từ 1 đến n. Chia hết cho cả 3 và 5 thì \"FizzBuzz\"; chỉ chia hết cho 3 thì \"Fizz\"; chỉ chia hết cho 5 thì \"Buzz\"; còn lại là số đó dạng chuỗi.","fizz_buzz","n",[["fizz_buzz(3)",'["1", "2", "Fizz"]'],["fizz_buzz(5)",'["1", "2", "Fizz", "4", "Buzz"]'],["fizz_buzz(15)[14]",'"FizzBuzz"'],["fizz_buzz(1)",'["1"]']],["Phải kiểm tra điều kiện nào TRƯỚC?",["Chia hết cho cả 3 và 5","Chia hết cho 3","Chia hết cho 5"],0,"Số 15 chia hết cả hai. Nếu kiểm tra 3 trước thì sẽ trả sai Fizz."],["Dùng % (phần dư): 15 % 3 == 0 nghĩa là chia hết.","Vòng for i in range(1, n + 1). Kiểm tra 15 trước, rồi 3, rồi 5, còn lại là str(i). Gom kết quả vào list bằng append.","def fizz_buzz(n):\n    res = []\n    for i in range(1, n + 1):\n        if i % 15 == 0:\n            res.append(\"FizzBuzz\")\n        elif i % 3 == 0:\n            res.append(\"Fizz\")\n        elif i % 5 == 0:\n            res.append(\"Buzz\")\n        else:\n            res.append(str(i))\n    return res"],"O(n)");
pb("sas","Tổng mảng","HackerRank: Simple Array Sum","Dễ","sm","Viết hàm simple_array_sum(ar) trả về tổng các phần tử của danh sách ar.","simple_array_sum","ar",[["simple_array_sum([1, 2, 3])","6"],["simple_array_sum([10])","10"],["simple_array_sum([])","0"],["simple_array_sum([-1, -2, 3])","0"]],["Biến cộng dồn nên bắt đầu bằng?",["0","ar[0]","1"],0,"Mảng rỗng thì tổng phải là 0, nên bắt đầu từ 0."],["Nhớ bài cộng dồn: t = 0 rồi vòng for.","for x in ar: t = t + x. Cuối cùng return t.","def simple_array_sum(ar):\n    t = 0\n    for x in ar:\n        t = t + x\n    return t"],"O(n)");
pb("cnd","Đếm nến cao nhất","HackerRank: Birthday Cake Candles","Dễ","cn","Cho danh sách chiều cao nến. Trả về số cây nến cao nhất.","birthday_cake_candles","candles",[["birthday_cake_candles([4, 4, 1, 3])","2"],["birthday_cake_candles([3, 2, 1, 3])","2"],["birthday_cake_candles([5])","1"],["birthday_cake_candles([1, 2, 3])","1"]],["Cần những bước chính nào?",["Tìm số lớn nhất, rồi đếm số lần nó xuất hiện","Sắp xếp rồi lấy phần tử đầu","Chỉ cần tìm số lớn nhất"],0,"Bạn đã học cả hai: tờ giấy nhớ tìm lớn nhất và đếm."],["Ghép hai bài đã học: tìm lớn nhất, rồi đếm.","m = max(candles). Sau đó đếm các x bằng m.","def birthday_cake_candles(candles):\n    m = max(candles)\n    c = 0\n    for x in candles:\n        if x == m:\n            c = c + 1\n    return c"],"O(n)");
pb("mms","Tổng nhỏ nhất, lớn nhất của 4 số","HackerRank: Mini-Max Sum","Dễ","cn","Cho 5 số nguyên dương. Trả về tuple (a, b): a là tổng nhỏ nhất, b là tổng lớn nhất của đúng 4 trong 5 số.","mini_max_sum","arr",[["mini_max_sum([1, 2, 3, 4, 5])","(10, 14)"],["mini_max_sum([7, 7, 7, 7, 7])","(28, 28)"],["mini_max_sum([1, 3, 5, 7, 9])","(16, 24)"]],["Tổng nhỏ nhất của 4 số bằng gì?",["Tổng cả 5 số trừ số lớn nhất","Tổng cả 5 số trừ số nhỏ nhất","Tổng chia 4"],0,"Bỏ số lớn nhất ra thì còn 4 số nhỏ nhất."],["Chỉ cần tổng cả mảng, số nhỏ nhất và số lớn nhất.","Tổng nhỏ nhất = tổng - max. Tổng lớn nhất = tổng - min.","def mini_max_sum(arr):\n    total = sum(arr)\n    return (total - max(arr), total - min(arr))"],"O(n)");
pb("mp","Mua bán cổ phiếu","LeetCode 121: Best Time to Buy and Sell Stock","Dễ","l3","prices[i] là giá ngày i. Mua một ngày, bán ở một ngày SAU đó. Trả về lãi lớn nhất (0 nếu không có lãi).","max_profit","prices",[["max_profit([7, 1, 5, 3, 6, 4])","5"],["max_profit([7, 6, 4, 3, 1])","0"],["max_profit([1, 2])","1"],["max_profit([2, 4, 1])","2"]],["Khi xét ngày bán hôm nay, cần biết gì về quá khứ?",["Giá mua thấp nhất đã thấy (tờ giấy nhớ)","Giá cao nhất đã thấy","Tổng các giá"],0,"Bán hôm nay thì muốn đã mua ở ngày rẻ nhất trước đó."],["Giống tờ giấy nhớ của bài tìm lớn nhất, nhưng ghi giá thấp nhất.","Duyệt từng giá: cập nhật giá thấp nhất, rồi tính lãi nếu bán hôm nay, giữ lãi lớn nhất.","def max_profit(prices):\n    low = prices[0]\n    best = 0\n    for p in prices:\n        if p < low:\n            low = p\n        if p - low > best:\n            best = p - low\n    return best"],"O(n), một lần duyệt");
pb("msa","Dãy con có tổng lớn nhất","LeetCode 53: Maximum Subarray","Trung bình","l3","Tìm tổng lớn nhất của một dãy con liên tiếp (ít nhất 1 phần tử) trong nums.","maximum_subarray","nums",[["maximum_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4])","6"],["maximum_subarray([1])","1"],["maximum_subarray([5, 4, -1, 7, 8])","23"],["maximum_subarray([-3, -1, -2])","-1"]],["Tại mỗi vị trí, nối tiếp dãy đang có hay bắt đầu dãy mới? Khi nào nên bắt đầu mới?",["Khi tổng đang có là số âm","Khi gặp số dương","Không bao giờ"],0,"Mang theo một tổng âm chỉ làm dãy mới nhỏ đi."],["Giữ hai tờ giấy: tổng dãy đang xét (cur) và tổng tốt nhất từng thấy (best).","Nếu cur âm thì bỏ nó, cur = nums[i]; ngược lại cur = cur + nums[i]. Mỗi bước cập nhật best.","def maximum_subarray(nums):\n    cur = nums[0]\n    best = nums[0]\n    for i in range(1, len(nums)):\n        if cur < 0:\n            cur = nums[i]\n        else:\n            cur = cur + nums[i]\n        if cur > best:\n            best = cur\n    return best"],"O(n)");
pb("dup","Có phần tử trùng không","LeetCode 217: Contains Duplicate","Dễ","d1","Trả về True nếu nums có ít nhất một số xuất hiện từ hai lần trở lên, ngược lại False.","contains_duplicate","nums",[["contains_duplicate([1, 2, 3, 1])","True"],["contains_duplicate([1, 2, 3, 4])","False"],["contains_duplicate([])","False"],["contains_duplicate([5, 5])","True"]],["Cách nào nhanh để biết đã thấy số này chưa?",["Lưu các số đã thấy vào set rồi tra","So sánh từng cặp số","Cộng tất cả lại"],0,"Tra set gần như tức thì. So từng cặp tốn khoảng n * n bước."],["Duyệt từng số. Trước khi xem số mới, hỏi: số này đã gặp chưa?","Dùng set(): x in seen để tra, seen.add(x) để ghi nhớ.","def contains_duplicate(nums):\n    seen = set()\n    for x in nums:\n        if x in seen:\n            return True\n        seen.add(x)\n    return False"],"O(n) thời gian, O(n) bộ nhớ");
pb("ts","Hai số có tổng bằng target","LeetCode 1: Two Sum","Dễ","d2","Cho nums và target. Trả về [i, j] với i < j sao cho nums[i] + nums[j] == target. Đảm bảo có đúng một đáp án.","two_sum","nums, target",[["two_sum([2, 7, 11, 15], 9)","[0, 1]"],["two_sum([3, 2, 4], 6)","[1, 2]"],["two_sum([3, 3], 6)","[0, 1]"],["two_sum([1, 5, 9, 3], 12)","[2, 3]"]],["Duyệt mọi cặp thì tốn bao nhiêu bước với n số?",["Khoảng n * n","Khoảng n","Khoảng 1"],0,"Mỗi số lại phải so với các số còn lại. Dùng dict sẽ giảm xuống khoảng n."],["Với mỗi số x, số cần tìm là target - x. Làm sao biết nó đã xuất hiện chưa?","Dùng dict: khóa là số đã thấy, giá trị là chỉ số của nó.","def two_sum(nums, target):\n    seen = {}\n    for i in range(len(nums)):\n        need = target - nums[i]\n        if need in seen:\n            return [seen[need], i]\n        seen[nums[i]] = i"],"O(n) thời gian, O(n) bộ nhớ");
pb("ana","Hai chuỗi hoán vị nhau","LeetCode 242: Valid Anagram","Dễ","d2","Trả về True nếu t có thể tạo từ các chữ của s (cùng chữ, cùng số lần), ngược lại False.","valid_anagram","s, t",[['valid_anagram("anagram", "nagaram")',"True"],['valid_anagram("rat", "car")',"False"],['valid_anagram("a", "ab")',"False"],['valid_anagram("", "")',"True"]],["Hai chuỗi là anagram khi nào?",["Cùng các chữ với cùng số lần","Cùng độ dài","Cùng chữ đầu"],0,"Giống bài đếm tần suất bằng dict."],["Đếm số lần mỗi chữ của s, rồi trừ đi theo các chữ của t.","Nếu độ dài khác nhau thì False ngay. Cuối cùng mọi số đếm phải bằng 0.","def valid_anagram(s, t):\n    if len(s) != len(t):\n        return False\n    d = {}\n    for ch in s:\n        d[ch] = d.get(ch, 0) + 1\n    for ch in t:\n        d[ch] = d.get(ch, 0) - 1\n    for k in d:\n        if d[k] != 0:\n            return False\n    return True"],"O(n)");
pb("pal","Chuỗi đối xứng","LeetCode 125: Valid Palindrome (bản đơn giản)","Dễ","tp","Chỉ xét các chữ cái của s, không phân biệt hoa thường. Trả về True nếu đọc xuôi và ngược giống nhau.","is_palindrome","s",[['is_palindrome("A man, a plan, a canal: Panama")',"True"],['is_palindrome("race a car")',"False"],['is_palindrome("")',"True"],['is_palindrome("ab")',"False"]],["Hai con trỏ đặt ở đâu lúc đầu?",["Một ở đầu, một ở cuối","Cả hai ở đầu","Cả hai ở giữa"],0,"So cặp ngoài cùng trước, rồi tiến vào trong."],["Lọc ra chỉ các chữ cái viết thường (ch.isalpha(), s.lower()) vào một list.","Hai con trỏ i = 0, j = len - 1. Khác nhau thì False. Xong thì i tăng, j giảm.","def is_palindrome(s):\n    t = []\n    for ch in s.lower():\n        if ch.isalpha():\n            t.append(ch)\n    i = 0\n    j = len(t) - 1\n    while i < j:\n        if t[i] != t[j]:\n            return False\n        i = i + 1\n        j = j - 1\n    return True"],"O(n)");
pb("par","Ngoặc hợp lệ","LeetCode 20: Valid Parentheses","Dễ","stk","Chuỗi s chỉ gồm ( ) [ ] { }. Hợp lệ khi mỗi ngoặc mở có ngoặc đóng đúng loại, đúng thứ tự.","valid_parentheses","s",[['valid_parentheses("()")',"True"],['valid_parentheses("()[]{}")',"True"],['valid_parentheses("(]")',"False"],['valid_parentheses("([)]")',"False"],['valid_parentheses("{[]}")',"True"],['valid_parentheses("(")',"False"],['valid_parentheses("")',"True"]],["Gặp ngoặc đóng, nó phải khớp với ngoặc mở nào?",["Ngoặc mở gần nhất chưa được đóng (đỉnh stack)","Ngoặc mở đầu tiên","Ngoặc mở bất kỳ"],0,"Vào sau, ra trước: đúng bản chất stack."],["Gặp ngoặc mở thì cất vào stack. Gặp ngoặc đóng thì lấy ngoặc trên cùng ra so.","Nhớ hai ca lỗi: stack rỗng khi gặp ngoặc đóng, và còn thừa ngoặc mở khi hết chuỗi.","def valid_parentheses(s):\n    pair = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}\n    st = []\n    for ch in s:\n        if ch in pair:\n            if len(st) == 0 or st.pop() != pair[ch]:\n                return False\n        else:\n            st.append(ch)\n    return len(st) == 0"],"O(n)");
pb("bsr","Tìm nhị phân","LeetCode 704: Binary Search","Dễ","bs","nums đã sắp xếp tăng dần. Trả về chỉ số của target, hoặc -1 nếu không có. Phải chạy trong O(log n).","binary_search","nums, target",[["binary_search([-1, 0, 3, 5, 9, 12], 9)","4"],["binary_search([-1, 0, 3, 5, 9, 12], 2)","-1"],["binary_search([5], 5)","0"],["binary_search([], 1)","-1"],["binary_search([1, 3, 5, 7], 7)","3"]],["Xem hộp giữa, nếu giữa nhỏ hơn target thì làm gì?",["Bỏ nửa trái, tìm bên phải","Bỏ nửa phải","Xem lại từ đầu"],0,"Mảng tăng dần: target lớn hơn thì chỉ có thể ở bên phải."],["Giữ hai con trỏ lo và hi. Còn lo <= hi thì còn hộp để xem.","mid = (lo + hi) // 2. Bằng target thì trả mid; nhỏ hơn thì lo = mid + 1; lớn hơn thì hi = mid - 1.","def binary_search(nums, target):\n    lo = 0\n    hi = len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1"],"O(log n)");
STAGES[0].Q=["sm1","fz"];STAGES[1].Q=["sas","cnd","mms","mp","msa"];STAGES[2].Q=["dup","ts","ana"];STAGES[3].Q=["pal"];STAGES[4].Q=["par"];STAGES[5].Q=["bsr"];
{const r0=road;road=function(){r0();addQ()}}
function addQ(){document.querySelectorAll("#road .stage").forEach((d,i)=>{const Q=STAGES[i]&&STAGES[i].Q;if(Q)d.insertAdjacentHTML("beforeend",`<small style="margin-top:10px"><b>Luyện đề kiểu LeetCode, HackerRank</b></small>`+Q.map(id=>{const b=PB[id];return`<button class="lb ${P.q[id]?"done":""} ${cur=="q:"+id?"cur":""}" data-q="${id}" ${P.done[b.req]?"":"disabled"}><span>${b.t}<br><small style="color:var(--mut)">${b.src}</small></span></button>`}).join(""))});
document.querySelectorAll("#road [data-q]").forEach(b=>b.onclick=()=>prob(b.dataset.q))}
function prob(id){const B=PB[id],p=$("#panel");cur="q:"+id;road();p.className="panel split";let hn=0;
p.innerHTML=`<div class="lt"><h2>${B.t}</h2><p class="sub">${B.src}, mức ${B.lv}</p><div class="q" id="dd"></div><pre class="out" id="ex"></pre><div id="ap"></div><p><button class="ghost" id="hp">Cần giúp</button> <button class="ghost" id="hpb">📖 Giở sổ tay bài liên quan</button></p><pre class="out" id="hl" hidden></pre></div><div class="rt" id="rt"></div>`;
$("#dd").textContent=B.d;$("#ex").textContent="Ví dụ:\n"+B.T.slice(0,3).map(([c,e])=>c+"  ->  "+e).join("\n");
const[q,o,a,w]=B.ap;$("#ap").innerHTML=`<div class="q"><b>Trước khi gõ, hãy nghĩ cách giải.</b> ${q}</div><div class="opts">${o.map((x,n)=>`<button data-o="${n}">${x}</button>`).join("")}</div><div id="fb"></div>`;
$("#rt").innerHTML=`<p class="sub">Trả lời câu hỏi bên trái trước. Nghĩ cách giải trước, gõ code sau.</p>`;
$("#ap").querySelectorAll("[data-o]").forEach(b=>b.onclick=()=>{if(+b.dataset.o==a){fb("Đúng. "+w,1);ed_()}else fb("Chưa đúng, không sao. Đọc lại đề và thử chọn lại.")});
$("#hpb").onclick=()=>notebook(B.req,()=>prob(id),"Quay lại đề");
$("#hp").onclick=()=>{const h=$("#hl");h.hidden=false;h.textContent=`Gợi ý ${Math.min(hn+1,3)}/3:\n`+(hn<2?B.h[hn]:"Lời giải tham khảo. Hãy tự gõ lại bằng tay, rồi mai thử giải lại mà không nhìn:\n"+B.h[2]);hn++};
function ed_(){$("#rt").innerHTML=`<textarea class="code" id="ed" spellcheck="false"></textarea><p><button class="go" id="run">Chạy tất cả test</button></p><pre class="out" id="out"></pre>`;const e=$("#ed");e.value=B.code||B.s;e.oninput=()=>B.code=e.value;
e.onkeydown=k=>{if(k.key=="Tab"){k.preventDefault();e.setRangeText("    ",e.selectionStart,e.selectionEnd,"end");B.code=e.value}};$("#run").onclick=()=>runProb(B,id)}}
async function runProb(B,id){const o=$("#out");if(/^\s*pass\s*$/m.test(B.code||B.s)&&!B.code){}o.textContent="Đang chạy (lần đầu tải Python mất vài giây)...";
let sc=(B.code||B.s)+"\n";B.T.forEach(([c,e],i)=>{sc+=`try:\n    r = ${c}\n    if r != ${e}:\n        print("F|${i}|" + str(r))\nexcept Exception as e:\n    print("E|${i}|" + type(e).__name__ + ": " + str(e))\n`});
const r=await py(sc);if(!r.ok)return o.textContent="Code lỗi:\n"+r.err;
const bad=(r.out||"").split("\n").filter(Boolean).map(l=>{const[t,i,g]=l.split("|"),[c,e]=B.T[+i];return`Ca ${+i+1}: ${c}\n   cần ${e}, ${t=="F"?"bạn trả về "+g:"bị lỗi "+g}`});
if(bad.length)return o.textContent=`Chưa qua ${bad.length}/${B.T.length} ca:\n`+bad.join("\n");
P.q[id]=1;save();road();o.textContent=`XANH ✓ Qua cả ${B.T.length} ca.\nĐộ phức tạp của cách chuẩn: ${B.cx}.\nNgày mai hãy giải lại đề này từ đầu mà không nhìn lời giải.`}
road();draw();

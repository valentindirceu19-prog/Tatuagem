const STORAGE = {
  projects: "studioInk.projects",
  appointments: "studioInk.appointments",
  messages: "studioInk.messages",
  favorites: "studioInk.favorites",
  gallery: "studioInk.gallery"
};
const defaultDesigns = [
  {id:"flor-01",title:"Ramo de outono",style:"Botânica",size:"Médio · 12 cm",price:480,motif:"flower",tone:"#e1e2d7"},
  {id:"linha-02",title:"Fases da lua",style:"Fine line",size:"Pequeno · 7 cm",price:260,motif:"moon",tone:"#e9dfd4"},
  {id:"geom-03",title:"Olho que tudo vê",style:"Geométrico",size:"Médio · 10 cm",price:390,motif:"eye",tone:"#dfe4dc"},
  {id:"flor-04",title:"Jardim selvagem",style:"Botânica",size:"Grande · 16 cm",price:720,motif:"leaf",tone:"#e4e0d2"},
  {id:"trad-05",title:"Sol de verão",style:"Tradicional",size:"Pequeno · 8 cm",price:320,motif:"sun",tone:"#ecdcd1"},
  {id:"linha-06",title:"Constelação",style:"Fine line",size:"Pequeno · 6 cm",price:240,motif:"stars",tone:"#e4e2eb"}
];
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const load = (key, fallback=[]) => {
  try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; }
  catch (error) { console.error(`Não foi possível ler ${key} do armazenamento local.`, error); return fallback; }
};
const save = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch (error) { console.error(`Não foi possível salvar ${key} no armazenamento local.`, error); notify("Não foi possível salvar. O armazenamento deste navegador pode estar cheio.", true); return false; }
};
let designs = load(STORAGE.gallery, defaultDesigns);
let activeStyle = "Todos";
let referenceData = "";
let activeConversation = "";

const artwork = {
  flower:`<svg class="design-svg" viewBox="0 0 240 240" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path stroke-width="1.5" d="M115 216c-2-42 5-72 24-104 14-24 29-42 31-73M128 153c-19-20-38-29-58-32m74 15c19-10 35-12 52-8m-73 52c-16-12-31-16-44-13"/><path stroke-width="1.4" d="M150 103c-29-12-39-34-29-53 20 7 32 25 29 53Zm12-14c3-30 20-47 40-43 0 22-13 40-40 43Zm-23 42c-6-25-24-40-43-34 5 21 19 35 43 34Zm33-16c19-19 42-22 55-8-14 17-34 22-55 8ZM120 177c-21-12-40-10-49 5 16 12 35 10 49-5Z"/><circle cx="150" cy="54" r="18" stroke-width="1.3"/><path stroke-width="1.3" d="M150 36c-10-10-7-22 1-28 9 8 9 20-1 28Zm1 36c10 9 21 6 26-2-8-8-19-8-26 2Zm-18-18c-10 7-10 18-3 24 10-6 13-16 3-24Z"/></svg>`,
  moon:`<svg class="design-svg" viewBox="0 0 240 240" fill="none" stroke="currentColor" stroke-linecap="round"><path stroke-width="1.4" d="M68 118a50 50 0 0 1 88-33 42 42 0 0 0 0 66 50 50 0 0 1-88-33Z"/><circle cx="62" cy="53" r="2" fill="currentColor"/><circle cx="170" cy="60" r="2" fill="currentColor"/><circle cx="182" cy="142" r="2" fill="currentColor"/><path stroke-width="1.3" d="m55 93 4 9 9 4-9 4-4 9-4-9-9-4 9-4 4-9Zm114 30 3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6Zm-56-91 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z"/></svg>`,
  eye:`<svg class="design-svg" viewBox="0 0 240 240" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path stroke-width="1.4" d="M35 116s30-45 85-45 85 45 85 45-30 45-85 45-85-45-85-45Z"/><circle cx="120" cy="116" r="25" stroke-width="1.4"/><circle cx="120" cy="116" r="9" stroke-width="1.3"/><path stroke-width="1.3" d="m120 31 4 10 10 4-10 4-4 10-4-10-10-4 10-4 4-10Zm0 132 3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8ZM52 53l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Zm136 4 2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7Z"/></svg>`,
  leaf:`<svg class="design-svg" viewBox="0 0 240 240" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path stroke-width="1.5" d="M55 194c47-43 76-92 112-151M74 174c-18-32-14-55 4-70 20 16 22 40-4 70Zm28-37c-2-35 13-57 37-60 12 25-1 50-37 60Zm-48 52c23-2 40 7 46 27-16 11-36 2-46-27Z"/><path stroke-width="1.2" d="M169 43c11-15 25-18 37-11-3 14-16 22-37 11Zm-55 88 23-15m-62 58 22-15m31-37 29-18"/></svg>`,
  sun:`<svg class="design-svg" viewBox="0 0 240 240" fill="none" stroke="currentColor" stroke-linecap="round"><circle cx="120" cy="118" r="39" stroke-width="1.6"/><path stroke-width="1.5" d="M120 43v18m0 114v18M45 118h18m114 0h18M67 65l13 13m80 80 13 13m0-106-13 13m-80 80-13 13"/><path stroke-width="1.4" d="M105 110c9-8 21-8 30 0m-30 17c9 7 21 7 30 0m-25 21c7 4 13 4 20 0"/><path stroke-width="1.3" d="m120 26 3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8Zm80 92 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7ZM40 168l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z"/></svg>`,
  stars:`<svg class="design-svg" viewBox="0 0 240 240" fill="none" stroke="currentColor" stroke-linecap="round"><path stroke-width="1.2" d="m67 148 47-58 52 33-50 47-49-22Zm47-58 21-34 31 67m-50 47 16 34 34-63"/><circle cx="67" cy="148" r="5" stroke-width="1.4"/><circle cx="114" cy="90" r="5" stroke-width="1.4"/><circle cx="166" cy="123" r="5" stroke-width="1.4"/><circle cx="116" cy="170" r="5" stroke-width="1.4"/><path stroke-width="1.2" d="m46 65 3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8Zm139 75 3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8Zm-90 55 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Zm74-147 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z"/></svg>`
};
function notify(message, error=false){const item=document.createElement("div");item.className=`toast${error?" error":""}`;item.textContent=message;$("#toastRegion").append(item);setTimeout(()=>item.remove(),3800);}
function initials(name="Cliente"){return name.trim().split(/\s+/).slice(0,2).map(part=>part[0]?.toUpperCase()||"").join("");}
function money(value){return Number(value||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0});}
function renderGallery(){const grid=$("#galleryGrid");if(!grid)return;$("#allDesignCount").textContent=String(designs.length).padStart(2,"0");const max=$("#priceFilter").value;const filtered=designs.filter(item=>(activeStyle==="Todos"||item.style===activeStyle)&&(max==="all"||(max==="601"?item.price>600:item.price<=Number(max))));const favorites=load(STORAGE.favorites,[]);grid.innerHTML=filtered.length?filtered.map((item,index)=>`<article class="design-card" data-design="${item.id}" tabindex="0" aria-label="Solicitar orçamento para ${escapeHTML(item.title)}"><div class="design-image" style="background:${item.tone||"#e8e7de"}"><span class="design-number">0${index+1} / FLASH</span>${item.image?`<img alt="Desenho ${escapeHTML(item.title)}" src="${item.image}" style="width:81%;height:81%;object-fit:contain;mix-blend-mode:multiply">`:artwork[item.motif]||artwork.flower}<span class="design-tag">${escapeHTML(item.style.toUpperCase())}</span><button class="design-heart ${favorites.includes(item.id)?"favorited":""}" data-favorite="${item.id}" aria-label="Favoritar desenho">${favorites.includes(item.id)?"♥":"♡"}</button></div><div class="card-info"><div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.size)}</p></div><div class="card-price">${money(item.price)}<small>valor inicial</small></div></div></article>`).join(""):`<p class="empty-state">Nenhum desenho encontrado nessa seleção. Experimente outro filtro.</p>`;}
function escapeHTML(value=""){return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));}
function recordProject(project){const projects=load(STORAGE.projects,[]);projects.unshift({...project,id:crypto.randomUUID?.()||String(Date.now()),createdAt:new Date().toISOString(),status:"Novo"});return save(STORAGE.projects,projects);}
function recordMessage(message){const messages=load(STORAGE.messages,[]);let thread=messages.find(item=>item.id===message.threadId);if(!thread){thread={id:message.threadId||`thread-${Date.now()}`,name:message.name||"Cliente do site",contact:message.contact||"",updatedAt:new Date().toISOString(),messages:[]};messages.unshift(thread);}thread.messages.push({text:message.text,from:message.from||"cliente",createdAt:new Date().toISOString()});thread.updatedAt=new Date().toISOString();save(STORAGE.messages,messages);return thread.id;}
async function prepareImage(file){
  const source=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error("Falha ao ler a imagem selecionada."));reader.readAsDataURL(file);});
  const image=await new Promise((resolve,reject)=>{const loaded=new Image();loaded.onload=()=>resolve(loaded);loaded.onerror=()=>reject(new Error("A imagem selecionada não pôde ser decodificada."));loaded.src=source;});
  const scale=Math.min(1,1400/Math.max(image.naturalWidth,image.naturalHeight));
  const canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
  const context=canvas.getContext("2d");if(!context)throw new Error("Não foi possível preparar a imagem no navegador.");
  context.fillStyle="#fff";context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(image,0,0,canvas.width,canvas.height);
  return canvas.toDataURL("image/jpeg",.78);
}
function openProjectForm(title){$("#projectIdea").value=title?`Tenho interesse no desenho "${title}". `:"";$("#enviar-projeto").scrollIntoView({behavior:"smooth"});setTimeout(()=>$("#clientName").focus(),350);}
$$(".filter-pill").forEach(button=>button.addEventListener("click",()=>{$$(".filter-pill").forEach(item=>item.classList.remove("active"));button.classList.add("active");activeStyle=button.dataset.style;renderGallery();}));
$("#priceFilter").addEventListener("change",renderGallery);
$("#galleryGrid").addEventListener("click",event=>{const favorite=event.target.closest("[data-favorite]");if(favorite){event.stopPropagation();const saved=load(STORAGE.favorites,[]);const id=favorite.dataset.favorite;save(STORAGE.favorites,saved.includes(id)?saved.filter(item=>item!==id):[...saved,id]);renderGallery();return;}const card=event.target.closest("[data-design]");if(card)openProjectForm(designs.find(item=>item.id===card.dataset.design)?.title);});
$("#galleryGrid").addEventListener("keydown",event=>{if((event.key==="Enter"||event.key===" ")&&event.target.matches(".design-card"))openProjectForm(designs.find(item=>item.id===event.target.dataset.design)?.title);});
$("#requestCustom").addEventListener("click",()=>openProjectForm(""));
$("#referenceImage").addEventListener("change",async event=>{const file=event.target.files?.[0];referenceData="";$("#uploadName").textContent="Nenhuma imagem selecionada";if(!file)return;if(!["image/jpeg","image/png","image/webp"].includes(file.type)){notify("Escolha uma imagem JPG, PNG ou WEBP.",true);event.target.value="";return;}if(file.size>8*1024*1024){notify("A imagem deve ter no máximo 8 MB.",true);event.target.value="";return;}try{referenceData=await prepareImage(file);$("#uploadName").textContent=`Imagem selecionada: ${file.name}`;}catch(error){console.error(error);notify("Não foi possível preparar essa imagem.",true);}});
$("#projectForm").addEventListener("submit",event=>{event.preventDefault();const project={name:$("#clientName").value.trim(),contact:$("#clientContact").value.trim(),idea:$("#projectIdea").value.trim(),image:referenceData};if(!project.name||!project.contact){notify("Preencha seu nome e uma forma de contato.",true);return;}if(recordProject(project)){event.currentTarget.reset();referenceData="";$("#uploadName").textContent="Nenhuma imagem selecionada";notify("Projeto enviado! O tatuador já pode ver seu pedido no painel.");}});
$("#bookingForm").addEventListener("submit",event=>{event.preventDefault();const appointment={id:String(Date.now()),name:$("#bookingName").value.trim(),contact:$("#bookingContact").value.trim(),date:$("#bookingDate").value,period:$("#bookingPeriod").value,status:"Aguardando confirmação"};if(!appointment.name||!appointment.contact||!appointment.date){notify("Informe seu nome, contato e a data desejada.",true);return;}const list=load(STORAGE.appointments,[]);list.unshift(appointment);if(save(STORAGE.appointments,list)){event.currentTarget.reset();notify("Pedido de horário registrado. O estúdio confirmará com você.");}});
$("#year").textContent=new Date().getFullYear();

const chatPanel=$("#chatPanel");
$("#openChat").addEventListener("click",()=>{chatPanel.hidden=!chatPanel.hidden;if(!chatPanel.hidden)$("#chatInput").focus();});
$("#closeChat").addEventListener("click",()=>chatPanel.hidden=true);
function chatReply(text){const normalized=text.toLowerCase();if(/valor|pre[cç]o|custa|or[cç]amento/.test(normalized))return "Os desenhos da galeria começam em R$ 240. O valor final depende do tamanho, local do corpo e detalhes. Envie sua referência no formulário e o tatuador prepara um orçamento personalizado. ✨";if(/agenda|agendar|hor[aá]rio|marcar/.test(normalized))return "Você pode solicitar um horário na seção “Vamos encontrar seu horário”. O estúdio confirma a disponibilidade pelo contato informado. Quer que eu avise o tatuador sobre seu interesse?";if(/cuidado|cicatriza/.test(normalized))return "O tatuador explica os cuidados específicos no dia da sessão. Como orientação geral, mantenha a região limpa e siga as instruções profissionais entregues pelo estúdio. Posso encaminhar sua dúvida para ele.";if(/tatuador|pessoa|humano|atendente|avise|encaminh/.test(normalized))return "Claro! Sua mensagem foi encaminhada para a caixa de conversas do tatuador. Deixe seu nome e contato no formulário de projeto para facilitar o retorno. ✉";return "Posso ajudar com valores, agenda, cuidados e dúvidas sobre os desenhos. Para uma avaliação personalizada, deixe sua ideia e contato no formulário — também encaminho esta conversa ao tatuador. ✨";}
function submitChat(text){const clean=text.trim();if(!clean)return;const bubble=document.createElement("div");bubble.className="chat-bubble user";bubble.textContent=clean;$("#chatMessages").append(bubble);const threadId=recordMessage({text:clean,from:"cliente",threadId:activeConversation||undefined,name:"Cliente do site"});activeConversation=threadId;setTimeout(()=>{const reply=chatReply(clean);const response=document.createElement("div");response.className="chat-bubble assistant";response.textContent=reply;$("#chatMessages").append(response);$("#chatMessages").scrollTop=$("#chatMessages").scrollHeight;recordMessage({text:reply,from:"assistente",threadId,name:"Cliente do site"});},350);$("#chatMessages").scrollTop=$("#chatMessages").scrollHeight;}
$("#chatForm").addEventListener("submit",event=>{event.preventDefault();submitChat($("#chatInput").value);$("#chatInput").value="";});
$$(".quick-replies button").forEach(button=>button.addEventListener("click",()=>submitChat(button.dataset.message)));
$("#menuToggle").addEventListener("click",()=>$(".main-nav").classList.toggle("open"));
$$(".main-nav a").forEach(link=>link.addEventListener("click",()=>$(".main-nav").classList.remove("open")));

const artistModal=$("#artistModal"),dashboard=$("#dashboard");
$("#artistEntry").addEventListener("click",()=>{artistModal.hidden=false;$("#artistPin").focus();});
$$("[data-close]").forEach(button=>button.addEventListener("click",()=>$("#"+button.dataset.close).hidden=true));
artistModal.addEventListener("click",event=>{if(event.target===artistModal)artistModal.hidden=true;});
document.addEventListener("keydown",event=>{if(event.key==="Escape"){artistModal.hidden=true;const modal=$(".decalque-modal");if(modal)modal.remove();}});
$("#loginForm").addEventListener("submit",event=>{event.preventDefault();if($("#artistPin").value!=="studio123"){$("#loginError").textContent="Senha incorreta. Tente novamente.";return;}$("#loginError").textContent="";$("#artistPin").value="";artistModal.hidden=true;dashboard.hidden=false;document.body.style.overflow="hidden";showDashboard("overview");});
function closeDashboard(){dashboard.hidden=true;document.body.style.overflow="";}$("#backToSite").addEventListener("click",closeDashboard);$("#dashBack").addEventListener("click",closeDashboard);$("#logoutButton").addEventListener("click",closeDashboard);
$$(".dash-link").forEach(button=>button.addEventListener("click",()=>showDashboard(button.dataset.view)));
$("#notificationsButton").addEventListener("click",()=>{const p=load(STORAGE.projects,[]);const m=load(STORAGE.messages,[]);notify(`${p.length} projeto(s) e ${m.reduce((n,t)=>n+t.messages.filter(x=>x.from==="cliente").length,0)} mensagem(ns) recebidos neste navegador.`);$("#notificationDot").classList.remove("show");});
function empty(text){return `<div class="empty-state"><b>${text}</b>Nada por aqui ainda. Novos pedidos aparecerão neste painel.</div>`;}
function dashHeader(title,description,button=""){return `<div class="dash-page-heading"><div><h1>${title}</h1><p>${description}</p></div>${button}</div>`;}
function projectRows(projects){return projects.length?projects.map(project=>`<div class="dash-list-item"><span class="item-avatar">${escapeHTML(initials(project.name))}</span><div><b>${escapeHTML(project.name)}</b><small>${escapeHTML(project.idea||"Novo projeto")} · ${new Date(project.createdAt).toLocaleDateString("pt-BR")}</small></div><span class="status-chip pending">${escapeHTML(project.status||"Novo")}</span><button class="table-actions" data-project="${project.id}">Ver</button></div>`).join(""):empty("Nenhum projeto novo");}
function showDashboard(view){$$(".dash-link").forEach(button=>button.classList.toggle("active",button.dataset.view===view));const projects=load(STORAGE.projects,[]),appointments=load(STORAGE.appointments,[]),messages=load(STORAGE.messages,[]);$("#projectBadge").textContent=projects.length;const incoming=messages.reduce((count,thread)=>count+thread.messages.filter(item=>item.from==="cliente").length,0);$("#notificationDot").classList.toggle("show",projects.length>0||incoming>0);$("#dashDate").textContent=new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"});const content=$("#dashboardContent");
if(view==="overview"){content.innerHTML=`<div class="dash-welcome"><div><p class="eyebrow">SEU ESTÚDIO EM UM SÓ LUGAR</p><h1>Bom dia, Alex ✳</h1><p>Aqui está o resumo do Studio Ink.</p></div><button class="button button-primary" data-open-decalque>＋ Novo decalque</button></div><div class="stat-grid"><div class="stat-card"><div><span>Projetos recebidos</span><i>▧</i></div><strong>${projects.length}</strong><small>Pedidos enviados pelos clientes</small></div><div class="stat-card"><div><span>Conversas</span><i>◌</i></div><strong>${messages.length}</strong><small>Clientes aguardando retorno</small></div><div class="stat-card"><div><span>Agendamentos</span><i>▦</i></div><strong>${appointments.length}</strong><small>Solicitações neste navegador</small></div><div class="stat-card"><div><span>Desenhos na galeria</span><i>◇</i></div><strong>${designs.length}</strong><small>Peças disponíveis para clientes</small></div></div><div class="dash-columns"><section class="dash-card"><div class="dash-card-heading"><h3>Projetos recentes</h3><button data-goto="projects">Ver todos →</button></div><div class="dash-list">${projectRows(projects.slice(0,4))}</div></section><section class="dash-card"><div class="dash-card-heading"><h3>Próximos horários</h3><button data-goto="schedule">Ver agenda →</button></div><div class="dash-list">${appointments.length?appointments.slice(0,4).map(item=>`<div class="dash-list-item"><span class="item-avatar">▦</span><div><b>${escapeHTML(item.name)}</b><small>${new Date(`${item.date}T12:00:00`).toLocaleDateString("pt-BR")} · ${escapeHTML(item.period)}</small></div><span class="status-chip pending">A confirmar</span></div>`).join(""):empty("Sua agenda está livre")}</div></section></div>`;}
if(view==="projects"){content.innerHTML=`${dashHeader("Projetos recebidos","Referências e pedidos enviados pelos clientes.")}<div class="dash-card"><div class="dash-list">${projectRows(projects)}</div></div>`;}
if(view==="schedule"){content.innerHTML=`${dashHeader("Agenda","Solicitações de horário feitas pelos clientes.")}<div class="table-wrap"><table class="dash-table"><thead><tr><th>CLIENTE</th><th>CONTATO</th><th>DATA</th><th>PERÍODO</th><th>STATUS</th><th>AÇÃO</th></tr></thead><tbody>${appointments.length?appointments.map(item=>`<tr><td>${escapeHTML(item.name)}</td><td>${escapeHTML(item.contact||"—")}</td><td>${new Date(`${item.date}T12:00:00`).toLocaleDateString("pt-BR")}</td><td>${escapeHTML(item.period)}</td><td><span class="status-chip pending">${escapeHTML(item.status)}</span></td><td><button class="table-actions" data-confirm-appointment="${item.id}">Confirmar</button></td></tr>`).join(""):`<tr><td colspan="6">${empty("Nenhum horário solicitado")}</td></tr>`}</tbody></table></div>`;}
if(view==="galleryManage"){content.innerHTML=`${dashHeader("Galeria de desenhos","Gerencie peças, estilos e valores exibidos no site.",'<button class="button button-primary" id="addDesign">＋ Adicionar desenho</button>')}<div class="table-wrap"><table class="dash-table"><thead><tr><th>DESENHO</th><th>ESTILO</th><th>TAMANHO</th><th>VALOR INICIAL</th><th>AÇÃO</th></tr></thead><tbody>${designs.map(item=>`<tr><td>${escapeHTML(item.title)}</td><td>${escapeHTML(item.style)}</td><td>${escapeHTML(item.size)}</td><td>${money(item.price)}</td><td><button class="table-actions" data-delete-design="${item.id}">Excluir</button></td></tr>`).join("")}</tbody></table></div>`;}
if(view==="finance"){content.innerHTML=`${dashHeader("Financeiro","Resumo simples dos valores iniciais da galeria e projetos.")}<div class="stat-grid"><div class="stat-card"><div><span>Desenhos cadastrados</span><i>◇</i></div><strong>${designs.length}</strong><small>Peças na galeria</small></div><div class="stat-card"><div><span>Valor médio inicial</span><i>R$</i></div><strong>${money(designs.length?designs.reduce((sum,item)=>sum+Number(item.price),0)/designs.length:0)}</strong><small>Média dos valores cadastrados</small></div><div class="stat-card"><div><span>Pedidos recebidos</span><i>▧</i></div><strong>${projects.length}</strong><small>Orçamentos a avaliar</small></div><div class="stat-card"><div><span>Agendamentos</span><i>▦</i></div><strong>${appointments.length}</strong><small>Pedidos de horário</small></div></div><div class="dash-card"><div class="dash-card-heading"><h3>Importante</h3></div><div class="dash-list"><p style="font-size:10px;color:#77766d;line-height:1.8">Este MVP não registra pagamentos, despesas ou faturamento. Os valores da galeria são estimativas iniciais, não transações financeiras.</p></div></div>`;}
if(view==="messages"){const threadId=activeConversation||messages[0]?.id;const thread=messages.find(item=>item.id===threadId);content.innerHTML=`${dashHeader("Conversas","Mensagens recebidas pelo assistente e pelo site.")}<div class="message-layout"><section class="conversation">${thread?`<div class="conversation-head"><span class="item-avatar">${escapeHTML(initials(thread.name))}</span><span><b>${escapeHTML(thread.name)}</b><small>${escapeHTML(thread.contact||"Conversa do site")}</small></span></div><div class="conversation-body">${thread.messages.map(item=>`<div class="chat-bubble ${item.from==="artista"?"user":"assistant"}">${escapeHTML(item.text)}</div>`).join("")}</div><form class="conversation-compose" id="artistReplyForm"><input id="artistReply" placeholder="Responder ao cliente..." required><button>Enviar resposta</button></form>`:empty("Nenhuma conversa recebida")}</section><aside class="chat-list"><h3>CLIENTES</h3>${messages.length?messages.map(item=>`<button class="chat-contact ${item.id===threadId?"active":""}" data-thread="${item.id}"><span class="item-avatar">${escapeHTML(initials(item.name))}</span><span><b>${escapeHTML(item.name)}</b><small>${escapeHTML(item.messages[item.messages.length-1]?.text||"")}</small></span></button>`).join(""):empty("Sem conversas")}</aside></div>`;}
$$("[data-goto]",content).forEach(button=>button.addEventListener("click",()=>showDashboard(button.dataset.goto)));
const replyForm=$("#artistReplyForm");if(replyForm)replyForm.addEventListener("submit",event=>{event.preventDefault();const text=$("#artistReply").value.trim();const threads=load(STORAGE.messages,[]);const thread=threads.find(item=>item.id===activeConversation)||threads[0];if(!thread||!text)return;recordMessage({threadId:thread.id,name:thread.name,contact:thread.contact,text,from:"artista"});showDashboard("messages");});
}
$("#dashboardContent").addEventListener("click",handleDashboardAction);
function handleDashboardAction(event){const decalque=event.target.closest("[data-open-decalque]");if(decalque){openDecalque();return;}const thread=event.target.closest("[data-thread]");if(thread){activeConversation=thread.dataset.thread;showDashboard("messages");return;}const remove=event.target.closest("[data-delete-design]");if(remove){designs=designs.filter(item=>item.id!==remove.dataset.deleteDesign);save(STORAGE.gallery,designs);renderGallery();showDashboard("galleryManage");notify("Desenho removido da galeria.");return;}const confirm=event.target.closest("[data-confirm-appointment]");if(confirm){const appointments=load(STORAGE.appointments,[]).map(item=>item.id===confirm.dataset.confirmAppointment?{...item,status:"Confirmado"}:item);save(STORAGE.appointments,appointments);showDashboard("schedule");notify("Agendamento marcado como confirmado.");return;}const view=event.target.closest("[data-project]");if(view){const project=load(STORAGE.projects,[]).find(item=>item.id===view.dataset.project);if(project?.image)openDecalque(project.image,project.name);else notify(`${project?.name||"Projeto"}: ${project?.idea||"sem descrição informada"}`);return;}if(event.target.closest("#addDesign"))addDesign();}
function addDesign(){
  const modal=document.createElement("div");
  modal.className="modal-backdrop";
  modal.innerHTML=`<section class="login-modal" role="dialog" aria-modal="true" aria-labelledby="newDesignTitle"><button class="modal-close" type="button" aria-label="Fechar">×</button><div class="login-icon">◇</div><p class="eyebrow">GALERIA DO ESTÚDIO</p><h2 id="newDesignTitle">Adicionar desenho</h2><p>Cadastre uma peça com estilo, tamanho e valor inicial.</p><form id="designForm"><label for="designTitle">Nome do desenho</label><input id="designTitle" name="title" maxlength="70" required placeholder="Ex.: Ramo de lavanda"><label for="designStyle">Estilo</label><select id="designStyle" name="style"><option>Botânica</option><option>Fine line</option><option>Geométrico</option><option>Tradicional</option></select><label for="designPrice">Valor inicial (R$)</label><input id="designPrice" name="price" type="number" min="0" step="10" required value="300"><label for="designSize">Tamanho aproximado</label><input id="designSize" name="size" maxlength="40" required value="Pequeno · 8 cm"><label for="designImage">Imagem do desenho (opcional, até 8 MB)</label><input id="designImage" name="image" type="file" accept="image/png,image/jpeg,image/webp"><button class="button button-primary" type="submit">Salvar desenho <span>→</span></button></form></section>`;
  document.body.append(modal);
  const close=()=>modal.remove();
  $(".modal-close",modal).addEventListener("click",close);
  modal.addEventListener("click",event=>{if(event.target===modal)close();});
  $("#designForm",modal).addEventListener("submit",async event=>{
    event.preventDefault();
    const form=new FormData(event.currentTarget);
    const price=Number(form.get("price"));
    if(!Number.isFinite(price)||price<0){notify("Informe um valor válido.",true);return;}
    const file=form.get("image");
    let image="";
    if(file instanceof File&&file.size){
      if(!["image/jpeg","image/png","image/webp"].includes(file.type)){notify("Escolha uma imagem JPG, PNG ou WEBP.",true);return;}
      if(file.size>8*1024*1024){notify("A imagem deve ter no máximo 8 MB.",true);return;}
      try{image=await prepareImage(file);}catch(error){console.error(error);notify("Não foi possível preparar a imagem.",true);return;}
    }
    const previous=designs;
    designs=[...designs,{id:`custom-${Date.now()}`,title:String(form.get("title")).trim(),style:String(form.get("style")),price,size:String(form.get("size")).trim(),image,motif:"flower",tone:"#e6e4da"}];
    if(save(STORAGE.gallery,designs)){close();renderGallery();showDashboard("galleryManage");notify("Desenho adicionado à galeria.");}
    else designs=previous;
  });
  $("#designTitle",modal).focus();
}
function openDecalque(image=referenceData,name="Projeto de cliente"){
  if(!image){notify("Para preparar um decalque, o projeto precisa ter uma imagem de referência.",true);return;}
  const modal=document.createElement("div");
  modal.className="decalque-modal";
  modal.innerHTML=`<div class="decalque-window"><div class="decalque-top"><h2>Preparar decalque <span style="color:#85837a;font:10px var(--sans)">· ${escapeHTML(name)}</span></h2><button aria-label="Fechar">×</button></div><div class="decalque-controls"><label>Tamanho: <input type="range" min="5" max="20" value="10" id="decalqueSize"> <span id="sizeValue">10 cm</span></label><label class="toggle-control"><input type="checkbox" id="mirrorToggle" checked> Espelhar decalque</label><label class="toggle-control"><input type="checkbox" id="contrastToggle" checked> Alto contraste</label></div><div class="decalque-preview"><div class="preview-panel"><span>01 · DECALQUE PARA IMPRESSÃO</span><img alt="Prévia do decalque" src="${image}" id="decalqueImage"></div><div class="preview-panel final"><span>02 · REFERÊNCIA ORIGINAL</span><img alt="Referência original da tatuagem" src="${image}" id="finalImage"></div></div><div class="decalque-actions"><button class="button button-outline" data-download>Baixar decalque</button><button class="button button-primary" data-print>Imprimir decalque ↗</button></div></div>`;
  document.body.append(modal);
  const decalqueImage=$("#decalqueImage",modal),size=$("#decalqueSize",modal),mirror=$("#mirrorToggle",modal),contrast=$("#contrastToggle",modal);
  function update(){
    decalqueImage.style.width=`${size.value}cm`;
    decalqueImage.style.height="auto";
    decalqueImage.style.transform=`scaleX(${mirror.checked?-1:1})`;
    decalqueImage.style.filter=contrast.checked?"grayscale(1) contrast(2)":"grayscale(1)";
    $("#sizeValue",modal).textContent=`${size.value} cm`;
  }
  size.addEventListener("input",update);mirror.addEventListener("change",update);contrast.addEventListener("change",update);update();
  $(".decalque-top button",modal).addEventListener("click",()=>modal.remove());
  modal.addEventListener("click",event=>{if(event.target===modal)modal.remove();});
  $("[data-print]",modal).addEventListener("click",()=>window.print());
  $("[data-download]",modal).addEventListener("click",()=>{
    const original=$("#finalImage",modal);
    if(!original.complete||!original.naturalWidth){notify("Aguarde a imagem terminar de carregar.",true);return;}
    const canvas=document.createElement("canvas");canvas.width=original.naturalWidth;canvas.height=original.naturalHeight;
    const context=canvas.getContext("2d");
    if(!context){notify("Não foi possível gerar o decalque neste navegador.",true);return;}
    context.filter=contrast.checked?"grayscale(1) contrast(2)":"grayscale(1)";
    if(mirror.checked){context.translate(canvas.width,0);context.scale(-1,1);}
    context.drawImage(original,0,0);
    canvas.toBlob(blob=>{
      if(!blob){notify("Não foi possível baixar o decalque.",true);return;}
      const link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download="decalque-espelhado.png";link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);
    },"image/png");
  });
}
function init(){renderGallery();const minDate=new Date();minDate.setMinutes(minDate.getMinutes()-minDate.getTimezoneOffset());$("#bookingDate").min=minDate.toISOString().slice(0,10);}
init();

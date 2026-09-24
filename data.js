window.CHEM_DATA = (() => {
const elements = [
[1,'H','Hydrogen',1,1,'nonmetal'],[2,'He','Helium',1,18,'noble'],
[3,'Li','Lithium',2,1,'alkali'],[4,'Be','Beryllium',2,2,'alkaline'],[5,'B','Boron',2,13,'metalloid'],[6,'C','Carbon',2,14,'nonmetal'],[7,'N','Nitrogen',2,15,'nonmetal'],[8,'O','Oxygen',2,16,'nonmetal'],[9,'F','Fluorine',2,17,'halogen'],[10,'Ne','Neon',2,18,'noble'],
[11,'Na','Sodium',3,1,'alkali'],[12,'Mg','Magnesium',3,2,'alkaline'],[13,'Al','Aluminium',3,13,'post'],[14,'Si','Silicon',3,14,'metalloid'],[15,'P','Phosphorus',3,15,'nonmetal'],[16,'S','Sulfur',3,16,'nonmetal'],[17,'Cl','Chlorine',3,17,'halogen'],[18,'Ar','Argon',3,18,'noble'],
[19,'K','Potassium',4,1,'alkali'],[20,'Ca','Calcium',4,2,'alkaline'],[21,'Sc','Scandium',4,3,'transition'],[22,'Ti','Titanium',4,4,'transition'],[23,'V','Vanadium',4,5,'transition'],[24,'Cr','Chromium',4,6,'transition'],[25,'Mn','Manganese',4,7,'transition'],[26,'Fe','Iron',4,8,'transition'],[27,'Co','Cobalt',4,9,'transition'],[28,'Ni','Nickel',4,10,'transition'],[29,'Cu','Copper',4,11,'transition'],[30,'Zn','Zinc',4,12,'transition'],[31,'Ga','Gallium',4,13,'post'],[32,'Ge','Germanium',4,14,'metalloid'],[33,'As','Arsenic',4,15,'metalloid'],[34,'Se','Selenium',4,16,'nonmetal'],[35,'Br','Bromine',4,17,'halogen'],[36,'Kr','Krypton',4,18,'noble'],
[37,'Rb','Rubidium',5,1,'alkali'],[38,'Sr','Strontium',5,2,'alkaline'],[39,'Y','Yttrium',5,3,'transition'],[40,'Zr','Zirconium',5,4,'transition'],[41,'Nb','Niobium',5,5,'transition'],[42,'Mo','Molybdenum',5,6,'transition'],[43,'Tc','Technetium',5,7,'transition'],[44,'Ru','Ruthenium',5,8,'transition'],[45,'Rh','Rhodium',5,9,'transition'],[46,'Pd','Palladium',5,10,'transition'],[47,'Ag','Silver',5,11,'transition'],[48,'Cd','Cadmium',5,12,'transition'],[49,'In','Indium',5,13,'post'],[50,'Sn','Tin',5,14,'post'],[51,'Sb','Antimony',5,15,'metalloid'],[52,'Te','Tellurium',5,16,'metalloid'],[53,'I','Iodine',5,17,'halogen'],[54,'Xe','Xenon',5,18,'noble'],
[55,'Cs','Caesium',6,1,'alkali'],[56,'Ba','Barium',6,2,'alkaline'],[57,'La','Lanthanum',8,3,'lanth'],[58,'Ce','Cerium',8,4,'lanth'],[59,'Pr','Praseodymium',8,5,'lanth'],[60,'Nd','Neodymium',8,6,'lanth'],[61,'Pm','Promethium',8,7,'lanth'],[62,'Sm','Samarium',8,8,'lanth'],[63,'Eu','Europium',8,9,'lanth'],[64,'Gd','Gadolinium',8,10,'lanth'],[65,'Tb','Terbium',8,11,'lanth'],[66,'Dy','Dysprosium',8,12,'lanth'],[67,'Ho','Holmium',8,13,'lanth'],[68,'Er','Erbium',8,14,'lanth'],[69,'Tm','Thulium',8,15,'lanth'],[70,'Yb','Ytterbium',8,16,'lanth'],[71,'Lu','Lutetium',8,17,'lanth'],[72,'Hf','Hafnium',6,4,'transition'],[73,'Ta','Tantalum',6,5,'transition'],[74,'W','Tungsten',6,6,'transition'],[75,'Re','Rhenium',6,7,'transition'],[76,'Os','Osmium',6,8,'transition'],[77,'Ir','Iridium',6,9,'transition'],[78,'Pt','Platinum',6,10,'transition'],[79,'Au','Gold',6,11,'transition'],[80,'Hg','Mercury',6,12,'transition'],[81,'Tl','Thallium',6,13,'post'],[82,'Pb','Lead',6,14,'post'],[83,'Bi','Bismuth',6,15,'post'],[84,'Po','Polonium',6,16,'post'],[85,'At','Astatine',6,17,'halogen'],[86,'Rn','Radon',6,18,'noble'],
[87,'Fr','Francium',7,1,'alkali'],[88,'Ra','Radium',7,2,'alkaline'],[89,'Ac','Actinium',9,3,'act'],[90,'Th','Thorium',9,4,'act'],[91,'Pa','Protactinium',9,5,'act'],[92,'U','Uranium',9,6,'act'],[93,'Np','Neptunium',9,7,'act'],[94,'Pu','Plutonium',9,8,'act'],[95,'Am','Americium',9,9,'act'],[96,'Cm','Curium',9,10,'act'],[97,'Bk','Berkelium',9,11,'act'],[98,'Cf','Californium',9,12,'act'],[99,'Es','Einsteinium',9,13,'act'],[100,'Fm','Fermium',9,14,'act'],[101,'Md','Mendelevium',9,15,'act'],[102,'No','Nobelium',9,16,'act'],[103,'Lr','Lawrencium',9,17,'act'],[104,'Rf','Rutherfordium',7,4,'transition'],[105,'Db','Dubnium',7,5,'transition'],[106,'Sg','Seaborgium',7,6,'transition'],[107,'Bh','Bohrium',7,7,'transition'],[108,'Hs','Hassium',7,8,'transition'],[109,'Mt','Meitnerium',7,9,'transition'],[110,'Ds','Darmstadtium',7,10,'transition'],[111,'Rg','Roentgenium',7,11,'transition'],[112,'Cn','Copernicium',7,12,'transition'],[113,'Nh','Nihonium',7,13,'post'],[114,'Fl','Flerovium',7,14,'post'],[115,'Mc','Moscovium',7,15,'post'],[116,'Lv','Livermorium',7,16,'post'],[117,'Ts','Tennessine',7,17,'halogen'],[118,'Og','Oganesson',7,18,'noble']
];

const compounds = [
  {f:'H2O',name:'Nước',kind:'solvent',color:'#8ad7ff',phase:'l',ph:7},
  {f:'HCl',name:'Axit clohiđric',kind:'acid',color:'#d6f4ff',phase:'aq',ph:1},
  {f:'H2SO4',name:'Axit sulfuric',kind:'acid',color:'#e8f7ff',phase:'aq',ph:1},
  {f:'HNO3',name:'Axit nitric',kind:'acid',color:'#e6f4ff',phase:'aq',ph:1},
  {f:'NaOH',name:'Natri hiđroxit',kind:'base',color:'#d8f7ff',phase:'aq',ph:13},
  {f:'KOH',name:'Kali hiđroxit',kind:'base',color:'#e0f9ff',phase:'aq',ph:13},
  {f:'Ca(OH)2',name:'Nước vôi trong',kind:'base',color:'#f1fbff',phase:'aq',ph:12},
  {f:'NaCl',name:'Natri clorua',kind:'salt',color:'#d8f5ff',phase:'aq',ph:7},
  {f:'AgNO3',name:'Bạc nitrat',kind:'salt',color:'#e7f8ff',phase:'aq',ph:6},
  {f:'CuSO4',name:'Đồng(II) sulfat',kind:'salt',color:'#2e8cff',phase:'aq',ph:5},
  {f:'FeCl3',name:'Sắt(III) clorua',kind:'salt',color:'#d89a31',phase:'aq',ph:3},
  {f:'FeSO4',name:'Sắt(II) sulfat',kind:'salt',color:'#79ad7f',phase:'aq',ph:5},
  {f:'BaCl2',name:'Bari clorua',kind:'salt',color:'#e5f6ff',phase:'aq',ph:7},
  {f:'Na2SO4',name:'Natri sulfat',kind:'salt',color:'#e5f6ff',phase:'aq',ph:7},
  {f:'Pb(NO3)2',name:'Chì(II) nitrat',kind:'salt',color:'#e6f4ff',phase:'aq',ph:6},
  {f:'KI',name:'Kali iodua',kind:'salt',color:'#f1efd6',phase:'aq',ph:7},
  {f:'Na2CO3',name:'Natri cacbonat',kind:'salt',color:'#ecf8ff',phase:'aq',ph:11},
  {f:'NaHCO3',name:'Natri hiđrocacbonat',kind:'salt',color:'#f5fbff',phase:'aq',ph:8.3},
  {f:'NH4Cl',name:'Amoni clorua',kind:'salt',color:'#eef8ff',phase:'aq',ph:5.5},
  {f:'KMnO4',name:'Kali pemanganat',kind:'salt',color:'#7a37b8',phase:'aq',ph:7},
  {f:'H2O2',name:'Hiđro peoxit',kind:'oxidizer',color:'#dff8ff',phase:'aq',ph:5},
  {f:'CaCO3',name:'Canxi cacbonat',kind:'solid',color:'#f4f4ef',phase:'s',ph:7},
  {f:'CuO',name:'Đồng(II) oxit',kind:'solid',color:'#24282c',phase:'s',ph:7},
  {f:'CaO',name:'Canxi oxit',kind:'solid',color:'#eeeeea',phase:'s',ph:7},
  {f:'MnO2',name:'Mangan(IV) oxit',kind:'catalyst',color:'#2a2a2a',phase:'s',ph:7},
  {f:'Zn',name:'Kẽm',kind:'metal',color:'#bfc5cb',phase:'s',ph:7},
  {f:'Mg',name:'Magiê',kind:'metal',color:'#d9dde0',phase:'s',ph:7},
  {f:'Fe',name:'Sắt',kind:'metal',color:'#8f969d',phase:'s',ph:7},
  {f:'Cu',name:'Đồng',kind:'metal',color:'#c46f3d',phase:'s',ph:7},
  {f:'Al',name:'Nhôm',kind:'metal',color:'#c8d0d8',phase:'s',ph:7},
  {f:'Na',name:'Natri',kind:'metal',color:'#d7d9d0',phase:'s',ph:7},
  {f:'K',name:'Kali',kind:'metal',color:'#c5c9c0',phase:'s',ph:7},
  {f:'Ca',name:'Canxi',kind:'metal',color:'#c8cbc3',phase:'s',ph:7},
  {f:'NH3',name:'Amoniac',kind:'gas',color:'#e7fbff',phase:'g',ph:11}
];

const reactions = [
 {id:'neutral_hcl',r:{HCl:1,NaOH:1},p:{NaCl:1,H2O:1},eq:'HCl + NaOH → NaCl + H₂O',kind:'heat',heat:18,note:'Phản ứng trung hòa axit–bazơ.'},
 {id:'neutral_h2so4',r:{H2SO4:1,NaOH:2},p:{Na2SO4:1,H2O:2},eq:'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',kind:'heat',heat:24,note:'Trung hòa axit sulfuric bằng bazơ.'},
 {id:'agcl',r:{AgNO3:1,NaCl:1},p:{AgCl:1,NaNO3:1},eq:'AgNO₃ + NaCl → AgCl↓ + NaNO₃',kind:'precip',precip:'AgCl',precipColor:'#f3f3ed',note:'Kết tủa trắng bạc clorua.'},
 {id:'cuoh2',r:{CuSO4:1,NaOH:2},p:{'Cu(OH)2':1,Na2SO4:1},eq:'CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄',kind:'precip',precip:'Cu(OH)2',precipColor:'#42a5e8',note:'Kết tủa xanh lam Cu(OH)₂.'},
 {id:'feoh3',r:{FeCl3:1,NaOH:3},p:{'Fe(OH)3':1,NaCl:3},eq:'FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl',kind:'precip',precip:'Fe(OH)3',precipColor:'#9c5c32',note:'Kết tủa nâu đỏ Fe(OH)₃.'},
 {id:'baso4',r:{BaCl2:1,Na2SO4:1},p:{BaSO4:1,NaCl:2},eq:'BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl',kind:'precip',precip:'BaSO4',precipColor:'#f5f5f2',note:'Kết tủa trắng BaSO₄.'},
 {id:'pbi2',r:{'Pb(NO3)2':1,KI:2},p:{PbI2:1,KNO3:2},eq:'Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃',kind:'precip',precip:'PbI2',precipColor:'#f6ce35',note:'Kết tủa vàng PbI₂.'},
 {id:'carbonate_acid',r:{CaCO3:1,HCl:2},p:{CaCl2:1,H2O:1,CO2:1},eq:'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑',kind:'gas',gas:'CO2',note:'Giải phóng CO₂, quan sát thấy sủi bọt.'},
 {id:'bicarb_acid',r:{NaHCO3:1,HCl:1},p:{NaCl:1,H2O:1,CO2:1},eq:'NaHCO₃ + HCl → NaCl + H₂O + CO₂↑',kind:'gas',gas:'CO2',note:'Giải phóng CO₂.'},
 {id:'na2co3_acid',r:{Na2CO3:1,HCl:2},p:{NaCl:2,H2O:1,CO2:1},eq:'Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑',kind:'gas',gas:'CO2',note:'Cacbonat tác dụng với axit.'},
 {id:'zn_hcl',r:{Zn:1,HCl:2},p:{ZnCl2:1,H2:1},eq:'Zn + 2HCl → ZnCl₂ + H₂↑',kind:'gas',gas:'H2',heat:8,note:'Kẽm đẩy hiđro khỏi axit.'},
 {id:'mg_hcl',r:{Mg:1,HCl:2},p:{MgCl2:1,H2:1},eq:'Mg + 2HCl → MgCl₂ + H₂↑',kind:'gas',gas:'H2',heat:14,note:'Magiê phản ứng với axit mạnh hơn kẽm.'},
 {id:'fe_cuso4',r:{Fe:1,CuSO4:1},p:{FeSO4:1,Cu:1},eq:'Fe + CuSO₄ → FeSO₄ + Cu',kind:'deposit',deposit:'Cu',depositColor:'#b96d3d',note:'Đồng kim loại bám lên bề mặt.'},
 {id:'cu_agno3',r:{Cu:1,AgNO3:2},p:{'Cu(NO3)2':1,Ag:2},eq:'Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag',kind:'deposit',deposit:'Ag',depositColor:'#d8dde3',note:'Tinh thể bạc tạo thành trên đồng.'},
 {id:'cuo_hcl',r:{CuO:1,HCl:2},p:{CuCl2:1,H2O:1},eq:'CuO + 2HCl → CuCl₂ + H₂O',kind:'heat',heat:6,note:'Oxit bazơ tác dụng với axit.'},
 {id:'lime_co2',r:{CO2:1,'Ca(OH)2':1},p:{CaCO3:1,H2O:1},eq:'CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O',kind:'precip',precip:'CaCO3',precipColor:'#f1f1ee',note:'Nước vôi trong hóa đục.'},
 {id:'h2o2',r:{H2O2:2},p:{H2O:2,O2:1},eq:'2H₂O₂ → 2H₂O + O₂↑',kind:'gas',gas:'O2',requiresAny:['heat','MnO2'],note:'H₂O₂ phân hủy nhanh hơn khi được đun hoặc có xúc tác MnO₂.'},
 {id:'nh4cl_naoh',r:{NH4Cl:1,NaOH:1},p:{NaCl:1,H2O:1,NH3:1},eq:'NH₄Cl + NaOH → NaCl + H₂O + NH₃↑',kind:'gas',gas:'NH3',requiresAny:['heat'],note:'Khi đun, giải phóng khí NH₃.'},
 {id:'cao_water',r:{CaO:1,H2O:1},p:{'Ca(OH)2':1},eq:'CaO + H₂O → Ca(OH)₂',kind:'heat',heat:35,note:'Vôi sống tác dụng với nước, tỏa nhiệt.'},
 {id:'na_water',r:{Na:2,H2O:2},p:{NaOH:2,H2:1},eq:'2Na + 2H₂O → 2NaOH + H₂↑',kind:'violent',gas:'H2',heat:70,note:'Mô phỏng phản ứng mạnh của kim loại kiềm với nước.'},
 {id:'k_water',r:{K:2,H2O:2},p:{KOH:2,H2:1},eq:'2K + 2H₂O → 2KOH + H₂↑',kind:'violent',gas:'H2',heat:90,note:'Mô phỏng phản ứng rất mạnh của kali với nước.'},
 {id:'ca_water',r:{Ca:1,H2O:2},p:{'Ca(OH)2':1,H2:1},eq:'Ca + 2H₂O → Ca(OH)₂ + H₂↑',kind:'gas',gas:'H2',heat:12,note:'Canxi phản ứng với nước giải phóng H₂.'}
];

const demos = [
  {title:'Mưa vàng',desc:'Tạo kết tủa PbI₂ màu vàng.',spawn:['Pb(NO3)2','KI']},
  {title:'Mây xanh',desc:'Tạo kết tủa Cu(OH)₂ xanh lam.',spawn:['CuSO4','NaOH']},
  {title:'Sủi CO₂',desc:'Cho cacbonat gặp axit.',spawn:['CaCO3','HCl']},
  {title:'Phân hủy H₂O₂',desc:'So sánh khi đun hoặc thêm MnO₂.',spawn:['H2O2','MnO2']},
  {title:'Kim loại + nước',desc:'Hiệu ứng mạnh chỉ trong mô phỏng.',spawn:['Na','H2O']}
];

return {elements, compounds, reactions, demos};
})();

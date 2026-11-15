"""Build the three-page portfolio from the Final / this assets.
Run with a Python environment containing reportlab, Pillow and fonttools.
PIN_KOREAN_FONT can override the default installed Noto Sans KR path.
"""
from pathlib import Path
import os
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
FONT=os.environ.get('PIN_KOREAN_FONT',str(ROOT/'assets/fonts/NotoSansKR-Regular.ttf'))
pdfmetrics.registerFont(TTFont('KR',FONT))
pdfmetrics.registerFont(TTFont('KRBold',str(ROOT/'assets/fonts/NotoSansKR-Bold.ttf')))
W,H=1440,900
OUT=ROOT/'downloads/claude-pin-portfolio.pdf'
c=canvas.Canvas(str(OUT),pagesize=(W,H),pageCompression=1)
c.setTitle('Claude Pin | 여남규 | UX Portfolio')
c.setAuthor('Namkyu Yeo')
PAPER='#faf9f5';BOARD='#f0eee6';INK='#141413';MUTE='#68675f';LINE='#e3e0d5';ACC='#bc5636';MARK='#f8d6ab'
def rect(x,y,w,h,color,r=0,stroke=None):
 c.setFillColor(HexColor(color));c.setStrokeColor(HexColor(stroke or color));c.setLineWidth(.7)
 if r:c.roundRect(x,H-y-h,w,h,r,fill=1,stroke=bool(stroke))
 else:c.rect(x,H-y-h,w,h,fill=1,stroke=bool(stroke))
def text(x,y,s,size=18,color=INK,font='KR'):
 font = 'KRBold' if font == 'KR' and size >= 23 else font
 c.setFont(font,size);c.setFillColor(HexColor(color));c.drawString(x,H-y-size,s)
def para(x,y,s,width,size=18,color=MUTE,leading=None):
 leading=leading or size*1.6
 lines=[]
 for line in s.split('\n'):
  current=''
  for word in line.split(' '):
   candidate=(current+' '+word).strip()
   if pdfmetrics.stringWidth(candidate,'KR',size)>width and current:lines.append(current);current=word
   else:current=candidate
  lines.append(current)
 for i,line in enumerate(lines):text(x,y+i*leading,line,size,color)
 return y+len(lines)*leading
def rule(x,y,w):rect(x,y,w,1,LINE)
def img(name,x,y,w,h=None):
 path=ROOT/'assets'/name
 iw,ih=Image.open(path).size
 if h is None:h=w*ih/iw
 c.saveState()
 clip=c.beginPath();clip.roundRect(x,H-y-h,w,h,(20*w/316) if name.startswith('pin-card') else 8)
 c.clipPath(clip,stroke=0,fill=0)
 c.drawImage(str(path),x,H-y-h,width=w,height=h,preserveAspectRatio=True,anchor='c',mask='auto')
 c.restoreState()
 return h
def base(n,label):
 rect(0,0,W,H,PAPER);text(56,30,'Claude Pin',15);text(230,32,label,11,MUTE);text(1335,30,f'0{n} / 03',13,MUTE);rule(56,68,1328)
 rule(56,844,1328);text(56,860,'여남규  /  Namkyu Yeo',12,MUTE);text(888,860,'KAIST ID307 · 2026 · Personal concept',12,MUTE)
 c.linkURL('https://www.figma.com/design/IIHWlB9DJGK7p6CIbemmWu/for-Claude?node-id=4133-1061',(1265,17,1384,42),relative=0)
 text(1270,860,'Figma 원본 ↗',12,MUTE)
def label(x,y,n,title):text(x,y,n,12,ACC);text(x+36,y-2,title,19)
# 01 — An immediate view of the final product, with concise problem framing.
base(1,'OVERVIEW / PROBLEM / DIRECTION')
text(56,104,'AI CONVERSATION, RECONSIDERED',12,ACC)
text(50,137,'Claude Pin',83,INK,'Helvetica-Bold')
text(56,258,'대화에서 건진 문장에,',29)
rect(52,306,286,44,MARK,3);text(56,307,'돌아가는 길을 남기다.',29)
para(56,382,'문장을 끌어 담고, 정리하고,\n원래 대화의 그 문장으로 돌아가는 경험.',490,20)
rule(56,493,480)
text(56,513,'ROLE',11,MUTE);para(130,508,'리서치 · IA · UI 설계 · 프로토타이핑',405,16,INK)
text(56,553,'PERIOD',11,MUTE);text(130,548,'2026.03 - 04 / 개인 프로젝트',16)
text(56,593,'TOOLS',11,MUTE);text(130,588,'Figma · Claude · HTML / CSS / JS',16)
img('flow-place.png',588,106,796)
text(588,685,'FINAL / THIS',11,ACC);text(716,680,'문장을 선택해 카드 사이에 놓는 순간',17)
rule(56,730,1328)
label(56,752,'01','문제');para(56,786,'다른 앱에 복사한 문장은 원래 질문과 맥락을 잃습니다.',395,16)
label(510,752,'02','관점');para(510,786,'저장한 문장을 대화로 다시 들어가는 입구로 만듭니다.',395,16)
label(964,752,'03','제안');para(964,786,'문장과 출처를 함께 보존하는 핀 보드를 설계했습니다.',400,16)
c.showPage()
# 02 — Main flow, directly from for-Claude / final / this.
base(2,'FINAL EXPERIENCE / MAIN FLOW')
text(56,99,'문장 하나를 끌면, 맥락이 따라옵니다.',38)
text(56,159,'선택 → 드래그 → 삽입 → 보관 → 보드 확장 → 원문 복귀',17,MUTE)
cols=[56,510,964]; cw=420
items=[('flow-place.png','01 / Capture','선택한 문장을 원하는 자리에','선택 영역이 반투명 카드가 되고, 삽입선이 놓을 위치를 알려줍니다. 문장과 원문 링크가 함께 저장됩니다.'),('flow-board.png','02 / Organize','대화 옆에서, 넓은 보드로','필요할 때 보드를 펼쳐 여러 대화의 핀을 한눈에 봅니다. 검색과 댓글로 생각을 찾고 이어갑니다.'),('flow-return.png','03 / Return','핀에서 원래 문장으로','카드의 출처를 누르면 해당 대화의 문장이 강조됩니다. 저장한 생각에서 질문을 다시 이어갑니다.')]
for x,(file,kicker,title,body) in zip(cols,items):
 img(file,x,210,cw);text(x,526,kicker,13,ACC);text(x,555,title,23);para(x,598,body,cw,17)
rule(56,694,1328)
for x,n,title,body in [(56,'A','드래그 카드','선택한 범위가 곧 저장할 내용입니다.'),(510,'B','삽입선','카드 사이의 정확한 위치를 미리 보여줍니다.'),(964,'C','원문 링크','세션과 문장 위치를 함께 보존합니다.')]:
 label(x,718,n,title);para(x,758,body,410,17)
text(56,811,'사용자 테스트 전 단계의 동작 프로토타입. 실제 AI 모델·협업·공유 기능은 포함하지 않습니다.',12,MUTE)
c.showPage()
# 03 — Reuse, decisions and honest validation status.
base(3,'COMPONENTS / DESIGN DECISIONS / NEXT')
text(56,99,'익숙한 기반 위에, 핀을 위한 작은 확장.',38)
para(56,161,'기존 Sidebar · Claude response · Chat input을 바탕으로, 핀 카드와 저장 상태를 같은 시각 언어로 연결했습니다.',1328,18)
rect(56,220,838,256,BOARD,12)
img('pin-card-a.png',80,250,390)
img('pin-card-b.png',486,250,384)
text(56,496,'PIN CARD',12,ACC);text(56,525,'문장 + 출처 + 댓글',24)
para(56,567,'원본 카드의 20px 모서리, 얇은 경계, 출처 링크와 댓글 구분선을 유지했습니다. 내용은 바뀌어도 정보를 읽는 순서는 같습니다.',788,18)
text(950,220,'설계가 바뀐 이유',24)
for y,k,t,b in [(272,'01','메모 탭 → 사이드 보드','저장한 문장을 보려고 대화를 떠나지 않도록.'),(375,'02','메시지 전체 → 선택한 문장','정말 필요한 범위만 빠르게 담도록.'),(478,'03','텍스트 사본 → 원문 연결','저장한 생각에서 다시 대화를 이어가도록.')]:
 text(950,y,k,12,ACC);text(987,y-3,t,19);para(987,y+34,b,390,16)
rule(56,657,1328)
text(56,683,'재사용한 원본 에셋',20)
text(56,724,'Sidebar · Chats · Search · Expand',16,MUTE)
text(56,756,'Spark · Copy · Feedback · Avatar',16,MUTE)
text(56,804,'for-Claude / final / this 기준',12,ACC)
text(510,683,'세 가지 시각 규칙',20)
for i,(color,name) in enumerate([(PAPER,'대화와 이어지는 배경'),(MARK,'선택과 원문 강조'),('#d97757','드래그와 삽입의 피드백')]):
 rect(510,727+i*30,20,20,color,3,LINE);text(542,725+i*30,name,16,MUTE)
text(964,683,'다음 검증',20)
para(964,724,'드래그 저장을 스스로 발견하는가?\n원문 복귀 경로를 쉽게 이해하는가?\n모바일의 선택 후 핀 버튼은 충분한가?',420,17)
c.save()
print(OUT)

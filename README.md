# Claude Pin

여남규의 KAIST ID307 개인 UX 컨셉 프로젝트. 문장을 선택해 핀하고 원래 대화로 돌아가는 경험입니다.

## 시작하기

`index.html`을 브라우저로 열면 됩니다. 빌드와 외부 네트워크 요청 없이 실행됩니다. GitHub Pages에는 이 폴더의 내용을 그대로 배포할 수 있습니다.

- `index.html`: 포트폴리오. 최종 사용자 흐름 → 문제 → 설계 과정 → 컴포넌트 → 다음 검증.
- `prototype.html`: 문장 선택, 드래그 저장, 보드 확장, 검색, 댓글, 원문 복귀.
- `components.html`: 원본 컴포넌트와 아이콘, 토큰, 상태와 동작 명세.
- `downloads/claude-pin-portfolio.pdf`: 3페이지 포트폴리오.

## 디자인 기준

[for-Claude / final / this](https://www.figma.com/design/IIHWlB9DJGK7p6CIbemmWu/for-Claude?node-id=4133-1061)를 메인 흐름으로 사용합니다.

| 상태 | Figma 노드 | 로컬 에셋 |
| --- | --- | --- |
| 문장 선택 | 4092:3177 | flow-select.png |
| 드래그 | 4092:3724 | flow-drag.png |
| 삽입 | 4092:3879 | flow-place.png |
| 보관 | 4092:3557 | flow-saved.png |
| 보드 확장 | 4092:4035 | flow-board.png |
| 원문 복귀 | 4092:2969 | flow-return.png |
| 핀 카드 | 4092:4314, 4092:4326 | pin-card-a.png, pin-card-b.png |

포트폴리오 이미지는 최종 화면을 소개하는 원본 렌더입니다. 체험 페이지는 HTML/CSS/JS 구현이며 원본 SVG 아이콘을 재사용합니다. 데스크톱에서는 사이드 보드를 연 상태로 시작하고 원문 복귀 후에도 유지합니다. 모바일에서는 원문 복귀 시 보드를 닫습니다.

## 코드 구성

- `tokens.css`: 로컬 글꼴, 공통 색·간격·반경
- `portfolio.css`, `portfolio.js`: 반응형 포트폴리오, 키보드 접근 가능한 흐름 탭
- `flow-data.js`, `asset-map.json`: 메인 흐름, 원본 노드 매핑
- `styles.css`, `prototype.css`, `app.js`: 기존 프로토타입 동작과 Final 스타일
- `assets/icons/`: Figma 원본 SVG
- `scripts/build_portfolio.py`: PDF 재생성 (`reportlab`, `Pillow` 필요)

```sh
python3 scripts/build_portfolio.py
```

## 범위와 검증

학생 개인 컨셉으로 Anthropic과 관련이 없습니다. 사용자 테스트 전 단계이며 대화는 예시 응답입니다. 실제 AI 모델, 협업, 공유는 구현하지 않았습니다. 핀과 댓글은 현재 브라우저의 localStorage에 저장되며 초기화 버튼은 예시 핀으로 되돌립니다.

JavaScript 구문, 내부 링크·에셋 경로, ID 중복, 이미지 대체 텍스트를 확인했고 PDF 3페이지를 렌더링해 검사했습니다. 환경의 서버·브라우저 제한으로 실제 웹 렌더링과 드래그 회귀 검증은 미완료입니다. GitHub에 커밋하거나 배포하지 않았습니다.

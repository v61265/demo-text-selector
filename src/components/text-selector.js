import React, {
  useCallback,
  useEffect,
  useRef,
  useState /* eslint-disable-line */,
} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import 'regenerator-runtime/runtime';

/**
 *  @param {Object} opts
 *  @param {string} [opts.className]
 *  @param {string} [jsonUrl]
 *  @param {string} [backgroundColor]
 */
export default function TextSelector({
  className,
  jsonUrl = 'https://storage.googleapis.com/data-journalism-public/2023_psycho/ai_thousand.json',
  backgroundColor = '#000000',
  circleUrl = 'https://storage.googleapis.com/statics.mirrormedia.mg/campaigns/tyreplus2022/hsuan_test.png',
  buttonBackground = 'https://storage.googleapis.com/statics.mirrormedia.mg/campaigns/tyreplus2022/%E6%9C%AA%E5%91%BD%E5%90%8D%E7%9A%84%E4%BD%9C%E5%93%81%20%E6%8B%B7%E8%B2%9D2%202.png',
  buttonWording = '其他案例',
}) {
  const firstOrder = 0;
  const allContainerRef = useRef(null);
  const nowEmphasizedSpanRef = useRef(null);
  const listRef = useRef(null);
  const [data, setData] = useState([]);
  const [emphasizedIndex, setEmphasizedIndex] = useState(0);
  const [leftOffset, setLeftOffset] = useState(0);
  const [isEmphasized, setIsEmphasized] = useState(false);
  const [translateToParagraph, settranslateToParagraph] = useState(0);

  function removeHtmlTags(inputString) {
    const regex = /(<([^>]+)>)/gi;
    return inputString.replace(regex, '');
  }

  const fetchData = useCallback(async () => {
    try {
      const { data } = await axios.get(jsonUrl);
      const orderArray = Array.from(
        { length: data.length - 1 },
        (_, index) => index + 1
      );
      setData(
        data.map((item, index) => {
          if (index === firstOrder) {
            return {
              ...item,
              order: 0,
            };
          }
          const randomIndex = Math.floor(Math.random() * orderArray.length);
          const order = orderArray.splice(randomIndex, 1)[0];
          return {
            ...item,
            order,
          };
        })
      );
    } catch (e) {
      console.log(e);
    }
  }, [jsonUrl]);

  const handleOnClick = () => {
    if (isEmphasized) return;
    setEmphasizedIndex((prev) => prev + 1);
    setIsEmphasized(true);
  };

  const handleOnClickBtn = () => {
    if (!isEmphasized) return;
    setIsEmphasized(false);
  };

  useEffect(() => {
    // Adjust video block to cover the whole viewport (100vw)
    const shiftLeft = function () {
      const containerElement = allContainerRef.current;
      if (typeof containerElement?.getBoundingClientRect === 'function') {
        const rect = containerElement.getBoundingClientRect();
        const leftOffset = rect?.x ?? rect?.left ?? 0;
        setLeftOffset(leftOffset);
      }
    };
    shiftLeft();

    fetchData();

    // wait 5s and emphasized first item
    setTimeout(() => {
      setIsEmphasized(true);
    }, 5000);
  }, []);

  useEffect(() => {
    if (nowEmphasizedSpanRef.current) {
      settranslateToParagraph(
        listRef.current.offsetLeft - nowEmphasizedSpanRef.current.offsetLeft
      );
      window.scrollTo({
        top:
          nowEmphasizedSpanRef.current?.offsetTop +
          nowEmphasizedSpanRef.current?.offsetHeight +
          500,
        behavior: 'smooth',
      });
    }
  }, [emphasizedIndex, isEmphasized, nowEmphasizedSpanRef]);

  return (
    <Container
      ref={allContainerRef}
      className={className}
      style={{ background: backgroundColor }}
      leftOffset={leftOffset}
      onClick={handleOnClick}
    >
      <CaseList ref={listRef}>
        {data?.map((dataItem, index) => {
          return (
            <span key={index}>
              {dataItem.order === emphasizedIndex && isEmphasized ? (
                <EmphasizeWrapper ref={nowEmphasizedSpanRef}>
                  <EmphasizedItem
                    key={index}
                    dangerouslySetInnerHTML={{ __html: dataItem.content }}
                  />
                  <EmpasizedCircle
                    src={circleUrl}
                    translateToParagraph={translateToParagraph}
                  />
                  <NextBtn
                    buttonBackground={buttonBackground}
                    translateToParagraph={translateToParagraph}
                    paraWidth={listRef.current?.offsetWidth}
                    onClick={handleOnClickBtn}
                  >
                    {buttonWording}
                  </NextBtn>
                </EmphasizeWrapper>
              ) : (
                <GreyItem key={index} isAnimation={!isEmphasized}>
                  {removeHtmlTags(dataItem.content)}
                </GreyItem>
              )}
            </span>
          );
        })}
      </CaseList>
    </Container>
  );
}

const Container = styled.div`
  z-index: 100;
  position: relative;
  min-width: 100vw;
  max-width: 100vw;
  min-height: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  ${
    /**
     * @param {Object} props
     * @param {number} props.leftOffset
     */
    (props) => {
      const leftOffset = props.leftOffset;
      return `transform: translateX(${0 - leftOffset}px);`;
    }
  };
`;

const CaseList = styled.ul`
  max-width: 712px;
  margin: 48px 20px;
  font-family: 'Noto Sans TC';
  font-style: normal;
  font-weight: 350;
  font-size: 14px;
  line-height: 180%;
  text-align: justify;
  color: #fff;
`;
const GreyItem = styled.li`
  display: inline;
  color: #505050;
  ${(props) =>
    props.isAnimation &&
    `
    background: rgba(225, 225, 225, 0.3);
  `}
`;

const EmphasizeWrapper = styled.span`
  position: relative;
`;

const EmpasizedCircle = styled.img`
  position: absolute;
  top: 0px;
  left: 0;
  background-size: 100% 100%;
  content: '';
  width: 100vw;
  max-width: 900px;
  height: calc(200% + 100px);
  transform: translate(${(props) => props.translateToParagraph - 40}px, -50px);
`;

const EmphasizedItem = styled.span``;

const NextBtn = styled.button`
  position: absolute;
  bottom: -100%;
  left: 0;
  width: 129px;
  height: 70px;
  dispaly: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0);
  font-weight: 350;
  font-size: 14px;
  line-height: 180%;
  color: #ffffff;
  background-image: url(${(props) => props.buttonBackground});
  border: 0;
  outline: 0;
  transform: translate(
    calc(
      ${(props) => props.translateToParagraph + props.paraWidth * 0.5}px - 50%
    ),
    100px
  );
  &:hover {
    cursor: pointer;
  }
`;

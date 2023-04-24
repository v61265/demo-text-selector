import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState /* eslint-disable-line */,
} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import 'regenerator-runtime/runtime';
import useWindowSize from '../hooks/useViewports';
import { InView } from 'react-intersection-observer';

/**
 *  @param {Object} opts
 *  @param {string} [opts.className]
 *  @param {string[]} [jsonUrls]
 *  @param {string} [backgroundColor]
 *  @param {string} [circleUrl]
 *  @param {string} [buttonBackground]
 *  @param {string} [buttonWording]
 */
export default function TextSelector({
  className,
  jsonUrls = [
    'https://v61265.github.io/demo-text-selector/test-01.json',
    'https://v61265.github.io/demo-text-selector/test-02.json',
  ],
  backgroundColor = '#000000',
  circleUrl = 'https://www.mirrormedia.mg/campaigns/tyreplus2022/hsuan_test.png',
  buttonBackground = 'https://www.mirrormedia.mg/campaigns/tyreplus2022/%E6%9C%AA%E5%91%BD%E5%90%8D%E7%9A%84%E4%BD%9C%E5%93%81%20%E6%8B%B7%E8%B2%9D2%202.png',
  buttonWording = '其他案例',
  debuggedFile = null,
}) {
  const firstOrder = 0;
  let previousRatio = 0;
  const { height } = useWindowSize();
  const allContainerRef = useRef(null);
  const nowEmphasizedSpanRef = useRef(null);
  const itemStartRef = useRef(null);
  const listRef = useRef(null);
  const [data, setData] = useState([]);
  const [emphasizedIndex, setEmphasizedIndex] = useState(0);
  const [leftOffset, setLeftOffset] = useState(0);
  const [translateToParagraph, settranslateToParagraph] = useState(0);
  const [jsonFileIndex, setJsonFileIndex] = useState(null);

  const dataLength = useMemo(() => {
    let result = 0;
    data.forEach((list) => {
      result += list.length;
    });
    return result;
  }, [data]);

  const renderedData = useMemo(() => {
    const returnArr = [];
    data.forEach((item) => {
      returnArr.push(...item);
    });
    const datasWithoutorder = returnArr.map((item) => {
      return {
        ...item,
        order: -1,
      };
    });
    if (returnArr.length < 20) {
      returnArr.unshift(...datasWithoutorder);
      returnArr.push(...datasWithoutorder);
    } else {
      returnArr.unshift(
        ...datasWithoutorder.slice(
          datasWithoutorder.length - 20,
          datasWithoutorder.length - 1
        )
      );
      returnArr.push(...datasWithoutorder.slice(21));
    }
    return returnArr;
  }, [data]);

  function removeHtmlTags(inputString) {
    const regex = /(<([^>]+)>)/gi;
    return inputString?.replace(regex, '');
  }

  const fetchData = useCallback(
    async (jsonIndex) => {
      console.log('fetch data', data[jsonIndex], jsonUrls[jsonIndex], jsonUrls);
      if (data[jsonIndex] || !jsonUrls[jsonIndex]) return;
      try {
        const { data: resData } = await axios.get(jsonUrls[jsonIndex]);
        console.log({ resData });
        const orderArray = Array.from(
          { length: jsonIndex ? resData.length : resData.length - 1 },
          (_, index) => (jsonIndex ? dataLength + index : index + 1)
        );
        const newData = resData.map((item, index) => {
          if (index === firstOrder && !jsonIndex) {
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
        });
        setData((prev) => {
          const newList = [...prev];
          newList[jsonIndex] = newData;
          return newList;
        });
      } catch (e) {
        console.log(e);
      }
    },
    [dataLength]
  );

  const handleOnClickBtn = () => {
    setEmphasizedIndex((prev) => prev + 1);
    if (emphasizedIndex > dataLength - 2) {
      setEmphasizedIndex(1);
    }
  };

  const getScrollDirection = () => {
    let direction = null;
    if (allContainerRef.current) {
      const currentScrollY = window.scrollY;
      if (currentScrollY > allContainerRef.current.scrollY) {
        direction = 'down';
      } else if (currentScrollY < allContainerRef.current.scrollY) {
        direction = 'up';
      }
      allContainerRef.current.scrollY = currentScrollY;
    }
    return direction;
  };

  const hangleOnChangeInview = (inView, entry) => {
    const currentRatio = entry.intersectionRatio;
    const direction = getScrollDirection();
    const { isIntersecting } = entry;
    if (direction === 'down') {
      if (currentRatio > previousRatio && isIntersecting) {
        window.scrollTo({
          top: allContainerRef.current.offsetTop,
          behavior: 'smooth',
        });
      } else {
        window.scrollTo({
          top: allContainerRef.current.offsetTop + height,
          behavior: 'smooth',
        });
      }
    } else if (direction === 'up') {
      if (currentRatio < previousRatio) {
        window.scrollTo({
          top: allContainerRef.current.offsetTop - height,
          behavior: 'smooth',
        });
      } else {
        window.scrollTo({
          top: allContainerRef.current.offsetTop,
          behavior: 'smooth',
        });
      }
    }
    previousRatio = currentRatio;
  };

  useEffect(() => {
    // Adjust video block to cover the whole viewport (100vw)
    const shiftLeft = function () {
      const containerElement = allContainerRef?.current;
      if (typeof containerElement?.getBoundingClientRect === 'function') {
        const rect = containerElement.getBoundingClientRect();
        const leftOffset = rect?.x ?? rect?.left ?? 0;
        setLeftOffset(leftOffset);
      }
    };
    shiftLeft();
  }, [allContainerRef]);

  useEffect(() => {
    if (!data[jsonFileIndex]) {
      fetchData(jsonFileIndex);
    }
  }, [jsonFileIndex]);

  useEffect(() => {
    if (emphasizedIndex >= dataLength - 3 && emphasizedIndex) {
      setJsonFileIndex((prev) => prev + 1);
    }
  }, [dataLength, emphasizedIndex]);

  useEffect(() => {
    if (debuggedFile) {
      setJsonFileIndex(debuggedFile - 1);
    } else {
      setJsonFileIndex(0);
    }
  }, [debuggedFile]);

  useEffect(() => {
    const element = itemStartRef.current;
    if (typeof element?.getBoundingClientRect === 'function') {
      const rect = element.getBoundingClientRect();
      const leftOffset = rect?.x ?? rect?.left ?? 0;
      settranslateToParagraph(listRef.current.offsetLeft - leftOffset);
    }
  }, [emphasizedIndex, data]);

  return (
    <InView onChange={hangleOnChangeInview} threshold={[0.15, 0.85]}>
      <Container
        ref={allContainerRef}
        className={className}
        backgroundColor={backgroundColor}
        leftOffset={leftOffset}
      >
        <CaseList
          ref={listRef}
          translateY={
            listRef.current?.offsetTop -
              nowEmphasizedSpanRef.current?.offsetTop +
              height * (1 / 3) || -height * (1 / 3)
          }
        >
          {renderedData.map((dataItem, dataIndex) => {
            return (
              <span key={dataIndex}>
                {dataItem.order === emphasizedIndex ? (
                  <EmphasizeWrapper
                    ref={nowEmphasizedSpanRef}
                    className='nowItem'
                  >
                    <Anchor ref={itemStartRef} />
                    <EmphasizedItem
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
                  <GreyItem>{removeHtmlTags(dataItem.content)}</GreyItem>
                )}
              </span>
            );
          })}
        </CaseList>
      </Container>
    </InView>
  );
}

const Container = styled.div`
  z-index: 100;
  position: relative;
  min-width: 100vw;
  max-width: 100vw;
  min-height: calc(100vh - 96px);
  max-height: calc(100vh - 96px);
  display: flex;
  justify-content: center;
  overflow: hidden;
  padding: 48px 0;
  border-bottom: 48px;
  scroll-snap-type: y;
  background: ${(props) => props.backgroundColor};
  ::before {
    content: '';
    width: 100vw;
    height: 48px;
    position: absolute;
    top: 0;
    left: 0;
    background: #fff;
    background: ${(props) => props.backgroundColor};
    z-index: 104;
  }
  ::after {
    content: '';
    width: 100vw;
    height: 48px;
    position: absolute;
    bottom: 0;
    left: 0;
    background: #fff;
    background: ${(props) => props.backgroundColor};
    z-index: 200;
  }
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
  poaition: relative;
  max-width: 712px;
  font-family: 'Noto Sans TC';
  font-style: normal;
  font-weight: 350;
  font-size: 14px;
  line-height: 180%;
  text-align: justify;
  color: #fff;
  transition: 1.5s;
  transform: translate(0, ${(props) => props.translateY}px);
  heigth: 100vh;
`;
const GreyItem = styled.li`
  display: inline;
  color: #505050;
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
  transform: translate(${(props) => props.translateToParagraph - 40}px, -30%);
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
  display: flex;
  justify-contnet: center;
  align-items: center;
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

const Anchor = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 10px;
`;

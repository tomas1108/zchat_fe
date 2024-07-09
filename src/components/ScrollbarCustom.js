import { Scrollbars } from 'react-custom-scrollbars';
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { useSelector } from "react-redux";

const ScrollbarCustom = forwardRef(({
  autoHide = true,
  autoHideTimeout = 2000,
  autoHideDuration = 500,
  autoHeight = true,
  autoHeightMin = "100%",
  onScrollFrame,
  ...parameters
}, ref) => {
  const scrollbarsRef = useRef(null);
  const { current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const [loading, setLoading] = useState(false);
  const [loadedMessagesCount, setLoadedMessagesCount] = useState(10);

  const handleScrollFrame = (values) => {
    if (onScrollFrame) {
      onScrollFrame(values);
    }

    const { scrollTop } = values;
    if (scrollTop === 0 && !loading) {
      setLoading(true);
      const oldScrollHeight = scrollbarsRef.current.view.scrollHeight;

      setTimeout(() => {
        setLoadedMessagesCount((prevCount) => prevCount + 10);
        setLoading(false);
        
        // Ensure the scroll position stays at the same place after loading more messages
        if (scrollbarsRef.current) {
          const newScrollHeight = scrollbarsRef.current.view.scrollHeight;
          scrollbarsRef.current.view.scrollTop = newScrollHeight - oldScrollHeight;
        }
      }, 1000); // Simulate a 1-second delay
    }
  };

  useEffect(() => {
    if (scrollbarsRef.current) {
      // Tự động cuộn xuống dưới cùng khi có nội dung mới
      scrollbarsRef.current.scrollToBottom();
    }
  }, [current_messages.length]);

  useImperativeHandle(ref, () => ({
    scrollToBottom: () => {
      if (scrollbarsRef.current) {
        scrollbarsRef.current.scrollToBottom();
      }
    }
  }));

  return (
    <Scrollbars
      autoHide={autoHide}
      autoHideTimeout={autoHideTimeout}
      autoHideDuration={autoHideDuration}
      autoHeight={autoHeight}
      autoHeightMin={autoHeightMin}
      ref={scrollbarsRef}
      onScrollFrame={handleScrollFrame}
      {...parameters}
    >
      {parameters.children}
    </Scrollbars>
  );
});

export default ScrollbarCustom;

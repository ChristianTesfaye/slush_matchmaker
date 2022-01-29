import React from 'react'
const { createElement: h, useRef, useEffect, useState } = require('react');
const NativeDatepickerClass = require('./index');

interface Props {
    value: string,
    onChange: () => any,
    className?: string,
    children?: React.ReactNode
}

const DatePicker: React.FC<Props> = ({
  value = '',
  onChange = () => {},
  className = '',
  children,
}) => {
  const spanRef = useRef(null);
  const [datepicker, setDatepicker] = useState();
  useEffect(() => {
    if (spanRef.current && !datepicker) {
      const picker = new NativeDatepickerClass({
        existingElement: spanRef.current,
        initialValue: value,
        onChange,
      });
      setDatepicker(picker);
    }
  }, [spanRef.current, datepicker]);
  useEffect(() => {
    if (datepicker) {
      datepicker.setValue(value);
    }
  }, [datepicker, value]);
  return h(
    'span',
    {
      ref: spanRef,
      className,
    },
    children
  );
};

export default DatePicker;
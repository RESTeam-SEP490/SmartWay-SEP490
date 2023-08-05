import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, InputNumber, Modal } from 'antd';
import { useAppDispatch } from 'app/config/store';
import { IOrderDetail } from 'app/shared/model/order/order-detail.model';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { orderActions } from '../order.reducer';

export const NumbericKeyboard = ({ detail, isOpen, handleClose }: { detail: IOrderDetail; isOpen: boolean; handleClose: any }) => {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState<string>('');
  const keyboard = useRef(null);
  const inputRef = useCallback(inputElement => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  useEffect(() => {
    setQuantity(detail.quantity ? detail.quantity + '' : '0');
  }, [detail]);

  useEffect(() => {
    if (keyboard.current?.input.default !== quantity) keyboard.current?.setInput(quantity + '');
  }, [quantity]);

  const onChange = (i: string) => {
    let output = i;
    if ((i.match(/[.]/g) || []).length > 1) {
      output = quantity;
    } else if (i[0] === '.' && i.length > 1) output = '0' + output;
    else if (i[0] === '0' && i.length > 1 && i[1] !== '.') output = output.substring(1);
    else if (i.length === 0) output = '0';
    setQuantity(output);
    keyboard.current.setInput(output);
  };

  const handleSubmit = () => {
    const nextQuantity = parseFloat(quantity);
    if (nextQuantity > detail.quantity)
      dispatch(orderActions.adjustDetailQuantity({ orderDetailId: detail.id, quantityAdjust: nextQuantity - detail.quantity }));
    handleClose();
  };

  return (
    <Modal centered open={isOpen} closable={false} width={400} footer={[]} onCancel={handleClose}>
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="text-lg font-semibold text-blue-600">Số lượng:</div>
        <div className="">
          <Button
            type="text"
            className="text-slate-400 hover:!bg-blue-100 hover:!text-blue-600"
            icon={<MinusOutlined rev="" />}
            onClick={() => setQuantity(prev => (parseFloat(prev) - 1 > 0 ? parseFloat(prev) - 1 + '' : '0'))}
          />
          <input
            ref={inputRef}
            className="w-20 !text-2xl !font-semibold border-none focus-visible:outline-none text-center "
            value={quantity}
            onChange={e => onChange(e.target.value)}
          />
          <Button
            type="text"
            className="text-slate-400 hover:!bg-blue-100 hover:!text-blue-600"
            icon={<PlusOutlined rev="" />}
            onClick={() => setQuantity(prev => (parseFloat(prev) + 1 > 0 ? parseFloat(prev) + 1 + '' : '0'))}
          />
        </div>
      </div>
      <Keyboard
        keyboardRef={r => (keyboard.current = r)}
        onChange={input => onChange(input)}
        layout={{ numberic: ['1 2 3', '4 5 6', '7 8 9', '. 0 {backspace}'] }}
        layoutName="numberic"
        buttonTheme={[
          {
            class: 'text-lg !font-light !h-14 !w-20 !text-gray-600 hover:!text-blue-600',
            buttons: '1 2 3 4 5 6 7 8 9 0 . {backspace}',
          },
        ]}
        display={{ '{backspace}': '\u232b' }}
      ></Keyboard>
      <div className="flex gap-2 mt-4">
        <Button size="large" block type="primary" onClick={handleSubmit}>
          {'OK'}
        </Button>
        <Button size="large" block onClick={handleClose}>
          {'Bỏ qua'}
        </Button>
      </div>
    </Modal>
  );
};

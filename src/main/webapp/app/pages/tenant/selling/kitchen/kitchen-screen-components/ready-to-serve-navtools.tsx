import { PrinterFilled } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';

export const RTSNavTool = () => {
  return (
    <>
      <div className="inline-block">
        <Button ghost shape="circle" icon={<PrinterFilled rev="" />}></Button>
      </div>
    </>
  );
};

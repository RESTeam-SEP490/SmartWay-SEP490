import { BsFillPatchCheckFill } from 'react-icons/bs';
import React from 'react';
import { colors } from 'app/config/ant-design-theme';
import { CheckCircleFilled, ClockCircleFilled, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

type Status = 'available' | 'occupied' | 'billed' | 'selected';

export default function TableIcon({ size = 66, status = 'available', order }: { size?: number; status?: Status; order: any }) {
  let fill = 'black';
  switch (status) {
    case 'available': {
      fill = colors.blue[600];
      break;
    }
    case 'billed': {
      fill = colors.green[600];
      break;
    }
    case 'occupied': {
      fill = '#9ca3af';
      break;
    }
    default:
      fill = colors.blue[700];
  }
  return (
    <div className="relative flex">
      <svg width={size} height={(size * 40) / 66} viewBox="0 0 66 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 2C10 0.895431 10.8954 0 12 0H28C29.1046 0 30 0.895431 30 2H10ZM10 38H30C30 39.1046 29.1046 40 28 40H12C10.8954 40 10 39.1046 10 38ZM36 0C34.8954 0 34 0.895431 34 2H54C54 0.895431 53.1046 0 52 0H36ZM34 38H54C54 39.1046 53.1046 40 52 40H36C34.8954 40 34 39.1046 34 38ZM2 9C0.895431 9 0 9.89543 0 11V27C0 28.1046 0.895431 29 2 29V9ZM64 9C65.1046 9 66 9.89543 66 11V27C66 28.1046 65.1046 29 64 29V9ZM11 5H55C58.3137 5 61 7.68629 61 11V29C61 32.3137 58.3137 35 55 35H11C7.68629 35 5 32.3137 5 29V11C5 7.68629 7.68629 5 11 5ZM3 11C3 6.58172 6.58172 3 11 3H55C59.4183 3 63 6.58172 63 11V29C63 33.4183 59.4183 37 55 37H11C6.58172 37 3 33.4183 3 29V11Z"
          fill={fill}
        />
      </svg>
      {order ? (
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] flex gap-2 py-1 px-1.5 rounded-lg 
          ${status === 'billed' ? 'bg-green-100 text-green-600' : ''} 
          ${status === 'occupied' ? 'bg-gray-100 text-gray-600' : ''}`}
          // ${isSelected ? 'bg-white text-blue-700' : 'bg-gray-100 text-gray-600'}
          // `}
        >
          {status === 'billed' ? <CheckCircleFilled className="text-base" rev="" /> : <ClockCircleOutlined className="text-base" rev="" />}
          {dayjs(order.createdDate).format('HH:mm')}
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

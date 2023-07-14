import React, { useState } from 'react';
import { Card, Space, Typography } from 'antd';
import { ShoppingOutlined, TableOutlined } from '@ant-design/icons';

export const TableList = () => {
  const tables = [
    { id: 0, name: 'Takeaway' },
    { id: 1, name: 'Table 1' },
    { id: 2, name: 'Table 2' },
    { id: 3, name: 'Table 3' },
    { id: 4, name: 'Table 4' },
    { id: 5, name: 'Table 5' },
    { id: 6, name: 'Table 6' },
    { id: 7, name: 'Table 7' },
    { id: 8, name: 'Table 8' },
    { id: 9, name: 'Table 9' },
    { id: 10, name: 'Table 10' },
    { id: 11, name: 'Table 11' },
    { id: 12, name: 'Table 12' },
    { id: 13, name: 'Table 13' },
    { id: 14, name: 'Table 14' },
    { id: 15, name: 'Table 15' },
    { id: 16, name: 'Table 16' },
    { id: 17, name: 'Table 17' },
    { id: 18, name: 'Table 18' },
    { id: 19, name: 'Table 19' },
    { id: 20, name: 'Table 20' },
  ];

  const [selectedTable, setSelectedTable] = useState(null);

  const handleTableClick = tableId => {
    setSelectedTable(tableId);
  };

  return (
    <div className="bg-white rounded-e-lg rounded-bl-lg h-screen table-list-container">
      {tables.map(table => (
        <Card
          key={table.id}
          className={`square-card ${selectedTable === table.id ? 'selected' : ''}`}
          onClick={() => handleTableClick(table.id)}
        >
          <div className="flex-container table-item">
            <Space direction="vertical" align="center">
              {table.id === 0 ? (
                <ShoppingOutlined className="table-outlined-color" rev={undefined} />
              ) : (
                <TableOutlined className="table-outlined-color" rev={undefined} />
              )}
              <Typography style={{ color: '#0066CC' }}>{table.name}</Typography>
            </Space>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TableList;

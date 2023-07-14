import React, { useEffect, useState } from 'react';
import { Card, Empty, Space, Typography } from 'antd';
import { ShoppingOutlined, TableOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities } from 'app/pages/user/management/dining-table/dining-table.reducer';
import { translate } from 'react-jhipster';

export const TableList = () => {
  const dispatch = useAppDispatch();
  const diningTableList = useAppSelector(state => state.diningTable.entities);

  useEffect(() => {
    dispatch(getEntities());
  }, [dispatch]);

  const [selectedTable, setSelectedTable] = useState(null);
  const handleTableClick = tableId => {
    setSelectedTable(tableId);
  };

  const sortedDiningTableList = [...diningTableList].sort((a, b) => {
    if (a.name === 'Takeaway') {
      return -1;
    } else if (b.name === 'Takeaway') {
      return 1;
    } else {
      return 0;
    }
  });

  return (
    <div className="bg-white rounded-e-lg rounded-bl-lg h-screen table-list-container">
      {sortedDiningTableList.length > 0 ? (
        sortedDiningTableList.map(table => (
          <Card
            key={table.id}
            className={`square-card ${selectedTable === table.id ? 'selected' : ''}`}
            onClick={() => handleTableClick(table.id)}
          >
            <div className="flex-container table-item">
              <Space direction="vertical" align="center">
                {table.name === 'Takeaway' ? (
                  <ShoppingOutlined className="table-outlined-color" rev={undefined} />
                ) : (
                  <TableOutlined className="table-outlined-color" rev={undefined} />
                )}
                <Typography style={{ color: '#0066CC' }}>{table.name}</Typography>
              </Space>
            </div>
          </Card>
        ))
      ) : (
        <div className="empty-message">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={translate('global.table.empty')} />
        </div>
      )}
    </div>
  );
};

export default TableList;

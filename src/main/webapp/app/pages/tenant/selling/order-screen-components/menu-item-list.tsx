import { SyncOutlined } from '@ant-design/icons';
import { Button, Image, Segmented, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IMenuItem } from 'app/shared/model/menu-item.model';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { MdOutlineFastfood } from 'react-icons/md';
import { DEFAULT_PAGEABLE, currencyFormatter } from '../../../../app.constant';
import { getEntities as getCategories } from '../../management/menu-item-category/menu-item-category.reducer';
import { getEntities as getMenuItems, setPageable } from '../../management/menu-item/menu-item.reducer';

export const MenuItemList = () => {
  const dispatch = useAppDispatch();
  const menuItemList = useAppSelector(state => state.menuItem.entities);
  const categoryList = useAppSelector(state => state.menuItemCategory.entities);

  const [filteredMenuItemList, setFilteredMenuItemList] = useState([]);
  const [filter, setFilter] = useState({ zoneId: '' });

  // useEffect(() => {
  //   dispatch(setPageable({ ...DEFAULT_PAGEABLE, size: 10000, isActive: true }));
  //   dispatch(getMenuItems());
  //   dispatch(getCategories({}));
  // }, []);

  useEffect(() => {
    const { zoneId } = filter;
    let nextFilteredMenuItemList: IMenuItem[] = [...menuItemList];
    if (zoneId?.length > 0) nextFilteredMenuItemList = nextFilteredMenuItemList.filter(item => item.menuItemCategory.id === zoneId);
    setFilteredMenuItemList(nextFilteredMenuItemList);
  }, [filter, menuItemList]);

  const [selectedTable, setSelectedTable] = useState(null);
  const handleTableClick = tableId => {
    setSelectedTable(tableId);
  };

  return (
    <div className="p-2 bg-white h-[calc(100vh-66px)] flex flex-col rounded-se-lg rounded-b-lg">
      <div className="flex justify-between items-center py-4 px-2">
        <Segmented
          options={[{ label: 'All', value: '' }, ...categoryList.map(z => ({ label: z.name, value: z.id }))]}
          onChange={value => setFilter(prev => ({ ...prev, zoneId: value.toString() }))}
        />
        <Button
          size="large"
          icon={<SyncOutlined rev="" />}
          shape="circle"
          type="ghost"
          className="hover:!text-blue-600 !text-slate-600"
        ></Button>
      </div>

      <Scrollbars className="grow  rounded-md bg-gray-200">
        <div className="flex flex-wrap gap-4 m-4 ">{filteredMenuItemList.map(item => MenuItemCard(item))}</div>
      </Scrollbars>
      {/* {tableList.length > 0 ? (
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
            )} */}
    </div>
  );
};

const MenuItemCard = (item: IMenuItem) => (
  <div
    key={item.id}
    className="flex flex-col items-center p-2 pb-2 w-40  text-blue-600 bg-white rounded-lg
    cursor-pointer border border-solid border-transparent hover:border-blue-200 hover:shadow-md"
  >
    <div className="w-full aspect-square bg-blue-100 flex items-center justify-center overflow-hidden rounded-md">
      {item.imageUrl ? (
        <>
          <Image
            preview={false}
            src={item.imageUrl}
            className="overflow-hidden w-full h-full "
            fallback="data:image/png;base64,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"
          />
        </>
      ) : (
        <>
          <MdOutlineFastfood size={40} />
        </>
      )}
    </div>
    <div className="my-2 flex flex-col items-center">
      <Typography.Text className="font-semibold w-32 text-center" ellipsis={{ tooltip: item.name }}>
        {item.name}
      </Typography.Text>
      <Typography.Text className="font-semibold text-blue-600">{currencyFormatter(item.sellPrice)}</Typography.Text>
    </div>
  </div>
);

export default MenuItemList;

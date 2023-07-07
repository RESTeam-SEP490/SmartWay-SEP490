import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { DeleteOutlined, EditFilled, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Empty, Form, Select, Typography } from 'antd';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import { FormType } from 'app/app.constant';
import { IZone } from 'app/shared/model/zone.model';
import Scrollbars from 'react-custom-scrollbars-2';
import { Translate, translate } from 'react-jhipster';
import ZoneDelete from './zone-delete';
import ZoneForm from './zone-form';
import { getEntities } from './zone.reducer';

export const ZoneSelect = () => {
  const [isShowForm, setIsShowForm] = useState(false);

  const categoryList = useAppSelector(state => state.zone.entities).map(c => ({ value: c.id, label: c.name }));
  const loading = useAppSelector(state => state.zone.loading);
  const updateSuccess = useAppSelector(state => state.zone.updateSuccess);

  useEffect(() => {
    if (updateSuccess) {
      setIsShowForm(false);
    }
  }, [updateSuccess]);

  return (
    <div className="flex items-center gap-2">
      <Form.Item name={['zone', 'id']} className="flex-grow" rules={[{ required: true, message: translate('entity.validation.required') }]}>
        <Select
          showSearch
          loading={loading}
          options={categoryList}
          placeholder={translate('diningTable.zone.placeholder')}
          className=""
          notFoundContent={
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={translate(categoryList.length > 0 ? 'global.form.search.nodata' : 'global.table.empty')}
            />
          }
        ></Select>
      </Form.Item>
      <Button className="mb-6" type="text" size="small" shape="circle" onClick={() => setIsShowForm(true)}>
        <PlusOutlined className="text-slate-500" rev={''} />
      </Button>
      <ZoneForm isOpen={isShowForm} handleClose={() => setIsShowForm(false)} />
    </div>
  );
};

export const ZoneCheckBoxes = ({ onFilter }: { onFilter: any }) => {
  const dispatch = useAppDispatch();
  const [isShowForm, setIsShowForm] = useState(false);
  const [isShowDeleteConfirm, setIsShowDeleteConfirm] = useState(false);
  const [selectedZone, setSelectedZone] = useState<IZone>();

  const zoneList = useAppSelector(state => state.zone.entities);
  const [selectedZoneList, setSelectedZoneList] = useState<CheckboxValueType[]>(zoneList.map(c => c.id));

  const loading = useAppSelector(state => state.zone.loading);
  const updateSuccess = useAppSelector(state => state.zone.updateSuccess);

  useEffect(() => {
    dispatch(getEntities({}));
  }, []);

  useEffect(() => {
    onFilter(selectedZoneList);
  }, [selectedZoneList]);

  const handleOpen = (formType: FormType, zone: IZone) => {
    setSelectedZone(zone);
    if (formType === 'delete') setIsShowDeleteConfirm(true);
    else setIsShowForm(true);
  };

  const handleClose = (formType: FormType) => {
    setSelectedZone(undefined);
    if (formType === 'delete') setIsShowDeleteConfirm(false);
    else setIsShowForm(false);
  };

  const handleOnchange = (values: CheckboxValueType[]) => {
    setSelectedZoneList(values);
  };

  return (
    <>
      <Card bordered={false} loading={loading}>
        <div className="flex justify-between">
          <Typography.Title level={5}>
            <Translate contentKey="diningTable.zone.label" />
          </Typography.Title>
          <Button icon={<PlusOutlined rev={''} />} type="primary" size="small" shape="circle" onClick={() => setIsShowForm(true)}></Button>
        </div>
        {zoneList.length > 0 ? (
          <Scrollbars className="!w-[calc(100%+8px)]" autoHeight autoHeightMax={300}>
            <Checkbox.Group className="flex-col w-full pr-2 h-fit" value={selectedZoneList} onChange={handleOnchange}>
              {zoneList.map(zone => (
                <div className="flex justify-between w-full py-2 " key={'checkbox'}>
                  <Checkbox
                    key={zone.id}
                    value={zone.id}
                    className={
                      '!font-normal hover:text-black w-[calc(100%-48px)] checkbox-filters' +
                      (selectedZoneList.some(c => c.toString() === zone.id) ? '' : ' !text-gray-500')
                    }
                  >
                    {zone.name}
                  </Checkbox>
                  <div className="flex">
                    <Button type="link" size="small" shape="circle" onClick={() => handleOpen('edit', zone)}>
                      <EditFilled className="text-slate-300 hover:text-blue-500" rev={''} />
                    </Button>
                    <Button type="link" size="small" shape="circle" onClick={() => handleOpen('delete', zone)}>
                      <DeleteOutlined className="text-slate-300 hover:text-red-400" rev={''} />
                    </Button>
                  </div>
                </div>
              ))}
            </Checkbox.Group>
          </Scrollbars>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={translate('global.table.empty')} />
        )}
      </Card>
      <ZoneForm zone={selectedZone} isOpen={isShowForm} handleClose={() => handleClose('edit')} />
      <ZoneDelete category={selectedZone} isOpen={isShowDeleteConfirm} handleClose={() => handleClose('delete')} />
    </>
  );
};

export default ZoneSelect;

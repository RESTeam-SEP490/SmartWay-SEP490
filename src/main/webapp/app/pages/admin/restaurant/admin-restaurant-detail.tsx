// import React, { useState } from 'react';
// import { Translate, translate } from 'react-jhipster';
// import { CheckSquareFilled, DeleteFilled, EditFilled, LockFilled } from '@ant-design/icons';
// import { Button, DatePicker, Form, Input, Tabs, Typography } from 'antd';
// import { DEFAULT_FORM_ITEM_LAYOUT } from 'app/app.constant';
// import { useAppDispatch } from 'app/config/store';
// import { IRestaurant } from 'app/shared/model/restaurant.model';
// import { parse } from 'date-fns';
//
// export const AdminRestaurantDetail = ({ restaurant, onUpdate }: { restaurant: IRestaurant; onUpdate: any }) => {
//   const dispatch = useAppDispatch();
//   const [isShowDialog, setIsShowDialog] = useState(false);
//
//   return (
//     <>
//       <Tabs defaultValue={1}>
//         <Tabs.TabPane tab={translate('restaurant.information.label')} key={1} className="p-4 details max-w-[calc((100vw-32px)*4/5-66px)]">
//           <div className="">
//             <Typography.Title level={4}>{restaurant.id}</Typography.Title>
//           </div>
//
//           <div className="flex">
//             <Form {...DEFAULT_FORM_ITEM_LAYOUT} colon className="flex-grow">
//               <Form.Item className="!mb-0" label={translate('restaurant.id.label')}>
//                 <Input bordered={false} value={restaurant.id} />
//               </Form.Item>
//               <Form.Item className="!mb-0" label={translate('restaurant.name.label')}>
//                 <Input bordered={false} value={restaurant.name} />
//               </Form.Item>
//               <Form.Item className="!mb-0" label={translate('restaurant.currencyUnit.label')}>
//                 <Input bordered={false} value={restaurant.currencyUnit} />
//               </Form.Item>
//               <Form.Item className="!mb-0" label={translate('restaurant.phone.label')}>
//                 <Input bordered={false} value={restaurant.phone} />
//               </Form.Item>
//
//               <Form.Item className="!mb-0" label={translate('restaurant.planExpiry.label')}>
//                 <DatePicker bordered={false} value={restaurant.planExpiry} />
//               </Form.Item>
//             </Form>
//           </div>
//           <div className="flex justify-end gap-2 mt-4">
//             <Button type="primary" onClick={onUpdate}>
//               <EditFilled rev={''} />
//               <Translate contentKey="entity.action.edit" />
//             </Button>
//             {staff.isActive ? (
//               <Button danger type="primary" icon={<LockFilled rev={''} />} onClick={handleUpdateIsActive}>
//                 <Translate contentKey="staff.action.stopSell" />
//               </Button>
//             ) : (
//               <Button type="primary" icon={<CheckSquareFilled rev={''} />} onClick={handleUpdateIsActive}>
//                 <Translate contentKey="staff.action.allowSell" />
//               </Button>
//             )}
//             <Button type="primary" danger onClick={handleDelete}>
//               <DeleteFilled rev={''} />
//               <Translate contentKey="entity.action.delete" />
//             </Button>
//           </div>
//         </Tabs.TabPane>
//       </Tabs>
//       <StaffDelete staffs={[staff]} handleClose={() => setIsShowDialog(false)} isOpen={isShowDialog} isActive={isActive} />
//     </>
//   );
// };
//
// export default StaffDetail;

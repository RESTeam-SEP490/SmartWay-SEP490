import { FormOutlined, SaveFilled, SaveOutlined } from '@ant-design/icons';
import { Button, Form, FormInstance } from 'antd';
import { FormType } from 'app/app.constant';
import React, { useRef } from 'react';
import { Translate } from 'react-jhipster';
import { initialState } from '../reducers/authentication';

export const SubmitButton = ({ form, isNew, updating }: { form: FormInstance; isNew: boolean; updating: boolean }) => {
  const [isValid, setIsValid] = React.useState(false);

  const values = Form.useWatch([], form);

  React.useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setIsValid(true);
      },
      () => {
        setIsValid(false);
      }
    );
  }, [values]);
  return (
    <Button
      icon={isNew ? <SaveOutlined rev={''} /> : <FormOutlined rev={''} />}
      type="primary"
      loading={updating}
      htmlType="submit"
      disabled={(isNew && !isValid) || (!isNew && (!form.isFieldsTouched() || !isValid))}
    >
      <Translate contentKey={isNew ? 'entity.action.save' : 'entity.action.edit'}></Translate>
    </Button>
  );
};

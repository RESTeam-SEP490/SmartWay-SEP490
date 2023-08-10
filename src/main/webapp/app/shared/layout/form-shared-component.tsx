import { FormOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, FormInstance } from 'antd';
import React from 'react';
import { Translate } from 'react-jhipster';

export const SubmitButton = ({ form, isNew, updating }: { form: FormInstance; isNew: boolean; updating: boolean }) => {
  const [isValid, setIsValid] = React.useState(true);

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
      disabled={!isNew && (!form.isFieldsTouched() || !isValid)}
    >
      <Translate contentKey={isNew ? 'entity.action.save' : 'entity.action.update'} />
    </Button>
  );
};

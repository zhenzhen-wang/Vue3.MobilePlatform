import { parametersApi } from './HrResume/parameters';
import { employerApi } from './HrResume/employer';
import { idCardApi } from './HrResume/idCard';
import { auditApi } from './HrResume/audit';
import { wechatApi } from './HrResume/weChat';

export const api = {
  ...parametersApi,
  ...employerApi,
  ...idCardApi,
  ...auditApi,
  ...wechatApi,
};

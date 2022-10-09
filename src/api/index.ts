import { parametersApi } from './HrResume/parameters';
import { idlResumeApi } from './HrResume/idlResume';
import { idCardApi } from './HrResume/idCard';
import { auditApi } from './HrResume/audit';

export const api = {
  ...parametersApi,
  ...idlResumeApi,
  ...idCardApi,
  ...auditApi,
};

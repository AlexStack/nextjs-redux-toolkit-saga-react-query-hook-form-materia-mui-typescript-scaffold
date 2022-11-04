/* eslint-disable no-console */

import { IS_DEV } from '../constants/article-const';

/* eslint-disable import/prefer-default-export */
export const consoleLog = (
  var1: any,
  var2: any = 'DEF_VAR_2',
  var3: any = 'DEF_VAR_3',
  var4: any = 'DEF_VAR_4',
  var5: any = 'DEF_VAR_5',
) => {
  if (IS_DEV) {
    const newVar1 = typeof var1 === 'string' ? `🚀 🚀 🚀 ${var1}` : var1;

    if (var5 !== 'DEF_VAR_5') {
      console.log(newVar1, var2, var3, var4, var5);
    } else if (var4 !== 'DEF_VAR_4') {
      console.log(newVar1, var2, var3, var4);
    } else if (var3 !== 'DEF_VAR_3') {
      console.log(newVar1, var2, var3);
    } else if (var2 !== 'DEF_VAR_2') {
      console.log(newVar1, var2);
    } else {
      console.log(newVar1);
    }
  }
};

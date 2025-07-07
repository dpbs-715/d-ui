import { onUnmounted, reactive } from 'vue';

export const useRefCollect = () => {
  const refObj: any = reactive({});
  function handleRef(el: any, refKey: any) {
    if (el) {
      refObj[refKey] = el;
    }
  }

  function getRefsValidateArr(keys?: string | string[] | undefined) {
    const promiseArr = [];
    if (Array.isArray(keys) && keys.length > 0) {
      keys.forEach((key) => {
        if (refObj[key]) {
          promiseArr.push(
            refObj[key].validateForm ? refObj[key].validateForm() : refObj[key].validateField(),
          );
        }
      });
    } else if (keys && typeof keys === 'string') {
      if (refObj[keys]) {
        promiseArr.push(
          refObj[keys].validateForm ? refObj[keys].validateForm() : refObj[keys].validateField(),
        );
      }
    } else {
      for (const refObjKey in refObj) {
        if (refObj[refObjKey]) {
          promiseArr.push(
            refObj[refObjKey].validateForm
              ? refObj[refObjKey].validateForm()
              : refObj[refObjKey].validateField(),
          );
        }
      }
    }
    return Promise.all(promiseArr);
  }

  function clearRefsValidate(keys?: string | string[] | undefined) {
    setTimeout(() => {
      if (Array.isArray(keys) && keys.length > 0) {
        keys.forEach((key) => {
          if (refObj[key]) {
            refObj[key]?.clearValidate?.();
          }
        });
      } else if (keys && typeof keys === 'string') {
        if (refObj[keys]) {
          refObj[keys]?.clearValidate?.();
        }
      } else {
        for (const refObjKey in refObj) {
          if (refObj[refObjKey]) {
            refObj[refObjKey]?.clearValidate?.();
          }
        }
      }
    }, 20);
  }

  return {
    clearRefsValidate,
    handleRef,
    refObj,
    getRefsValidateArr,
  };
};

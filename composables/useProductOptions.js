export const useProductOptions = (activeOptions) => {
  const getSelectedOptionValue = (option, selectedIds) => {
    const optionValuesIds = option.values.map((value) => value.id);
    return optionValuesIds.find((id) => selectedIds.includes(id));
  };
  return { getSelectedOptionValue };
};

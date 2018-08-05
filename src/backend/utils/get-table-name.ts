export function getTableName(tableName: string): string {
  const formattedName = tableName.match(/\d+/);

  if (formattedName) {
    return `Table ${formattedName}`;
  } else {
    return tableName;
  }
}

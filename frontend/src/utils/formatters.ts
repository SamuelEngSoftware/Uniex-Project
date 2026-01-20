export const formatDate = (dateString: string): string => {
  if (!dateString) return 'A definir';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}
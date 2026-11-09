/** Formatações em português simples, pensadas para leitura rápida. */

export function formatarHora(iso: string): string {
  const data = new Date(iso);
  return `${String(data.getHours()).padStart(2, '0')}:${String(data.getMinutes()).padStart(2, '0')}`;
}

export function formatarDataHora(iso: string): string {
  const data = new Date(iso);
  const hoje = new Date();
  const ontem = new Date();
  ontem.setDate(hoje.getDate() - 1);
  const mesmoDia = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (mesmoDia(data, hoje)) return `Hoje às ${formatarHora(iso)}`;
  if (mesmoDia(data, ontem)) return `Ontem às ${formatarHora(iso)}`;
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes} às ${formatarHora(iso)}`;
}

export function tempoDesde(iso: string): string {
  const minutos = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (minutos < 1) return 'agora mesmo';
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return resto === 0 ? `há ${horas}h` : `há ${horas}h${String(resto).padStart(2, '0')}`;
}

export function formatarGraus(valor: number): string {
  return `${valor.toFixed(1).replace('.', ',')} °C`;
}

export function formatarDiaSemana(dataISO: string): string {
  const [ano, mes, dia] = dataISO.split('-').map(Number);
  const nomes = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  return nomes[new Date(ano, mes - 1, dia).getDay()];
}

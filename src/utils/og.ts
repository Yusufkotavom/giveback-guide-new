export function generateOgImageFromTitle(title: string): string {
  const basePublicId = 'v1754820661/Tanpa_judul_Presentasi__20250810_170926_0000_vdiibn.png';
  const cloudName = 'dxyjku3eh';
  const encodedTitle = encodeURIComponent(title.replace(/\n/g, ' ').slice(0, 120));
  const overlay = `l_text:Inter_64_bold:${encodedTitle},co_rgb:ffffff,g_south,y_80`;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${overlay}/${basePublicId}`;
}
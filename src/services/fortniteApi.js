const API_URL = "https://fortnite-api.com/v2/cosmetics/br";

export async function obtenerSkins() {
  const respuesta = await fetch(API_URL);

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar las skins");
  }

  const resultado = await respuesta.json();

  return resultado.data.filter(
    (item) => item.type?.value === "outfit"
  );
}

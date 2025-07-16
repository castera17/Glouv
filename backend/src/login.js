const TiempoYa = () => 
{
    const TiempoActual= new Date();

    const tiempoya = {
    FechaActual: new Date(Date.now()),
    Hora : String(TiempoActual.getHours()),
    Minutos : String(TiempoActual.getMinutes()),
    Segundos : String(TiempoActual.getSeconds())
    };
    return tiempoya;
}
export default TiempoYa

 
import { useState, useEffect } from "react";
import { Atom } from "react-loading-indicators";
const AtomWithCounter = () => {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);
    return () => clearInterval(interval); // Limpiar el intervalo al desmontar
  }, []);
  return <div className="flex flex-col items-center">
      <Atom color="#3194cc" size="large" text="Generando tu reporte..." textColor="#ffffff" />
      <p className="mt-4 large-bold-text text-muted-foreground">Investigando por: [{seconds} segundos]</p>

    </div>;
};
export default AtomWithCounter;

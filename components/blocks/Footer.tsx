import Link from "next/link";
import Logo from "./Logo";
import { footer } from "@/config/landing-page-config";
import { getMetrics } from "@/config/landing-page-config";

const metrics = await getMetrics();

const Footer = () => {
  

  return <footer id="footer">
      <hr />

          {/* Mostrar iframe si active users (metrics[3]) es mayor a 3 */}
          {Number(metrics[2].value) > 100 && (
            <iframe
              src="https://waitfast.netlify.app/embed/waitlist/ac7f7828-7c31-4baa-a768-f5e769bad93e?theme=light&size=md"
              style={{ border: 'none', width: '100%', height: '500px' }}
              title="[on]MMaTeX Waitlist"
            ></iframe>
          )}

      <section className="container py-20 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-12 gap-y-8">
        <div className="col-span-full xl:col-span-2">
          <Logo />
        </div>



        {footer.map(({
        title,
        links
      }, i) => <div key={i} className="flex flex-col gap-2">
            <h3 className="text-lg text-primary">{title}</h3>
            {links.map(({
          url,
          name
        }, i) => <Link key={i} href={url} className="opacity-60 hover:opacity-100 text-sm">
                {name}
              </Link>)}
          </div>)}
      </section>



      <section className="container pb-14 text-center text-sm opacity-75 opacity-">
        <h3>Copyright ©{new Date().getFullYear()}- Todos los derechos reservados. Potenciando la investigación profunda y la excelencia académica mediante la generación de documentos impulsada por IA.</h3>
      </section>
    </footer>;
};
export default Footer;
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsFacebook, BsInstagram, BsGithub, BsTwitter } from "react-icons/bs";

export default function FooterComp() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1">
          {/* //?---------------------------- Logo Div ------------------------------------------------------ */}
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Lav's{" "}
              </span>
              Blog
            </Link>
          </div>

          {/* //?---------------------------- 3 Item div --------------------------------------------------------------------- */}
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            {/* //?---------------------------- Footer About Section -------------------- */}
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link href="/about" target="_blank">
                  Lav's Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            {/* //?---------------------------- Footer Follow Us Section -------------------- */}
            <div>
              <Footer.Title title="Follow us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/yadavlav7978"
                  target="_blank"
                >
                  Github
                </Footer.Link>

                <Footer.Link
                  href="https://www.linkedin.com/in/lav-yadav-1055a5211/"
                  target="_blank"
                >
                  Linkedin
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            {/* //?---------------------------- Footer Legal Section -------------------- */}
            <div>
              <Footer.Title title="Legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>

                <Footer.Link href="#">Term &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
{/* //?---------------------------- Copyright and Contact Section -------------------- */}
        <Footer.Divider />

        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="Lav's Blog"
            year={new Date().getFullYear()}
          />

          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href="#" icon={BsFacebook} />
            <Footer.Icon href="#" icon={BsInstagram} />
            <Footer.Icon href="#" icon={BsTwitter} />
            <Footer.Icon
              href="https://github.com/yadavlav7978"
              icon={BsGithub}
            />
          </div>
        </div>
      </div>
    </Footer>
  );
}

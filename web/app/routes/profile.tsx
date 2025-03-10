import { useContext, useEffect, useRef } from "react";
import { GlobalContext } from "~/context/globalContext";

export default function Profile() {
  const { user, loading } = useContext(GlobalContext);
  const tableauRef = useRef(null);

  useEffect(() => {
    // Only initialize Tableau if we have a user and the component is mounted
    if (user && tableauRef.current) {
      const divElement = tableauRef.current as HTMLDivElement;
      // Create the visualization after the DOM is ready
      const initTableau = () => {
        // Create object element for Tableau
        const vizElement = divElement.getElementsByTagName("object")[0];

        // Set responsive sizing based on width
        if (divElement.offsetWidth > 800) {
          vizElement.style.width = "1000px";
          vizElement.style.height = "827px";
        } else if (divElement.offsetWidth > 500) {
          vizElement.style.width = "1000px";
          vizElement.style.height = "827px";
        } else {
          vizElement.style.width = "100%";
          vizElement.style.height = "1327px";
        }

        // Add the Tableau script dynamically
        const scriptElement = document.createElement("script");
        scriptElement.src =
          "https://public.tableau.com/javascripts/api/viz_v1.js";
        if (vizElement.parentNode) {
          vizElement.parentNode.insertBefore(scriptElement, vizElement);
        }
      };

      // Small timeout to ensure DOM is ready
      setTimeout(initTableau, 100);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-500">Please login to view your profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-6xl mb-8">
        <h1 className="text-3xl font-sentient text-primary mb-2">
          Hi, {user.full_name}
        </h1>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-6xl">
        <div
          className="tableauPlaceholder"
          id="viz1741613593879"
          style={{ position: "relative" }}
          ref={tableauRef}
        >
          <noscript>
            <a href="#">
              <img
                alt="Dashboard 1"
                src="https://public.tableau.com/static/images/In/IndividualWise/Dashboard1/1_rss.png"
                style={{ border: "none" }}
              />
            </a>
          </noscript>
          <object className="tableauViz" style={{ display: "none" }}>
            <param
              name="host_url"
              value="https%3A%2F%2Fpublic.tableau.com%2F"
            />
            <param name="embed_code_version" value="3" />
            <param name="site_root" value="" />
            <param name="name" value="IndividualWise/Dashboard1" />
            <param name="tabs" value="no" />
            <param name="toolbar" value="yes" />
            <param
              name="static_image"
              value="https://public.tableau.com/static/images/In/IndividualWise/Dashboard1/1.png"
            />
            <param name="animate_transition" value="yes" />
            <param name="display_static_image" value="yes" />
            <param name="display_spinner" value="yes" />
            <param name="display_overlay" value="yes" />
            <param name="display_count" value="yes" />
            <param name="language" value="en-US" />
          </object>
        </div>
      </div>
    </div>
  );
}

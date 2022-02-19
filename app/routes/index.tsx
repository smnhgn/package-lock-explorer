import _ from "lodash";
import { useCallback, useState } from "react";
import Dropzone from "react-dropzone";
import ReactFlow from "react-flow-renderer";

import { useGraphElements } from "~/hooks/useGraphElements";
import { PackageLock } from "~/types/package-lock";
import styles from "~/styles/routes/index.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function Index() {
  const [packageLock, setPackageLock] = useState<PackageLock>();
  const graphElements = useGraphElements(packageLock);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        if (!reader.result) {
          throw "no content";
        }
        const json = JSON.parse(reader.result as string);
        setPackageLock(json);
      };
      reader.readAsText(file, "utf8");
    });
  }, []);

  return (
    <main>
      {_.isEmpty(packageLock) ? (
        <Dropzone onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
            <section className="dropzone">
              <div className="dropzone-inner" {...getRootProps()}>
                <input {...getInputProps()} />
                <p>drop your package-lock.json</p>
              </div>
            </section>
          )}
        </Dropzone>
      ) : (
        <div className="react-flow-container">
          <ReactFlow elements={graphElements}></ReactFlow>
        </div>
      )}
    </main>
  );
}

import { Presets, SingleBar } from "cli-progress"
import Diagnostic from "./utilities/Diagnostic"

async function runBenchmark() {
    
  const progressBar = new SingleBar({
    format: "Progress |{bar}| {percentage}% || {value}/{total} Checks\n",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  }, Presets.shades_classic)

  try {
    const result = await Diagnostic.benchmark(progressBar)
    
            
        
        for (const [component, details] of Object.entries(result.details)) {
      }:`)
            
      if (component === "network") {
        const networkValue = details.value as { download: number; upload: number }
        } Mbps`)
        } Mbps`)
      } else {
        .toFixed(2)} ${getUnit(component)}`)
      }
    }

    if (!result.compliant) {
                }
    process.exit(0)

  } catch (error) {
    console.error("Error running benchmark:", error)
    process.exit(1)
  }
}

function getUnit(component: string): string {
  switch (component.toLowerCase()) {
    case "cpu":
      return "MHz"
    case "ram":
    case "disk":
      return "GB"
    case "network":
      return "Mbps"
    default:
      return ""
  }
}

runBenchmark()

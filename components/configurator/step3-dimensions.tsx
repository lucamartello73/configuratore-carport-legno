"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import type { ConfigurationData } from "@/app/configuratore/page"

interface Step3Props {
  configuration: Partial<ConfigurationData>
  updateConfiguration: (data: Partial<ConfigurationData>) => void
}

export function Step3Dimensions({ configuration, updateConfiguration }: Step3Props) {
  const [width, setWidth] = useState(configuration.width || 300)
  const [depth, setDepth] = useState(configuration.depth || 500)
  const [height, setHeight] = useState(configuration.height || 250)

  useEffect(() => {
    updateConfiguration({ width, depth, height })
  }, [width, depth, height, updateConfiguration])

  return (
    <div className="space-y-8">
      <p className="text-gray-800 text-center">Imposta le dimensioni del tuo carport</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Width */}
          <Card className="p-6">
            <Label className="text-gray-900 font-semibold mb-4 block">Larghezza: {width} cm</Label>
            <Slider
              value={[width]}
              onValueChange={(value) => setWidth(value[0])}
              min={200}
              max={800}
              step={50}
              className="mb-4"
            />
            <Input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              min={200}
              max={800}
              className="w-full"
            />
          </Card>

          {/* Depth */}
          <Card className="p-6">
            <Label className="text-gray-900 font-semibold mb-4 block">Profondità: {depth} cm</Label>
            <Slider
              value={[depth]}
              onValueChange={(value) => setDepth(value[0])}
              min={300}
              max={1000}
              step={50}
              className="mb-4"
            />
            <Input
              type="number"
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              min={300}
              max={1000}
              className="w-full"
            />
          </Card>

          {/* Height */}
          <Card className="p-6">
            <Label className="text-gray-900 font-semibold mb-4 block">Altezza: {height} cm</Label>
            <Slider
              value={[height]}
              onValueChange={(value) => setHeight(value[0])}
              min={200}
              max={350}
              step={25}
              className="mb-4"
            />
            <Input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min={200}
              max={350}
              className="w-full"
            />
          </Card>
        </div>

        {/* Preview */}
        <div className="flex items-center justify-center">
          <Card className="p-6 bg-green-50">
            <h3 className="text-gray-900 font-semibold mb-4 text-center">Anteprima Dimensioni</h3>
            <div className="text-center space-y-2">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-gray-900">
                  {width} × {depth} × {height} cm
                </div>
                <div className="text-gray-700 mt-2">Superficie: {((width * depth) / 10000).toFixed(1)} m²</div>
              </div>
              <div className="mt-4">
                <img
                  src="/carport-3d-preview.jpg"
                  alt="Anteprima carport"
                  className="w-full max-w-sm mx-auto rounded-lg"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

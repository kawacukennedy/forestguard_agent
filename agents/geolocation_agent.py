from shapely.geometry import Polygon

def run_geolocation_agent(polygons, metadata):
    if not polygons:
        return {"geo_coordinates": [], "area_m2": 0, "estimated_carbon_loss": 0}
    # Calculate area
    poly = Polygon(polygons[0]['coordinates'])
    area_m2 = poly.area
    # Improved carbon estimate: assume tropical forest, 200 tons CO2 per hectare
    area_ha = area_m2 / 10000
    estimated_carbon_loss = area_ha * 200 * 1000  # kg CO2
    return {
        "geo_coordinates": polygons,
        "area_m2": area_m2,
        "estimated_carbon_loss": estimated_carbon_loss
    }
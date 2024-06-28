import UIKit
import ARKit
import CoreLocation
import WebKit
import MapKit

class ViewController: UIViewController, ARSCNViewDelegate, CLLocationManagerDelegate {
    @IBOutlet var sceneView: ARSCNView!
    @IBOutlet weak var distanceLabel: UILabel!//位置情報取得のために追加
    
    //位置情報取得のために追加
    var locationManager = CLLocationManager()
    let targetLocation = CLLocationCoordinate2D(latitude: 35.468716,longitude: 135.395109)
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // ARSCNViewDelegateの設定
        sceneView.delegate = self
        
        sceneView.debugOptions = .showWorldOrigin
        sceneView.showsStatistics = true
        
        // シーンファイルを読み込む
        guard let scene = SCNScene(named: "art.scnassets/cube.scn") else {
            fatalError("Scene file not found")
        }
        sceneView.scene = scene
        
        // CoreLocationの設定
        locationManager.delegate = self
        locationManager.requestWhenInUseAuthorization()
        locationManager.startUpdatingLocation()
        locationManager.distanceFilter = kCLDistanceFilterNone
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        // ARセッションの設定
        let configuration = ARWorldTrackingConfiguration()
        configuration.worldAlignment = .gravityAndHeading
        sceneView.session.run(configuration)
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        
        // ARセッションを一時停止
        sceneView.session.pause()
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }
        
        // 現在の位置を取得
        let currentLocation = location.coordinate
        
        // 距離を計算
        let distance = location.distance(from: CLLocation(latitude: targetLocation.latitude, longitude: targetLocation.longitude))
        
        // UILabelがnilでないか確認
        if let distanceLabel = distanceLabel {
            distanceLabel.text = String(format: "%.2f meters", distance)
        } else {
            print("distanceLabel is nil")
        }
        
        // 方角を計算
        let direction = getDirection(from: currentLocation, to: targetLocation)
        
        // 3Dモデルの位置を更新
        placeModelInDirection(direction: direction, distance: distance)
    }
    
    func getDirection(from: CLLocationCoordinate2D, to: CLLocationCoordinate2D) -> Double {
        let fromLat = degreesToRadians(from.latitude)
        let fromLon = degreesToRadians(from.longitude)
        let toLat = degreesToRadians(to.latitude)
        let toLon = degreesToRadians(to.longitude)
        
        let deltaLon = toLon - fromLon
        let y = sin(deltaLon) * cos(toLat)
        let x = cos(fromLat) * sin(toLat) - sin(fromLat) * cos(toLat) * cos(deltaLon)
        let radiansBearing = atan2(y, x)
        
        return radiansToDegrees(radiansBearing)
    }
    
    func degreesToRadians(_ degrees: Double) -> Double {
        return degrees * .pi / 180.0
    }
    

    func radiansToDegrees(_ radians: Double) -> Double {
        return radians * 180.0 / .pi
    }
    
    func placeModelInDirection(direction: Double, distance: CLLocationDistance) {
        // デバイスの向きを取得
        guard let currentFrame = sceneView.session.currentFrame else { return }
        let cameraTransform = currentFrame.camera.transform
        let cameraOrientation = SCNVector3(-cameraTransform.columns.2.x, -cameraTransform.columns.2.y, -cameraTransform.columns.2.z)
        let cameraPosition = SCNVector3(cameraTransform.columns.3.x, cameraTransform.columns.3.y, cameraTransform.columns.3.z)
        
        // 既存のターゲットノードを削除
        sceneView.scene.rootNode.childNode(withName: "targetNode", recursively: true)?.removeFromParentNode()
        
        // 3Dモデルを方向に配置
        let node = SCNNode()
        node.name = "targetNode"
        let box = SCNBox(width: 0.1, height: 0.1, length: 0.1, chamferRadius: 0)
        node.geometry = box
        
        // directionを元にノードの位置を計算
        let distanceInMeters: Float = 0.5
        let angleInRadians = Float(degreesToRadians(direction))
        let x = distanceInMeters * cos(angleInRadians)
        let z = distanceInMeters * sin(angleInRadians)
        
        // カメラの向きに対してモデルを配置
        node.position = SCNVector3(cameraPosition.x + x * cameraOrientation.z,
                                   cameraPosition.y,
                                   cameraPosition.z + z * cameraOrientation.z)
        
        sceneView.scene.rootNode.addChildNode(node)
        addTextNode(direction: direction, distance: distance)
    }
    
    func addTextNode(direction: Double, distance: CLLocationDistance) {
        guard let currentFrame = sceneView.session.currentFrame else { return }
        let cameraTransform = currentFrame.camera.transform
        let cameraOrientation = SCNVector3(-cameraTransform.columns.2.x, -cameraTransform.columns.2.y, -cameraTransform.columns.2.z)
        let cameraPosition = SCNVector3(cameraTransform.columns.3.x, cameraTransform.columns.3.y, cameraTransform.columns.3.z)
        
        let textNode = SCNNode()
        let textGeometry = SCNText(string: String(format: "自転車置き場まであと %.2f m", distance), extrusionDepth: 1.0)
        textGeometry.firstMaterial?.diffuse.contents = UIColor.red  // 文字色を赤に設定
        textNode.geometry = textGeometry
        textNode.scale = SCNVector3(0.05, 0.05, 0.05)  // 文字のサイズを調整
        
        let angleInRadians = Float(degreesToRadians(direction))
        let x = 0.5 * cos(angleInRadians)
        let z = 0.5 * sin(angleInRadians)
        
        textNode.position = SCNVector3(cameraPosition.x + x * cameraOrientation.x - z * cameraOrientation.z,
                                       cameraPosition.y + 0.3,  // 高さ調整
                                       cameraPosition.z + z * cameraOrientation.x + x * cameraOrientation.z)
        
        sceneView.scene.rootNode.addChildNode(textNode)
    }
}

class webViewController: UIViewController, WKNavigationDelegate{
    @IBOutlet weak var webView: WKWebView!
    override func viewDidLoad(){
        super.viewDidLoad()
        webView.navigationDelegate = self
        loadWebPage()
    }
    
    func loadWebPage(){
        if let url = URL(string: "https://karayab2024.web.app"){
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }
}

class MapViewController: UIViewController,CLLocationManagerDelegate,MKMapViewDelegate {
    @IBOutlet weak var map: MKMapView!
    
    var locationManager: CLLocationManager!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        locationManager = CLLocationManager()
        locationManager.delegate = self
        locationManager!.requestWhenInUseAuthorization()
        
        map.delegate = self
        initMap()
    }
    // 許可を求めるためのdelegateメソッド
    func locationManager(_ manager: CLLocationManager,didChangeAuthorization status: CLAuthorizationStatus) {
            switch status {
            // 許可されてない場合
            case .notDetermined:
            // 許可を求める
                manager.requestWhenInUseAuthorization()
            // 拒否されてる場合
            case .restricted, .denied:
                // 何もしない
                break
            // 許可されている場合
            case .authorizedAlways, .authorizedWhenInUse:
                // 現在地の取得を開始
                manager.startUpdatingLocation()
                break
            default:
                break
            }
        }
    
    func initMap(){
        var region:MKCoordinateRegion = map.region
        region.span.latitudeDelta = 0.02
        region.span.longitudeDelta = 0.02
        map.setRegion(region,animated:true)
        
        // 現在位置表示の有効化
        map.showsUserLocation = true
        // 現在位置設定(デバイスの動きとしてこの時の一回だけ中心位置が現在位置で更新される)
        map.userTrackingMode = .follow
       
       // 指定の座標にピンを立てる
       addPinAtCoordinate(latitude: 35.468709, longitude: 135.395093, title: "ME-Bikeステーション", subtitle: "東舞鶴駅")
       addPinAtCoordinate(latitude: 35.495514, longitude: 135.439459, title: "ME-Bikeステーション", subtitle: "舞鶴高専")
    }
   
   //ピンを立てる関数
   func addPinAtCoordinate(latitude: CLLocationDegrees, longitude: CLLocationDegrees, title: String, subtitle: String) {
       let coordinate = CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
       let annotation = MKPointAnnotation()
       annotation.coordinate = coordinate
       annotation.title = title
       annotation.subtitle = subtitle
       map.addAnnotation(annotation)
   }
   
   // MKMapViewDelegate method for custom annotation view
   func mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView? {
       if annotation is MKUserLocation {
           return nil
       }
       
       let identifier = "pin"
      var annotationView = mapView.dequeueReusableAnnotationView(withIdentifier: identifier) as? MKMarkerAnnotationView
       
       if annotationView == nil {
          annotationView = MKMarkerAnnotationView(annotation: annotation, reuseIdentifier: identifier)
           annotationView?.canShowCallout = true
       } else {
           annotationView?.annotation = annotation
       }
       
       return annotationView
   }
   
   // MKMapViewDelegate method for annotation selection
   func mapView(_ mapView: MKMapView, didSelect view: MKAnnotationView) {
       if let subtitle = view.annotation?.subtitle, subtitle == "舞鶴高専" {
           presentHalfModal()
       }
   }
   
   func presentHalfModal() {
       let halfModalVC = HalfModalViewController()
       halfModalVC.modalPresentationStyle = .pageSheet
       if let sheet = halfModalVC.sheetPresentationController {
           sheet.detents = [.medium(), .large()]
       }
       present(halfModalVC, animated: true, completion: nil)
   }
}

//舞鶴高専スポットのハーフモーダル
class HalfModalViewController: UIViewController {
    override func viewDidLoad() {
      super.viewDidLoad()
      view.backgroundColor = .black
        
      // Add content to the modal
      let label = UILabel()
      label.text = "ME-Bikeステーション"
      label.textAlignment = .left
      label.translatesAutoresizingMaskIntoConstraints = false
      view.addSubview(label)
       
      NSLayoutConstraint.activate([
           label.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
           label.topAnchor.constraint(equalTo: view.topAnchor, constant: 20)
      ])
       
      //舞鶴高専ステーション
      let titleL = UILabel()
      titleL.text = "舞鶴高専スポット"
      titleL.textAlignment = .left
      titleL.font = UIFont.boldSystemFont(ofSize: 30)
      titleL.translatesAutoresizingMaskIntoConstraints = false
      view.addSubview(titleL)
        
       NSLayoutConstraint.activate([
           titleL.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
           titleL.topAnchor.constraint(equalTo: view.topAnchor, constant: 42)
       ])
    }
}
